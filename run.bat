@echo off
set COMSPEC=%SystemRoot%\system32\cmd.exe
echo Menjalankan aplikasi di http://localhost:3000 ...
node .\node_modules\next\dist\bin\next dev
pause

