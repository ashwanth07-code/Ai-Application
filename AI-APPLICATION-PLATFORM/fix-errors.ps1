# fix-errors.ps1
Write-Host "🔧 Fixing errors in AI Applications Platform..." -ForegroundColor Cyan

# Fix 1: Create reportWebVitals.js
Write-Host "📝 Creating reportWebVitals.js..." -ForegroundColor Yellow
$reportVitalsPath = "D:\AI-APPLICATIONS-PLATFORM\frontend\src\reportWebVitals.js"
@"
const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
"@ | Out-File -FilePath $reportVitalsPath -Encoding utf8 -Force
Write-Host "✅ Created reportWebVitals.js" -ForegroundColor Green

# Fix 2: Update SpamFilter.jsx with missing import
Write-Host "📝 Fixing SpamFilter.jsx..." -ForegroundColor Yellow
$spamFilterPath = "D:\AI-APPLICATIONS-PLATFORM\frontend\src\components\SpamFilter.jsx"
$content = Get-Content $spamFilterPath -Raw

# Check if IconButton import is missing
if ($content -notmatch "import IconButton") {
    # Add import after other MUI imports
    $newContent = $content -replace "(import \{[^}]*\} from '@mui/material';)", "`$1`nimport IconButton from '@mui/material/IconButton';"
    $newContent | Out-File -FilePath $spamFilterPath -Encoding utf8 -Force
    Write-Host "✅ Added IconButton import to SpamFilter.jsx" -ForegroundColor Green
} else {
    Write-Host "✅ IconButton import already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✅ All fixes applied!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Now restart your frontend server:" -ForegroundColor Yellow
Write-Host "1. Press Ctrl+C in the frontend terminal" -ForegroundColor White
Write-Host "2. Run: cd D:\AI-APPLICATIONS-PLATFORM\frontend" -ForegroundColor White
Write-Host "3. Run: npm start" -ForegroundColor White