$r = Invoke-WebRequest -Uri 'https://transitabilidad.abc.gob.bo/api/v1/data' `
    -Headers @{ Referer='https://transitabilidad.abc.gob.bo/'; 'User-Agent'='Mozilla/5.0' } `
    -UseBasicParsing
$data = $r.Content | ConvertFrom-Json
Write-Host "Total records: $($data.Count)"
$terms = @{}
foreach ($d in $data) {
    $e = $d.estado.descripcion_estado
    $v = $d.evento.descripcion_evento
    if ($e) {
        $k = $e.Trim().ToUpper()
        if ($terms.ContainsKey($k)) { $terms[$k]++ } else { $terms[$k] = 1 }
    }
    if ($v) {
        $k = $v.Trim().ToUpper()
        if ($terms.ContainsKey($k)) { $terms[$k]++ } else { $terms[$k] = 1 }
    }
}
$terms.GetEnumerator() | Sort-Object Value -Descending | ForEach-Object {
    Write-Host "$($_.Value.ToString().PadLeft(4))x  $($_.Key)"
}
