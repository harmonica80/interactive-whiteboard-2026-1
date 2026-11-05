Add-Type -AssemblyName System.Drawing

$source = @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Collections.Generic;

public class TrueGridAvatarProcessor {
    public static void Process(string img1Path, string img2Path, string avatarsDir, string sheetPath) {
        if (!System.IO.Directory.Exists(avatarsDir)) {
            System.IO.Directory.CreateDirectory(avatarsDir);
        }

        // True dividers for Image 1
        int[] rDiv1 = new int[] { 0, 136, 263, 388, 509, 636, 768 };
        int[] cDiv1 = new int[] { 0, 128, 259, 385, 511, 638, 766, 896, 1024 };

        // True dividers for Image 2
        int[] rDiv2 = new int[] { 0, 139, 267, 391, 514, 639, 768 };
        int[] cDiv2 = new int[] { 0, 128, 262, 386, 511, 637, 770, 890, 1024 };

        Bitmap[] cleanAvatars = new Bitmap[96];

        using (Bitmap src1 = new Bitmap(img1Path)) {
            for (int r = 0; r < 6; r++) {
                for (int c = 0; c < 8; c++) {
                    int id = r * 8 + c;
                    Rectangle cell = Rectangle.FromLTRB(cDiv1[c], rDiv1[r], cDiv1[c + 1], rDiv1[r + 1]);
                    cleanAvatars[id] = ExtractAvatar(src1, cell);
                }
            }
        }

        using (Bitmap src2 = new Bitmap(img2Path)) {
            for (int r = 0; r < 6; r++) {
                for (int c = 0; c < 8; c++) {
                    int id = 48 + r * 8 + c;
                    Rectangle cell = Rectangle.FromLTRB(cDiv2[c], rDiv2[r], cDiv2[c + 1], rDiv2[r + 1]);
                    cleanAvatars[id] = ExtractAvatar(src2, cell);
                }
            }
        }

        // Save individual avatars
        for (int id = 0; id < 96; id++) {
            string outPath = System.IO.Path.Combine(avatarsDir, "avatar_" + id + ".png");
            cleanAvatars[id].Save(outPath, ImageFormat.Png);
        }

        // Assemble 8 cols x 12 rows sheet (1024 x 1536)
        using (Bitmap sheet = new Bitmap(1024, 1536, PixelFormat.Format32bppArgb)) {
            using (Graphics g = Graphics.FromImage(sheet)) {
                g.Clear(Color.Transparent);
                g.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
                g.PixelOffsetMode = System.Drawing.Drawing2D.PixelOffsetMode.HighQuality;

                for (int id = 0; id < 96; id++) {
                    int col = id % 8;
                    int row = id / 8;
                    int x = col * 128;
                    int y = row * 128;
                    g.DrawImage(cleanAvatars[id], x, y, 128, 128);
                }
            }
            sheet.Save(sheetPath, ImageFormat.Png);
        }

        for (int id = 0; id < 96; id++) {
            cleanAvatars[id].Dispose();
        }
    }

    private static Bitmap ExtractAvatar(Bitmap src, Rectangle cell) {
        // Find animal inside the true cell bounds
        int minX = 9999, maxX = -1, minY = 9999, maxY = -1;
        for (int y = cell.Top; y < cell.Bottom; y++) {
            for (int x = cell.Left; x < cell.Right; x++) {
                Color c = src.GetPixel(x, y);
                if (c.R > 35 || c.G > 35 || c.B > 35) {
                    if (x < minX) minX = x;
                    if (x > maxX) maxX = x;
                    if (y < minY) minY = y;
                    if (y > maxY) maxY = y;
                }
            }
        }

        if (maxX < minX || maxY < minY) {
            minX = cell.Left; maxX = cell.Right - 1;
            minY = cell.Top; maxY = cell.Bottom - 1;
        }

        // Expand bounds by 2px for smooth anti-aliased edge, strictly inside cell!
        minX = Math.Max(cell.Left, minX - 2);
        maxX = Math.Min(cell.Right - 1, maxX + 2);
        minY = Math.Max(cell.Top, minY - 2);
        maxY = Math.Min(cell.Bottom - 1, maxY + 2);

        int cropW = maxX - minX + 1;
        int cropH = maxY - minY + 1;

        Bitmap cropped = new Bitmap(cropW, cropH, PixelFormat.Format32bppArgb);
        BitmapData srcData = src.LockBits(new Rectangle(minX, minY, cropW, cropH), ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
        BitmapData cropData = cropped.LockBits(new Rectangle(0, 0, cropW, cropH), ImageLockMode.WriteOnly, PixelFormat.Format32bppArgb);

        int[] srcPixels = new int[cropW * cropH];
        System.Runtime.InteropServices.Marshal.Copy(srcData.Scan0, srcPixels, 0, srcPixels.Length);
        src.UnlockBits(srcData);

        // BFS flood fill from outer perimeter of cropped box
        bool[] isBg = new bool[cropW * cropH];
        Queue<int> queue = new Queue<int>();

        Func<int, bool> isDark = (color) => {
            int r = (color >> 16) & 0xFF;
            int g = (color >> 8) & 0xFF;
            int b = color & 0xFF;
            return (r <= 38 && g <= 38 && b <= 38);
        };

        for (int x = 0; x < cropW; x++) {
            int top = x;
            int btm = (cropH - 1) * cropW + x;
            if (isDark(srcPixels[top])) { isBg[top] = true; queue.Enqueue(top); }
            if (isDark(srcPixels[btm]) && !isBg[btm]) { isBg[btm] = true; queue.Enqueue(btm); }
        }
        for (int y = 0; y < cropH; y++) {
            int left = y * cropW;
            int right = y * cropW + (cropW - 1);
            if (isDark(srcPixels[left]) && !isBg[left]) { isBg[left] = true; queue.Enqueue(left); }
            if (isDark(srcPixels[right]) && !isBg[right]) { isBg[right] = true; queue.Enqueue(right); }
        }

        int[] dx = { 1, -1, 0, 0 };
        int[] dy = { 0, 0, 1, -1 };
        while (queue.Count > 0) {
            int curr = queue.Dequeue();
            int cx = curr % cropW;
            int cy = curr / cropW;

            for (int i = 0; i < 4; i++) {
                int nx = cx + dx[i];
                int ny = cy + dy[i];
                if (nx >= 0 && nx < cropW && ny >= 0 && ny < cropH) {
                    int nIdx = ny * cropW + nx;
                    if (!isBg[nIdx] && isDark(srcPixels[nIdx])) {
                        isBg[nIdx] = true;
                        queue.Enqueue(nIdx);
                    }
                }
            }
        }

        int[] outPixels = new int[cropW * cropH];
        for (int i = 0; i < srcPixels.Length; i++) {
            if (isBg[i]) {
                outPixels[i] = 0;
            } else {
                int px = i % cropW;
                int py = i / cropW;
                bool touchesBg = false;
                if (px > 0 && isBg[i - 1]) touchesBg = true;
                else if (px < cropW - 1 && isBg[i + 1]) touchesBg = true;
                else if (py > 0 && isBg[i - cropW]) touchesBg = true;
                else if (py < cropH - 1 && isBg[i + cropW]) touchesBg = true;

                int c = srcPixels[i];
                int r = (c >> 16) & 0xFF;
                int g = (c >> 8) & 0xFF;
                int b = c & 0xFF;
                int maxVal = Math.Max(r, Math.Max(g, b));

                if (touchesBg && maxVal < 50) {
                    int alpha = Math.Min(255, Math.Max(0, (maxVal - 18) * 255 / 32));
                    outPixels[i] = (alpha << 24) | (r << 16) | (g << 8) | b;
                } else {
                    outPixels[i] = (255 << 24) | (r << 16) | (g << 8) | b;
                }
            }
        }

        System.Runtime.InteropServices.Marshal.Copy(outPixels, 0, cropData.Scan0, outPixels.Length);
        cropped.UnlockBits(cropData);

        // Center on clean 128x128 transparent tile with at least 8px padding
        Bitmap finalTile = new Bitmap(128, 128, PixelFormat.Format32bppArgb);
        using (Graphics g = Graphics.FromImage(finalTile)) {
            g.Clear(Color.Transparent);
            g.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
            g.PixelOffsetMode = System.Drawing.Drawing2D.PixelOffsetMode.HighQuality;

            // Maximum dimension 112 so there is >= 8px transparent margin on all sides
            float scale = Math.Min(112.0f / cropW, 112.0f / cropH);
            if (scale > 1.0f) scale = 1.0f;
            int drawW = (int)(cropW * scale);
            int drawH = (int)(cropH * scale);
            int destX = (128 - drawW) / 2;
            int destY = (128 - drawH) / 2;

            g.DrawImage(cropped, destX, destY, drawW, drawH);
        }
        cropped.Dispose();

        return finalTile;
    }
}
"@

Add-Type -TypeDefinition $source -ReferencedAssemblies System.Drawing

$p1 = 'C:/Users/user/.gemini/antigravity/brain/1f8e8781-77a7-42d0-bb6b-cad1bf6f263d/.user_uploaded/media_1790387256204.jpg'
$p2 = 'C:/Users/user/.gemini/antigravity/brain/1f8e8781-77a7-42d0-bb6b-cad1bf6f263d/.user_uploaded/media_1790387262648.jpg'

Write-Host "Re-processing avatars with true grid boundaries..."
[TrueGridAvatarProcessor]::Process($p1, $p2, "images/avatars", "images/avatars_sheet.png")
Write-Host "Done! avatars_sheet.png size: $((Get-Item images/avatars_sheet.png).Length) bytes"
