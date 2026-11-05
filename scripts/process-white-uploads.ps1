Add-Type -AssemblyName System.Drawing
$csharpCode = @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;
using System.Collections.Generic;
using System.IO;

public class WhiteBgProcessor
{
    public static void ProcessSheet(string inPath, string outPath, int tolerance = 1800)
    {
        using (Bitmap src = new Bitmap(inPath))
        {
            int tw = 1024;
            int th = 768;
            using (Bitmap target = new Bitmap(tw, th, PixelFormat.Format32bppArgb))
            {
                using (Graphics g = Graphics.FromImage(target))
                {
                    g.Clear(Color.Transparent);
                    g.DrawImage(src, 0, 0, tw, th);
                }

                BitmapData bData = target.LockBits(new Rectangle(0, 0, tw, th), ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
                int stride = bData.Stride;
                int byteCount = stride * th;
                byte[] pixels = new byte[byteCount];
                Marshal.Copy(bData.Scan0, pixels, 0, byteCount);

                bool[] visited = new bool[tw * th];
                Queue<int> q = new Queue<int>();

                Func<int, int, bool> isWhiteBg = (x, y) =>
                {
                    int idx = y * stride + x * 4;
                    byte b = pixels[idx];
                    byte gVal = pixels[idx + 1];
                    byte r = pixels[idx + 2];
                    byte a = pixels[idx + 3];
                    if (a == 0) return false;
                    int dr = 255 - r;
                    int dg = 255 - gVal;
                    int db = 255 - b;
                    return (dr * dr + dg * dg + db * db) < tolerance;
                };

                // Seed outer borders
                for (int x = 0; x < tw; x++)
                {
                    if (isWhiteBg(x, 0) && !visited[0 * tw + x]) { q.Enqueue(0 * tw + x); visited[0 * tw + x] = true; }
                    if (isWhiteBg(x, th - 1) && !visited[(th - 1) * tw + x]) { q.Enqueue((th - 1) * tw + x); visited[(th - 1) * tw + x] = true; }
                }
                for (int y = 0; y < th; y++)
                {
                    if (isWhiteBg(0, y) && !visited[y * tw]) { q.Enqueue(y * tw + 0); visited[y * tw] = true; }
                    if (isWhiteBg(tw - 1, y) && !visited[y * tw + tw - 1]) { q.Enqueue(y * tw + tw - 1); visited[y * tw + tw - 1] = true; }
                }

                // Seed cell corners
                for (int r = 0; r <= 6; r++)
                {
                    int y = Math.Min(th - 1, r * 128);
                    for (int c = 0; c <= 8; c++)
                    {
                        int x = Math.Min(tw - 1, c * 128);
                        int idx = y * tw + x;
                        if (isWhiteBg(x, y) && !visited[idx])
                        {
                            q.Enqueue(idx);
                            visited[idx] = true;
                        }
                    }
                }

                int[] dx = { 0, 0, 1, -1 };
                int[] dy = { 1, -1, 0, 0 };

                while (q.Count > 0)
                {
                    int curr = q.Dequeue();
                    int cx = curr % tw;
                    int cy = curr / tw;
                    int pIdx = cy * stride + cx * 4;
                    pixels[pIdx + 3] = 0; // Transparent

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
                                if (isWhiteBg(nx, ny))
                                {
                                    q.Enqueue(nIdx);
                                }
                            }
                        }
                    }
                }

                Marshal.Copy(pixels, 0, bData.Scan0, byteCount);
                target.UnlockBits(bData);
                target.Save(outPath, ImageFormat.Png);
            }
        }
        Console.WriteLine("Saved: " + outPath);
    }

    public static void SliceAvatars(string sheetPath, string outDir, int startId, int count)
    {
        using (Bitmap sheet = new Bitmap(sheetPath))
        {
            for (int i = 0; i < count; i++)
            {
                int avatarId = startId + i;
                int c = i % 8;
                int r = i / 8;
                using (Bitmap cell = new Bitmap(128, 128, PixelFormat.Format32bppArgb))
                {
                    using (Graphics g = Graphics.FromImage(cell))
                    {
                        g.Clear(Color.Transparent);
                        g.DrawImage(sheet, new Rectangle(0, 0, 128, 128), new Rectangle(c * 128, r * 128, 128, 128), GraphicsUnit.Pixel);
                    }
                    string outAvatarPath = Path.Combine(outDir, string.Format("avatar_{0}.png", avatarId));
                    cell.Save(outAvatarPath, ImageFormat.Png);
                }
            }
        }
        Console.WriteLine(string.Format("Sliced {0} avatars from {1} into {2}", count, sheetPath, outDir));
    }

    public static void BuildUnifiedSheet(string sheet1Path, string sheet2Path, string outPath)
    {
        using (Bitmap fullSheet = new Bitmap(1024, 1536, PixelFormat.Format32bppArgb))
        {
            using (Graphics gFull = Graphics.FromImage(fullSheet))
            {
                gFull.Clear(Color.Transparent);
                using (Bitmap s1 = new Bitmap(sheet1Path))
                {
                    gFull.DrawImage(s1, 0, 0, 1024, 768);
                }
                using (Bitmap s2 = new Bitmap(sheet2Path))
                {
                    gFull.DrawImage(s2, 0, 768, 1024, 768);
                }
            }
            fullSheet.Save(outPath, ImageFormat.Png);
        }
        Console.WriteLine("Rebuilt unified sheet: " + outPath);
    }
}
"@

Add-Type -TypeDefinition $csharpCode -ReferencedAssemblies System.Drawing

$uploadSnacks = "C:/Users/user/.gemini/antigravity/brain/1f8e8781-77a7-42d0-bb6b-cad1bf6f263d/.user_uploaded/media_1793062518118_1fd25f85.png"
$uploadFantasy = "C:/Users/user/.gemini/antigravity/brain/1f8e8781-77a7-42d0-bb6b-cad1bf6f263d/.user_uploaded/media_1793062518137_fcfed024.png"
$uploadForest = "C:/Users/user/.gemini/antigravity/brain/1f8e8781-77a7-42d0-bb6b-cad1bf6f263d/.user_uploaded/media_1793062518147_5ff8a19d.jpg"

# 1. Process Snacks preset
[WhiteBgProcessor]::ProcessSheet($uploadSnacks, "images/avatar_preset_snacks.png")

# 2. Process Cute Fantasy (Sheet 1) & slice 0..47
[WhiteBgProcessor]::ProcessSheet($uploadFantasy, "images/avatars_sheet1.png")
[WhiteBgProcessor]::SliceAvatars("images/avatars_sheet1.png", "images/avatars", 0, 48)

# 3. Process Forest Ocean (Sheet 2) & slice 48..95
[WhiteBgProcessor]::ProcessSheet($uploadForest, "images/avatars_sheet2.png")
[WhiteBgProcessor]::SliceAvatars("images/avatars_sheet2.png", "images/avatars", 48, 48)

# 4. Rebuild unified avatars_sheet.png
[WhiteBgProcessor]::BuildUnifiedSheet("images/avatars_sheet1.png", "images/avatars_sheet2.png", "images/avatars_sheet.png")

Write-Host "All white background images processed successfully!"
