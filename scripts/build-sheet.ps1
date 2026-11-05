Add-Type -AssemblyName System.Drawing

# Rebuild avatars_sheet2.png (8 cols x 6 rows = 1024 x 768)
$sheet2 = New-Object System.Drawing.Bitmap(1024, 768, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g2 = [System.Drawing.Graphics]::FromImage($sheet2)
$g2.Clear([System.Drawing.Color]::FromArgb(0, 0, 0, 0))

for ($i=0; $i -lt 48; $i++) {
    $col = $i % 8
    $row = [Math]::Floor($i / 8)
    $avatarId = 48 + $i
    $src = [System.Drawing.Bitmap]::FromFile("images/avatars/avatar_$avatarId.png")
    $g2.DrawImage($src, ($col * 128), ($row * 128), 128, 128)
    $src.Dispose()
}
$g2.Dispose()
$sheet2.Save("images/avatars_sheet2.png", [System.Drawing.Imaging.ImageFormat]::Png)
$sheet2.Dispose()
Write-Host "avatars_sheet2.png generated!"

# Rebuild avatars_sheet.png (8 cols x 12 rows = 1024 x 1536)
$sheet = New-Object System.Drawing.Bitmap(1024, 1536, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($sheet)
$g.Clear([System.Drawing.Color]::FromArgb(0, 0, 0, 0))

for ($i=0; $i -lt 96; $i++) {
    $col = $i % 8
    $row = [Math]::Floor($i / 8)
    $src = [System.Drawing.Bitmap]::FromFile("images/avatars/avatar_$i.png")
    $g.DrawImage($src, ($col * 128), ($row * 128), 128, 128)
    $src.Dispose()
}
$g.Dispose()
$sheet.Save("images/avatars_sheet.png", [System.Drawing.Imaging.ImageFormat]::Png)
$sheet.Dispose()
Write-Host "avatars_sheet.png generated!"
