Add-Type -AssemblyName System.Drawing
$csharpCode = @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;
using System.Collections.Generic;
using System.IO;

public class ForestOceanAvatarProcessor
{
    public static void Process(string inJpgPath, string outSheet2Path, string outSheetAllPath, string avatarsDir)
    {
        Console.WriteLine("Step 1: Loading raw master image: " + inJpgPath);
        using (Bitmap raw = new Bitmap(inJpgPath))
        {
            int tw = 1024;
            int th = 768;
            using (Bitmap sheet2 = new Bitmap(tw, th, PixelFormat.Format32bppArgb))
            {
                using (Graphics g = Graphics.FromImage(sheet2))
                {
                    g.Clear(Color.Transparent);
                    g.DrawImage(raw, 0, 0, tw, th);
                }

                Console.WriteLine("Step 2: Performing BFS flood-fill background removal on 1024x768...");
                BitmapData bData = sheet2.LockBits(new Rectangle(0, 0, tw, th), ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
                int stride = bData.Stride;
                int byteCount = stride * th;
                byte[] pixels = new byte[byteCount];
                Marshal.Copy(bData.Scan0, pixels, 0, byteCount);

                bool[] visited = new bool[tw * th];
                Queue<int> q = new Queue<int>();

                // Tolerance 1800 (same as processUploadedAvatarSheet in js/app.js)
                Func<int, int, bool> isBlackBg = (x, y) =>
                {
                    int idx = y * stride + x * 4;
                    byte b = pixels[idx];
                    byte gVal = pixels[idx + 1];
                    byte r = pixels[idx + 2];
                    int distSq = r * r + gVal * gVal + b * b;
                    return distSq < 1800;
                };

                // Seed outer borders
                for (int x = 0; x < tw; x++)
                {
                    if (isBlackBg(x, 0) && !visited[0 * tw + x]) { q.Enqueue(0 * tw + x); visited[0 * tw + x] = true; }
                    if (isBlackBg(x, th - 1) && !visited[(th - 1) * tw + x]) { q.Enqueue((th - 1) * tw + x); visited[(th - 1) * tw + x] = true; }
                }
                for (int y = 0; y < th; y++)
                {
                    if (isBlackBg(0, y) && !visited[y * tw]) { q.Enqueue(y * tw + 0); visited[y * tw] = true; }
                    if (isBlackBg(tw - 1, y) && !visited[y * tw + tw - 1]) { q.Enqueue(y * tw + tw - 1); visited[y * tw + tw - 1] = true; }
                }

                // Also seed all cell corners (c*128, r*128)
                for (int r = 0; r <= 6; r++)
                {
                    int y = Math.Min(th - 1, r * 128);
                    for (int c = 0; c <= 8; c++)
                    {
                        int x = Math.Min(tw - 1, c * 128);
                        int idx = y * tw + x;
                        if (isBlackBg(x, y) && !visited[idx])
                        {
                            q.Enqueue(idx);
                            visited[idx] = true;
                        }
                    }
                }

                int[] dx = { 0, 0, 1, -1 };
                int[] dy = { 1, -1, 0, 0 };

                int floodedCount = 0;
                while (q.Count > 0)
                {
                    int curr = q.Dequeue();
                    int cx = curr % tw;
                    int cy = curr / tw;
                    int pIdx = cy * stride + cx * 4;
                    pixels[pIdx + 3] = 0; // Transparent
                    floodedCount++;

                    for (int d = 0; d < 4; d++)
                    {
                        int nx = cx + dx[d];
                        int ny = cy + dy[d];
                        if (nx >= 0 && nx < tw && ny >= 0 && ny < th)
                        {
                            int nIdx = ny * tw + nx;
                            if (!visited[nIdx])
                            {
                                visited[nIdx] = true;
                                if (isBlackBg(nx, ny))
                                {
                                    q.Enqueue(nIdx);
                                }
                            }
                        }
                    }
                }

                Console.WriteLine(string.Format("Flooded {0} transparent background pixels out of {1} total.", floodedCount, tw * th));

                Marshal.Copy(pixels, 0, bData.Scan0, byteCount);
                sheet2.UnlockBits(bData);

                Console.WriteLine("Step 3: Saving " + outSheet2Path);
                sheet2.Save(outSheet2Path, ImageFormat.Png);

                Console.WriteLine("Step 4: Slicing 48 individual 128x128 avatar PNGs into " + avatarsDir);
                for (int r = 0; r < 6; r++)
                {
                    for (int c = 0; c < 8; c++)
                    {
                        int avatarId = 48 + r * 8 + c;
                        using (Bitmap cell = new Bitmap(128, 128, PixelFormat.Format32bppArgb))
                        {
                            using (Graphics gc = Graphics.FromImage(cell))
                            {
                                gc.Clear(Color.Transparent);
                                gc.DrawImage(sheet2, new Rectangle(0, 0, 128, 128), new Rectangle(c * 128, r * 128, 128, 128), GraphicsUnit.Pixel);
                            }
                            string outAvatarPath = Path.Combine(avatarsDir, string.Format("avatar_{0}.png", avatarId));
                            cell.Save(outAvatarPath, ImageFormat.Png);
                        }
                    }
                }
                Console.WriteLine("Successfully sliced avatar_48.png to avatar_95.png!");

                Console.WriteLine("Step 5: Rebuilding unified 1024x1536 avatars_sheet.png...");
                using (Bitmap fullSheet = new Bitmap(1024, 1536, PixelFormat.Format32bppArgb))
                {
                    using (Graphics gFull = Graphics.FromImage(fullSheet))
                    {
                        gFull.Clear(Color.Transparent);
                        using (Bitmap sheet1 = new Bitmap("images/avatars_sheet1.png"))
                        {
                            gFull.DrawImage(sheet1, 0, 0, 1024, 768);
                        }
                        gFull.DrawImage(sheet2, 0, 768, 1024, 768);
                    }
                    fullSheet.Save(outSheetAllPath, ImageFormat.Png);
                }
                Console.WriteLine("Successfully saved " + outSheetAllPath);
            }
        }
    }
}
"@

Add-Type -TypeDefinition $csharpCode -ReferencedAssemblies System.Drawing

$rawMaster = "C:/Users/user/.gemini/antigravity/brain/1f8e8781-77a7-42d0-bb6b-cad1bf6f263d/.user_uploaded/media_1793027290854_c12c0177.jpg"

# Backup raw master to images/avatars_sheet2_raw.jpg
Copy-Item $rawMaster "images/avatars_sheet2_raw.jpg" -Force
Write-Host "Updated images/avatars_sheet2_raw.jpg with new uploaded image!"

# Run full processing pipeline
[ForestOceanAvatarProcessor]::Process(
    "images/avatars_sheet2_raw.jpg",
    "images/avatars_sheet2.png",
    "images/avatars_sheet.png",
    "images/avatars"
)
Write-Host "Pipeline execution completed successfully!"
