# Fix User Management - Complete Cache Clear Script
# Run this from the New directory

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  User Management Fix Script" -ForegroundColor Cyan  
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Clear Laravel caches
Write-Host "[1/6] Clearing optimization cache..." -ForegroundColor Yellow
php artisan optimize:clear

Write-Host "[2/6] Clearing route cache..." -ForegroundColor Yellow
php artisan route:clear

Write-Host "[3/6] Clearing config cache..." -ForegroundColor Yellow  
php artisan config:clear

Write-Host "[4/6] Clearing application cache..." -ForegroundColor Yellow
php artisan cache:clear

Write-Host "[5/6] Clearing view cache..." -ForegroundColor Yellow
php artisan view:clear

Write-Host "[6/6] Listing user routes..." -ForegroundColor Yellow
php artisan route:list --path=user

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  All caches cleared successfully!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Restart Laravel server (php artisan serve)" -ForegroundColor White
Write-Host "2. Restart Vite server (npm run dev)" -ForegroundColor White
Write-Host "3. Hard refresh browser (Ctrl + Shift + R)" -ForegroundColor White
Write-Host ""
pause

