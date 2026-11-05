Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System;
using System.Drawing;

public class BoundsChecker {
    public static void Run() {
        int[] rowDivs = { 0, 122, 238, 352, 461, 569, 682 };
        int[] colDivs = { 0, 126, 259, 387, 509, 638, 774, 899, 1024 };

        using (var bmp = new Bitmap("images/avatars_sheet2_raw.jpg")) {
            for (int r = 0; r < 6; r++) {
                for (int c = 0; c < 8; c++) {
                    int x0 = colDivs[c];
                    int x1 = colDivs[c + 1];
                    int y0 = rowDivs[r];
                    int y1 = rowDivs[r + 1];

                    int minX = x1, maxX = x0, minY = y1, maxY = y0;
                    int count = 0;

                    for (int y = y0; y < y1; y++) {
                        for (int x = x0; x < x1; x++) {
                            var px = bmp.GetPixel(x, y);
                            if (px.R > 25 || px.G > 25 || px.B > 25) {
                                count++;
                                if (x < minX) minX = x;
                                if (x > maxX) maxX = x;
                                if (y < minY) minY = y;
                                if (y > maxY) maxY = y;
                            }
                        }
                    }

                    int id = 48 + r * 8 + c;
                    int bw = maxX >= minX ? (maxX - minX + 1) : 0;
                    int bh = maxY >= minY ? (maxY - minY + 1) : 0;
                    int topGap = minY - y0;
                    int bottomGap = y1 - maxY;
                    int leftGap = minX - x0;
                    int rightGap = x1 - maxX;

                    Console.WriteLine(string.Format("Avatar {0} (r={1}, c={2}): Box=[{3}x{4}] gaps: T={5}, B={6}, L={7}, R={8}",
                        id, r, c, bw, bh, topGap, bottomGap, leftGap, rightGap));
                }
            }
        }
    }
}
'@

[BoundsChecker]::Run()
