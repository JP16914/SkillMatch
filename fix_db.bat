@echo off
setlocal
echo ==========================================
echo FIX DATABASE SCRIPT
echo ==========================================
echo.
echo [1/3] Generating Prisma Client...
echo IMPORTANT: If this fails with EPERM/Permission error, please STOP the running 'pnpm dev' or server terminal first!
echo.

cd apps\api
call npx prisma generate
if %errorlevel% neq 0 goto error_generate

echo.
echo [2/3] Migration (Ensure schema is synced)...
call npx prisma migrate deploy
if %errorlevel% neq 0 goto try_migrate_dev

:continue_seed
echo.
echo [3/3] Seeding database...
call npx prisma db seed
if %errorlevel% neq 0 goto error_seed

echo.
echo ==========================================
echo SUCCESS! Database is ready.
echo You can now restart your server with 'pnpm dev'.
echo ==========================================
pause
exit /b 0

:try_migrate_dev
echo [WARNING] Migration deploy failed. Trying 'migrate dev'...
call npx prisma migrate dev --name init_fix
if %errorlevel% neq 0 goto error_migrate
goto continue_seed

:error_generate
echo.
echo [ERROR] Failed to generate Prisma Client.
echo CAUSE: The server is likely running and locking the file.
echo SOLUTION: 
echo 1. Stop the 'pnpm dev' command in your other terminal (Ctrl+C).
echo 2. Run this script again.
echo.
pause
exit /b 1

:error_migrate
echo.
echo [ERROR] Failed to migrate database.
echo.
pause
exit /b 1

:error_seed
echo.
echo [ERROR] Failed to seed database.
echo.
pause
exit /b 1
