# Exporta el CV de Word a PDF usando Word (Windows). Con tiempo límite: si Word se
# bloquea, cierra solo la instancia que arrancó este script y avisa.
$root = Split-Path -Parent $PSScriptRoot
$before = @(Get-Process WINWORD -ErrorAction SilentlyContinue | ForEach-Object Id)
$job = Start-Job -ArgumentList $root {
  param($root)
  $w = New-Object -ComObject Word.Application
  $w.Visible = $false
  $w.DisplayAlerts = 0
  try {
    $d = $w.Documents.Open("$root\CV_Enrique_Saenz_de_Urturi.docx", $false, $true)
    $d.ExportAsFixedFormat("$root\public\CV-Enrique-Saenz-de-Urturi.pdf", 17)
    "CV .pdf generado: " + $d.ComputeStatistics(2) + " paginas"
    $d.Close($false)
  } finally { $w.Quit() }
}
if (Wait-Job $job -Timeout 60) { Receive-Job $job }
else {
  Stop-Job $job
  Get-Process WINWORD -ErrorAction SilentlyContinue | Where-Object { $before -notcontains $_.Id } | Stop-Process -Force
  Write-Error "Word no respondio en 60 s. Vuelve a ejecutar npm run cv."
  exit 1
}
