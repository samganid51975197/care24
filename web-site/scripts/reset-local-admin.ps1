$ErrorActionPreference='Stop'
Set-Location 'C:\care24\github-care24\web-site'
Write-Host '간병24 관리자 samganid5197 비밀번호 재설정' -ForegroundColor Cyan
Write-Host '새 비밀번호를 12~128자로 입력하세요. 입력한 내용은 표시되지 않습니다.'
try {
 $secretOne=Read-Host '새 비밀번호' -AsSecureString
 $secretTwo=Read-Host '새 비밀번호 다시 입력' -AsSecureString
 $passwordOne=[System.Net.NetworkCredential]::new('', $secretOne).Password
 $passwordTwo=[System.Net.NetworkCredential]::new('', $secretTwo).Password
 if($passwordOne -cne $passwordTwo){throw '두 비밀번호가 다릅니다. 변경하지 않았습니다.'}
 if($passwordOne.Length -lt 12 -or $passwordOne.Length -gt 128){throw '12~128자로 입력해야 합니다. 변경하지 않았습니다.'}
 @{password=$passwordOne} | ConvertTo-Json -Compress | & 'C:\Users\samga\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' scripts/reset-local-admin.mjs
 if($LASTEXITCODE -ne 0){throw '변경에 실패했습니다.'}
} catch {Write-Host $_.Exception.Message -ForegroundColor Red}
finally {$passwordOne=$null;$passwordTwo=$null;if($secretOne){$secretOne.Dispose()};if($secretTwo){$secretTwo.Dispose()}}
Read-Host '엔터를 누르면 창이 닫힙니다'
