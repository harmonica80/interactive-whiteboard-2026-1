Add-Type -AssemblyName System.Drawing
$count = 0
for ($i = 0; $i -lt 96; $i++) {
    $path = "images/avatars/avatar_$i.png"
    if (Test-Path $path) {
        $bmp = [System.Drawing.Bitmap]::FromFile($path)
        $topPixels = 0
        $bottomPixels = 0
        $leftPixels = 0
        $rightPixels = 0
        for ($y = 0; $y -lt 8; $y++) {
            for ($x = 0; $x -lt $bmp.Width; $x++) {
                if ($bmp.GetPixel($x, $y).A -gt 30) { $topPixels++ }
            }
        }
        for ($y = $bmp.Height - 8; $y -lt $bmp.Height; $y++) {
            for ($x = 0; $x -lt $bmp.Width; $x++) {
                if ($bmp.GetPixel($x, $y).A -gt 30) { $bottomPixels++ }
            }
        }
        for ($x = 0; $x -lt 8; $x++) {
            for ($y = 0; $y -lt $bmp.Height; $y++) {
                if ($bmp.GetPixel($x, $y).A -gt 30) { $leftPixels++ }
            }
        }
        for ($x = $bmp.Width - 8; $x -lt $bmp.Width; $x++) {
            for ($y = 0; $y -lt $bmp.Height; $y++) {
                if ($bmp.GetPixel($x, $y).A -gt 30) { $rightPixels++ }
            }
        }
        if ($topPixels -gt 5 -or $bottomPixels -gt 5 -or $leftPixels -gt 5 -or $rightPixels -gt 5) {
            Write-Output "avatar_$i (size $($bmp.Width)x$($bmp.Height)): top=$topPixels, btm=$bottomPixels, left=$leftPixels, right=$rightPixels"
            $count++
        }
        $bmp.Dispose()
    }
}
Write-Output "Total avatars with border pixels: $count"
