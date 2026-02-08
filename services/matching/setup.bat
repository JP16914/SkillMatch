@echo off
echo Installing dependencies...
venv\Scripts\python.exe -m pip install --upgrade pip
venv\Scripts\python.exe -m pip install -r requirements.txt
echo.
echo Done! Now select this interpreter in VS Code:
echo c:\Users\tranh\SkillMatch\SkillMatch\services\matching\venv\Scripts\python.exe
pause
