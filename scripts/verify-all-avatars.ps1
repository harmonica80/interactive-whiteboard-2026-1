Add-Type -AssemblyName System.Drawing

Write-Host "=== 1. Checking images/avatars_sheet1.png (1024x768) ==="
$sheet1 = [System.Drawing.Bitmap]::FromFile("images/avatars_sheet1.png")
Write-Host "Dimensions: $($sheet1.Width) x $($sheet1.Height)"
$failCount1 = 0
for ($c = 1; $c -lt 8; $c++) {
    $x = $c * 128
    $nonTrans = 0
    for ($y = 0; $y -lt 768; $y++) {
        if ($sheet1.GetPixel($x, $y).A -gt 0) { $nonTrans++ }
    }
    if ($nonTrans -gt 0) {
        Write-Host "  FAILED: Vertical divider x=$x has $nonTrans non-transparent pixels!"
        $failCount1++
    }
}
for ($r = 1; $r -lt 6; $r++) {
    $y = $r * 128
    $nonTrans = 0
    for ($x = 0; $x -lt 1024; $x++) {
        if ($sheet1.GetPixel($x, $y).A -gt 0) { $nonTrans++ }
    }
    if ($nonTrans -gt 0) {
        Write-Host "  FAILED: Horizontal divider y=$y has $nonTrans non-transparent pixels!"
        $failCount1++
    }
}
$sheet1.Dispose()
if ($failCount1 -eq 0) {
    Write-Host "  SUCCESS: Zero non-transparent pixels on all cell boundaries in avatars_sheet1.png!"
}

Write-Host "=== 2. Checking images/avatars_sheet2.png (1024x768) ==="
$sheet2 = [System.Drawing.Bitmap]::FromFile("images/avatars_sheet2.png")
Write-Host "Dimensions: $($sheet2.Width) x $($sheet2.Height)"
$failCount2 = 0
for ($c = 1; $c -lt 8; $c++) {
    $x = $c * 128
    $nonTrans = 0
    for ($y = 0; $y -lt 768; $y++) {
        if ($sheet2.GetPixel($x, $y).A -gt 0) { $nonTrans++ }
    }
    if ($nonTrans -gt 0) {
        Write-Host "  FAILED: Vertical divider x=$x has $nonTrans non-transparent pixels!"
        $failCount2++
    }
}
for ($r = 1; $r -lt 6; $r++) {
    $y = $r * 128
    $nonTrans = 0
    for ($x = 0; $x -lt 1024; $x++) {
        if ($sheet2.GetPixel($x, $y).A -gt 0) { $nonTrans++ }
    }
    if ($nonTrans -gt 0) {
        Write-Host "  FAILED: Horizontal divider y=$y has $nonTrans non-transparent pixels!"
        $failCount2++
    }
}
$sheet2.Dispose()
if ($failCount2 -eq 0) {
    Write-Host "  SUCCESS: Zero non-transparent pixels on all cell boundaries in avatars_sheet2.png!"
}

Write-Host "=== 3. Checking all 96 individual avatars (0 to 95) ==="
$borderFails = 0
for ($id = 0; $id -lt 96; $id++) {
    $path = "images/avatars/avatar_$id.png"
    $a = [System.Drawing.Bitmap]::FromFile($path)
    if ($a.Width -ne 128 -or $a.Height -ne 128) {
        Write-Host "  FAILED: avatar_$id.png size $($a.Width)x$($a.Height) is not 128x128!"
        $borderFails++
    }
    $edgeNonTrans = 0
    for ($x = 0; $x -lt 128; $x++) {
        if ($a.GetPixel($x, 0).A -gt 0) { $edgeNonTrans++ }
        if ($a.GetPixel($x, 127).A -gt 0) { $edgeNonTrans++ }
    }
    for ($y = 0; $y -lt 128; $y++) {
        if ($a.GetPixel(0, $y).A -gt 0) { $edgeNonTrans++ }
        if ($a.GetPixel(127, $y).A -gt 0) { $edgeNonTrans++ }
    }
    if ($edgeNonTrans -gt 0) {
        Write-Host "  FAILED: avatar_$id.png has $edgeNonTrans edge pixels!"
        $borderFails++
    }
    $a.Dispose()
}
if ($borderFails -eq 0) {
    Write-Host "  SUCCESS: All 96 avatars (0..95) are 128x128 with clean 100% transparent borders!"
}

Write-Host "=== 4. Checking unified images/avatars_sheet.png (1024x1536) ==="
$fullSheet = [System.Drawing.Bitmap]::FromFile("images/avatars_sheet.png")
Write-Host "Dimensions: $($fullSheet.Width) x $($fullSheet.Height)"
$y768NonTrans = 0
for ($x = 0; $x -lt 1024; $x++) {
    if ($fullSheet.GetPixel($x, 768).A -gt 0) { $y768NonTrans++ }
}
Write-Host "Divider y=768 non-transparent pixels: $y768NonTrans"
$fullSheet.Dispose()
if ($y768NonTrans -eq 0) {
    Write-Host "  SUCCESS: Center seam y=768 is 100% transparent!"
}
