Add-Type -AssemblyName System.Drawing
$csharpCode = @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;
using System.IO;

public class CuteFantasyAvatarProcessor2
{
    public static void Process(string inPngPath, string outSheet1Path, string outSheetAllPath, string avatarsDir)
    {
        Console.WriteLine("Step 1: Loading raw master PNG: " + inPngPath);
        using (Bitmap raw = new Bitmap(inPngPath))
        {
            int tw = 1024;
            int th = 768;
            using (Bitmap sheet1 = new Bitmap(tw, th, PixelFormat.Format32bppArgb))
            {
                using (Graphics g = Graphics.FromImage(sheet1))
                {
                    g.Clear(Color.Transparent);
                    g.DrawImage(raw, 0, 0, tw, th);
                }

                Console.WriteLine("Step 2: Cleaning subtle residual alpha noise (A <= 15)...");
                BitmapData bData = sheet1.LockBits(new Rectangle(0, 0, tw, th), ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
                int stride = bData.Stride;
                int byteCount = stride * th;
                byte[] pixels = new byte[byteCount];
                Marshal.Copy(bData.Scan0, pixels, 0, byteCount);

                int cleanedCount = 0;
                for (int i = 3; i < byteCount; i += 4)
                {
                    if (pixels[i] > 0 && pixels[i] <= 15)
                    {
                        pixels[i] = 0;
                        cleanedCount++;
                    }
                }
                Console.WriteLine("Cleaned residual alpha noise pixels: " + cleanedCount);

                Marshal.Copy(pixels, 0, bData.Scan0, byteCount);
                sheet1.UnlockBits(bData);

                Console.WriteLine("Step 3: Saving " + outSheet1Path);
                sheet1.Save(outSheet1Path, ImageFormat.Png);

                Console.WriteLine("Step 4: Slicing 48 individual 128x128 avatar PNGs into " + avatarsDir);
                for (int r = 0; r < 6; r++)
                {
                    for (int c = 0; c < 8; c++)
                    {
                        int avatarId = r * 8 + c;
                        using (Bitmap cell = new Bitmap(128, 128, PixelFormat.Format32bppArgb))
                        {
                            using (Graphics gc = Graphics.FromImage(cell))
                            {
                                gc.Clear(Color.Transparent);
                                gc.DrawImage(sheet1, new Rectangle(0, 0, 128, 128), new Rectangle(c * 128, r * 128, 128, 128), GraphicsUnit.Pixel);
                            }
                            string outAvatarPath = Path.Combine(avatarsDir, string.Format("avatar_{0}.png", avatarId));
                            cell.Save(outAvatarPath, ImageFormat.Png);
                        }
                    }
                }
                Console.WriteLine("Successfully sliced avatar_0.png to avatar_47.png!");

                Console.WriteLine("Step 5: Rebuilding unified 1024x1536 avatars_sheet.png...");
                using (Bitmap fullSheet = new Bitmap(1024, 1536, PixelFormat.Format32bppArgb))
                {
                    using (Graphics gFull = Graphics.FromImage(fullSheet))
                    {
                        gFull.Clear(Color.Transparent);
                        gFull.DrawImage(sheet1, 0, 0, 1024, 768);
                        using (Bitmap sheet2 = new Bitmap("images/avatars_sheet2.png"))
                        {
                            gFull.DrawImage(sheet2, 0, 768, 1024, 768);
                        }
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

$rawMaster = "C:/Users/user/.gemini/antigravity/brain/1f8e8781-77a7-42d0-bb6b-cad1bf6f263d/.user_uploaded/media_1793030433095_32fd6f34.png"

# Run full processing pipeline
[CuteFantasyAvatarProcessor2]::Process(
    $rawMaster,
    "images/avatars_sheet1.png",
    "images/avatars_sheet.png",
    "images/avatars"
)
Write-Host "Execution completed successfully!"
