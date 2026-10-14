# ---------------------------------------------------------------------------
#  Optimisation des images du site
#  Lancer en double-cliquant sur "OPTIMISER-IMAGES.bat" a la racine du site.
#
#  Ce que fait le script, pour chaque image du dossier img/ :
#   1. Remet droite les photos de telephone (orientation EXIF).
#   2. Reduit les images trop grandes (plus de 2000 px ou plus de 1,5 Mo).
#      L'original est d'abord copie dans le dossier _originaux/ (a ne pas mettre en ligne).
#   3. Cree une vignette legere (dossier "vignettes") pour les galeries et les expositions.
#   4. Signale les images presentes dans un dossier de galerie mais pas encore
#      ajoutees dans contenu.js.
# ---------------------------------------------------------------------------

param(
    [int]$TailleMax = 2000,         # plus grand cote des images affichees en grand
    [int]$LargeurVignette = 800,    # largeur des vignettes
    [int]$Qualite = 82,             # qualite JPEG (0-100)
    [int]$PoidsMaxKo = 1500         # au-dela, une image JPEG est recompressee
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$racine     = Split-Path -Parent $PSScriptRoot
$dossierImg = Join-Path $racine 'img'
$sauvegarde = Join-Path $racine '_originaux'
$contenu    = Get-Content (Join-Path $racine 'contenu.js') -Raw -Encoding UTF8

$codecJpeg = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$parametres = New-Object System.Drawing.Imaging.EncoderParameters(1)
$parametres.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]$Qualite)

function Ouvrir-Image($chemin) {
    # Lecture en memoire pour ne pas verrouiller le fichier
    $octets = [System.IO.File]::ReadAllBytes($chemin)
    $flux = New-Object System.IO.MemoryStream(, $octets)
    return [System.Drawing.Image]::FromStream($flux)
}

function Corriger-Orientation($image) {
    # Renvoie $true si l'image a ete tournee
    if ($image.PropertyIdList -notcontains 0x0112) { return $false }
    $valeur = $image.GetPropertyItem(0x0112).Value[0]
    $rotation = switch ($valeur) {
        2 { 'RotateNoneFlipX' } 3 { 'Rotate180FlipNone' } 4 { 'Rotate180FlipX' }
        5 { 'Rotate90FlipX' }   6 { 'Rotate90FlipNone' }  7 { 'Rotate270FlipX' }
        8 { 'Rotate270FlipNone' } default { $null }
    }
    $image.RemovePropertyItem(0x0112)
    if ($rotation) { $image.RotateFlip([System.Drawing.RotateFlipType]::$rotation); return $true }
    return $false
}

function Redimensionner($image, [double]$echelle) {
    $l = [Math]::Max(1, [int][Math]::Round($image.Width * $echelle))
    $h = [Math]::Max(1, [int][Math]::Round($image.Height * $echelle))
    $nouvelle = New-Object System.Drawing.Bitmap($l, $h)
    $g = [System.Drawing.Graphics]::FromImage($nouvelle)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $attributs = New-Object System.Drawing.Imaging.ImageAttributes
    $attributs.SetWrapMode([System.Drawing.Drawing2D.WrapMode]::TileFlipXY)
    $g.DrawImage($image, (New-Object System.Drawing.Rectangle(0, 0, $l, $h)), 0, 0, $image.Width, $image.Height, [System.Drawing.GraphicsUnit]::Pixel, $attributs)
    $g.Dispose()
    return $nouvelle
}

function Enregistrer($image, $chemin) {
    if ($chemin -match '\.png$') { $image.Save($chemin, [System.Drawing.Imaging.ImageFormat]::Png) }
    else { $image.Save($chemin, $codecJpeg, $parametres) }
}

$nbReduites = 0; $nbVignettes = 0; $nonListees = @()

$fichiers = Get-ChildItem $dossierImg -Recurse -File |
    Where-Object { $_.Extension -match '^\.(jpe?g|png)$' -and $_.FullName -notmatch '\\vignettes\\' }

foreach ($f in $fichiers) {
    $relatif = $f.FullName.Substring($dossierImg.Length + 1)
    $image = Ouvrir-Image $f.FullName
    try {
        # 1 et 2 : orientation et taille
        $tournee = Corriger-Orientation $image
        $plusGrandCote = [Math]::Max($image.Width, $image.Height)
        $tropLourde = ($f.Extension -notmatch 'png') -and ($f.Length / 1KB -gt $PoidsMaxKo)
        if ($tournee -or $plusGrandCote -gt $TailleMax -or $tropLourde) {
            $copie = Join-Path $sauvegarde $relatif
            if (-not (Test-Path $copie)) {
                New-Item -ItemType Directory -Force (Split-Path $copie) | Out-Null
                Copy-Item $f.FullName $copie
            }
            $echelle = [Math]::Min(1.0, $TailleMax / $plusGrandCote)
            $reduite = Redimensionner $image $echelle
            Enregistrer $reduite $f.FullName
            $reduite.Dispose()
            $nbReduites++
            Write-Host ("  Optimisee : img\{0}  ({1:N0} Ko -> {2:N0} Ko)" -f $relatif, ($f.Length / 1KB), ((Get-Item $f.FullName).Length / 1KB))
        }

        # 3 : vignettes pour les galeries et les expositions
        if ($relatif -match '^(galeries|expositions)\\') {
            $dossierVignettes = Join-Path $f.DirectoryName 'vignettes'
            $vignette = Join-Path $dossierVignettes $f.Name
            if (-not (Test-Path $vignette) -or (Get-Item $vignette).LastWriteTime -lt (Get-Item $f.FullName).LastWriteTime) {
                New-Item -ItemType Directory -Force $dossierVignettes | Out-Null
                $echelle = [Math]::Min(1.0, [Math]::Min($LargeurVignette / $image.Width, (2 * $LargeurVignette) / $image.Height))
                $petite = Redimensionner $image $echelle
                Enregistrer $petite $vignette
                $petite.Dispose()
                $nbVignettes++
            }
        }
    }
    finally { $image.Dispose() }

    # 4 : images de galerie absentes de contenu.js
    if ($relatif -match '^galeries\\') {
        $motif = '["'']' + [regex]::Escape($f.Name) + '["'']'
        if ($contenu -notmatch $motif) { $nonListees += "img\$relatif" }
    }
}

Write-Host ""
Write-Host "Termine : $nbReduites image(s) optimisee(s), $nbVignettes vignette(s) creee(s)."
if ($nonListees.Count -gt 0) {
    Write-Host ""
    Write-Host "Images presentes dans une galerie mais absentes de contenu.js :" -ForegroundColor Yellow
    $nonListees | ForEach-Object { Write-Host "  - $_" -ForegroundColor Yellow }
}
