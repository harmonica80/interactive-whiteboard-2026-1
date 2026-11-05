Add-Type -AssemblyName System.Drawing

$sourcePath = (Resolve-Path "favicon_512.png").Path
$srcImg = [System.Drawing.Image]::FromFile($sourcePath)

function Resize-Image($src, $w, $h) {
    $dest = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($dest)
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)
    $g.DrawImage($src, 0, 0, $w, $h)
    $g.Dispose()
    return $dest
}

# 1. Output favicon.png (256x256)
$img256 = Resize-Image $srcImg 256 256
$img256.Save((Join-Path (Get-Location).Path "favicon.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$img256.Dispose()

# 2. Output apple-touch-icon.png (180x180)
$img180 = Resize-Image $srcImg 180 180
$img180.Save((Join-Path (Get-Location).Path "apple-touch-icon.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$img180.Dispose()

# 3. Output favicon-32x32.png
$img32 = Resize-Image $srcImg 32 32
$img32.Save((Join-Path (Get-Location).Path "favicon-32x32.png"), [System.Drawing.Imaging.ImageFormat]::Png)

# 4. Output favicon-16x16.png
$img16 = Resize-Image $srcImg 16 16
$img16.Save((Join-Path (Get-Location).Path "favicon-16x16.png"), [System.Drawing.Imaging.ImageFormat]::Png)

# 5. Build multi-resolution ICO file (16, 32, 48)
$img48 = Resize-Image $srcImg 48 48

$icoSizes = @(16, 32, 48)
$icoBitmaps = @($img16, $img32, $img48)
$icoBytesList = @()

foreach ($b in $icoBitmaps) {
    $ms = New-Object System.IO.MemoryStream
    $b.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
    $icoBytesList += ,$ms.ToArray()
    $ms.Dispose()
}

$icoPath = Join-Path (Get-Location).Path "favicon.ico"
$fs = [System.IO.File]::Create($icoPath)
$bw = New-Object System.IO.BinaryWriter($fs)

# ICONDIR Header
$bw.Write([uint16]0) # Reserved
$bw.Write([uint16]1) # Type: 1 = ICO
$bw.Write([uint16]$icoSizes.Count) # Number of images

$offset = 6 + (16 * $icoSizes.Count)

for ($i = 0; $i -lt $icoSizes.Count; $i++) {
    $s = $icoSizes[$i]
    $bytes = $icoBytesList[$i]
    $wByte = if ($s -ge 256) { [byte]0 } else { [byte]$s }
    $hByte = if ($s -ge 256) { [byte]0 } else { [byte]$s }

    $bw.Write($wByte) # Width
    $bw.Write($hByte) # Height
    $bw.Write([byte]0) # Color count
    $bw.Write([byte]0) # Reserved
    $bw.Write([uint16]1) # Color planes
    $bw.Write([uint16]32) # Bits per pixel
    $bw.Write([uint32]$bytes.Length) # Image size in bytes
    $bw.Write([uint32]$offset) # Offset to image data

    $offset += $bytes.Length
}

for ($i = 0; $i -lt $icoSizes.Count; $i++) {
    $bytes = $icoBytesList[$i]
    $bw.Write($bytes)
}

$bw.Flush()
$bw.Close()
$fs.Close()

$img16.Dispose()
$img32.Dispose()
$img48.Dispose()
$srcImg.Dispose()

# Copy SVG to favicon.svg
Copy-Item "scripts/books_color.svg" "favicon.svg" -Force

Write-Output "Favicons generated successfully:"
Get-Item favicon.*, apple-touch-icon.png, favicon-*.png | Select-Object Name, Length
