Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System;
using System.Drawing;

public class DividerFinderDetail {
    public static void Run() {
        using (var bmp = new Bitmap("images/avatars_sheet2_raw.jpg")) {
            int w = bmp.Width;
            int h = bmp.Height;

            long[] rowProfile = new long[h];
            for (int y = 0; y < h; y++) {
                long sum = 0;
                for (int x = 0; x < w; x++) {
                    var c = bmp.GetPixel(x, y);
                    if (c.R > 25 || c.G > 25 || c.B > 25) sum++;
                }
                rowProfile[y] = sum;
            }

            int[] checkYs = { 120, 238, 350, 460, 570 };
            foreach (var cy in checkYs) {
                Console.WriteLine("Around Y=" + cy + ":");
                for (int y = cy - 8; y <= cy + 8 && y < h; y++) {
                    Console.WriteLine("  Y=" + y + " : " + rowProfile[y]);
                }
            }
        }
    }
}
'@

[DividerFinderDetail]::Run()
