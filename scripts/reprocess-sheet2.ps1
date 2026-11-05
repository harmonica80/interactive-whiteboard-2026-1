Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Drawing.Drawing2D;
using System.Collections.Generic;

public class PerfectSheet2Processor {
    public static void Process() {
        int[] rowDivs = { 0, 120, 238, 351, 460, 568, 682 };
        int[] colDivs = { 0, 126, 259, 387, 509, 639, 773, 899, 1024 };

        using (var raw = new Bitmap("images/avatars_sheet2_raw.jpg")) {
            for (int r = 0; r < 6; r++) {
                for (int c = 0; c < 8; c++) {
                    int x0 = colDivs[c];
                    int x1 = colDivs[c + 1];
                    int y0 = rowDivs[r];
                    int y1 = rowDivs[r + 1];
                    int cellW = x1 - x0;
                    int cellH = y1 - y0;

                    int avatarId = 48 + r * 8 + c;

                    // Extract cell
                    bool[,] isSubject = new bool[cellW, cellH];
                    int centerX = cellW / 2;
                    int centerY = cellH / 2;

                    // BFS from cell borders to mark background
                    bool[,] isBg = new bool[cellW, cellH];
                    var q = new Queue<Point>();

                    for (int x = 0; x < cellW; x++) {
                        TryEnqueueBg(raw, x0 + x, y0 + 0, x, 0, isBg, q);
                        TryEnqueueBg(raw, x0 + x, y0 + cellH - 1, x, cellH - 1, isBg, q);
                    }
                    for (int y = 0; y < cellH; y++) {
                        TryEnqueueBg(raw, x0 + 0, y0 + y, 0, y, isBg, q);
                        TryEnqueueBg(raw, x0 + cellW - 1, y0 + y, cellW - 1, y, isBg, q);
                    }

                    int[] dx = { 1, -1, 0, 0 };
                    int[] dy = { 0, 0, 1, -1 };

                    while (q.Count > 0) {
                        var pt = q.Dequeue();
                        for (int i = 0; i < 4; i++) {
                            int nx = pt.X + dx[i];
                            int ny = pt.Y + dy[i];
                            if (nx >= 0 && nx < cellW && ny >= 0 && ny < cellH && !isBg[nx, ny]) {
                                var px = raw.GetPixel(x0 + nx, y0 + ny);
                                // Black background threshold
                                if (px.R <= 32 && px.G <= 32 && px.B <= 32) {
                                    isBg[nx, ny] = true;
                                    q.Enqueue(new Point(nx, ny));
                                }
                            }
                        }
                    }

                    // Find bounding box of subject (non-bg pixels)
                    int minX = cellW, maxX = 0, minY = cellH, maxY = 0;
                    int subjectPixels = 0;
                    for (int y = 0; y < cellH; y++) {
                        for (int x = 0; x < cellW; x++) {
                            if (!isBg[x, y]) {
                                subjectPixels++;
                                if (x < minX) minX = x;
                                if (x > maxX) maxX = x;
                                if (y < minY) minY = y;
                                if (y > maxY) maxY = y;
                            }
                        }
                    }

                    int subW = Math.Max(1, maxX - minX + 1);
                    int subH = Math.Max(1, maxY - minY + 1);

                    // Create sub-image with transparent background
                    using (var sub = new Bitmap(subW, subH, PixelFormat.Format32bppArgb)) {
                        for (int y = 0; y < subH; y++) {
                            for (int x = 0; x < subW; x++) {
                                int origX = minX + x;
                                int origY = minY + y;
                                if (isBg[origX, origY]) {
                                    sub.SetPixel(x, y, Color.FromArgb(0, 0, 0, 0));
                                } else {
                                    var origColor = raw.GetPixel(x0 + origX, y0 + origY);
                                    // Smooth edge alpha
                                    int maxC = Math.Max(origColor.R, Math.Max(origColor.G, origColor.B));
                                    int alpha = maxC < 25 ? 0 : (maxC < 50 ? (maxC - 25) * 10 : 255);
                                    if (alpha > 255) alpha = 255;
                                    sub.SetPixel(x, y, Color.FromArgb(alpha, origColor.R, origColor.G, origColor.B));
                                }
                            }
                        }

                        // Target 128x128 canvas
                        using (var canvas = new Bitmap(128, 128, PixelFormat.Format32bppArgb))
                        using (var g = Graphics.FromImage(canvas)) {
                            g.Clear(Color.FromArgb(0, 0, 0, 0));
                            g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                            g.PixelOffsetMode = PixelOffsetMode.HighQuality;
                            g.SmoothingMode = SmoothingMode.HighQuality;

                            // Scale to fit max 112x112 so at least 8px border on all sides
                            double maxDim = 112.0;
                            double scale = Math.Min(maxDim / subW, maxDim / subH);
                            if (scale > 1.1) scale = 1.1; // Don't over-scale small items

                            int drawW = (int)Math.Round(subW * scale);
                            int drawH = (int)Math.Round(subH * scale);
                            int destX = (128 - drawW) / 2;
                            int destY = (128 - drawH) / 2;

                            g.DrawImage(sub, new Rectangle(destX, destY, drawW, drawH));

                            string outPath = string.Format("images/avatars/avatar_{0}.png", avatarId);
                            canvas.Save(outPath, ImageFormat.Png);
                        }
                    }

                    Console.WriteLine(string.Format("Generated avatar_{0}.png: sub=[{1}x{2}] subjectPx={3}", avatarId, subW, subH, subjectPixels));
                }
            }
        }
    }

    private static void TryEnqueueBg(Bitmap raw, int rx, int ry, int x, int y, bool[,] isBg, Queue<Point> q) {
        if (!isBg[x, y]) {
            var px = raw.GetPixel(rx, ry);
            if (px.R <= 32 && px.G <= 32 && px.B <= 32) {
                isBg[x, y] = true;
                q.Enqueue(new Point(x, y));
            }
        }
    }
}
'@

[PerfectSheet2Processor]::Process()
