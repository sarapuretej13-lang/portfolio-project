# Portfolio Project - Run All 3 Servers at Once

Write-Host "Starting Portfolio Project..." -ForegroundColor Green

# Terminal 1 - Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:\portfollo project\portfolio-backend'; venv\Scripts\activate; python manage.py runserver"

Start-Sleep -Seconds 3

# Terminal 2 - CMS Admin Panel
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:\portfollo project\portfolio-cms'; npm run dev"

Start-Sleep -Seconds 3

# Terminal 3 - Portfolio Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:\portfollo project\portfolio-frontend'; npm run dev"

Write-Host ""
Write-Host "✅ All servers starting..." -ForegroundColor Green
Write-Host ""
Write-Host "🔗 Backend API     → http://localhost:8000" -ForegroundColor Cyan
Write-Host "🔗 CMS Admin Panel → http://localhost:5173" -ForegroundColor Cyan
Write-Host "🔗 Portfolio       → http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "CMS Login → Username: admin | Password: Admin@123!" -ForegroundColor Yellow
