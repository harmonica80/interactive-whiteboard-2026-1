Add-Type -AssemblyName System.Drawing

$source = @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Collections.Generic;

public class AvatarProcessor {
    public static void ProcessImage(string inputPath, string outputPath) {
        using (Bitmap src = new Bitmap(inputPath)) {
            int width = src.Width;
            int height = src.Height;
            using (Bitmap dest = new Bitmap(width, height, PixelFormat.Format32bppArgb)) {
                BitmapData srcData = src.LockBits(new Rectangle(0, 0, width, height), ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
                BitmapData destData = dest.LockBits(new Rectangle(0, 0, width, height), ImageLockMode.WriteOnly, PixelFormat.Format32bppArgb);
                
                int[] pixels = new int[width * height];
                System.Runtime.InteropServices.Marshal.Copy(srcData.Scan0, pixels, 0, pixels.Length);
                src.UnlockBits(srcData);

                bool[] isBg = new bool[width * height];
                Queue<int> queue = new Queue<int>();

                // Helper to check if pixel is black background
                Func<int, bool> isDark = (color) => {
                    int r = (color >> 16) & 0xFF;
                    int g = (color >> 8) & 0xFF;
                    int b = color & 0xFF;
                    return (r <= 20 && g <= 20 && b <= 20);
                };

                // Seed outer borders
                for (int x = 0; x < width; x++) {
                    int topIdx = x;
                    int btmIdx = (height - 1) * width + x;
                    if (isDark(pixels[topIdx])) { isBg[topIdx] = true; queue.Enqueue(topIdx); }
                    if (isDark(pixels[btmIdx])) { isBg[btmIdx] = true; queue.Enqueue(btmIdx); }
                }
                for (int y = 0; y < height; y++) {
                    int leftIdx = y * width;
                    int rightIdx = y * width + (width - 1);
                    if (isDark(pixels[leftIdx]) && !isBg[leftIdx]) { isBg[leftIdx] = true; queue.Enqueue(leftIdx); }
                    if (isDark(pixels[rightIdx]) && !isBg[rightIdx]) { isBg[rightIdx] = true; queue.Enqueue(rightIdx); }
                }

                // Also seed cell grid line intersections if dark
                for (int cx = 0; cx < 8; cx++) {
                    for (int cy = 0; cy < 6; cy++) {
                        int idx = (cy * 128) * width + (cx * 128);
                        if (isDark(pixels[idx]) && !isBg[idx]) {
                            isBg[idx] = true;
                            queue.Enqueue(idx);
                        }
                    }
                }

                // BFS flood fill
                int[] dx = { 1, -1, 0, 0 };
                int[] dy = { 0, 0, 1, -1 };
                while (queue.Count > 0) {
                    int curr = queue.Dequeue();
                    int cx = curr % width;
                    int cy = curr / width;

                    for (int i = 0; i < 4; i++) {
                        int nx = cx + dx[i];
                        int ny = cy + dy[i];
                        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                            int nIdx = ny * width + nx;
                            if (!isBg[nIdx] && isDark(pixels[nIdx])) {
                                isBg[nIdx] = true;
                                queue.Enqueue(nIdx);
                            }
                        }
                    }
                }

                // Write output pixels with alpha
                int[] outPixels = new int[width * height];
                for (int i = 0; i < pixels.Length; i++) {
                    if (isBg[i]) {
                        outPixels[i] = 0; // transparent
                    } else {
                        // Check if this non-bg pixel touches a background pixel (edge softening)
                        int px = i % width;
                        int py = i / width;
                        bool touchesBg = false;
                        if (px > 0 && isBg[i - 1]) touchesBg = true;
                        else if (px < width - 1 && isBg[i + 1]) touchesBg = true;
                        else if (py > 0 && isBg[i - width]) touchesBg = true;
                        else if (py < height - 1 && isBg[i + width]) touchesBg = true;

                        int c = pixels[i];
                        int r = (c >> 16) & 0xFF;
                        int g = (c >> 8) & 0xFF;
                        int b = c & 0xFF;
                        int maxVal = Math.Max(r, Math.Max(g, b));

                        if (touchesBg && maxVal < 45) {
                            int alpha = Math.Min(255, Math.Max(0, (maxVal - 15) * 255 / 30));
                            outPixels[i] = (alpha << 24) | (r << 16) | (g << 8) | b;
                        } else {
                            outPixels[i] = (255 << 24) | (r << 16) | (g << 8) | b;
                        }
                    }
                }

                System.Runtime.InteropServices.Marshal.Copy(outPixels, 0, destData.Scan0, outPixels.Length);
                dest.UnlockBits(destData);
                dest.Save(outputPath, ImageFormat.Png);
            }
        }
    }
}
"@

Add-Type -TypeDefinition $source -ReferencedAssemblies System.Drawing

if (!(Test-Path "images")) { New-Item -ItemType Directory -Path "images" }
$p1 = 'C:/Users/user/.gemini/antigravity/brain/1f8e8781-77a7-42d0-bb6b-cad1bf6f263d/.user_uploaded/media_1790387256204.jpg'
$p2 = 'C:/Users/user/.gemini/antigravity/brain/1f8e8781-77a7-42d0-bb6b-cad1bf6f263d/.user_uploaded/media_1790387262648.jpg'

$out1 = "images/avatars_sheet1.png"
$out2 = "images/avatars_sheet2.png"

Write-Host "Processing sheet 1..."
[AvatarProcessor]::ProcessImage($p1, $out1)
Write-Host "Sheet 1 saved: $((Get-Item $out1).Length) bytes"

Write-Host "Processing sheet 2..."
[AvatarProcessor]::ProcessImage($p2, $out2)
Write-Host "Sheet 2 saved: $((Get-Item $out2).Length) bytes"
