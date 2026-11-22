@echo off
cd /d "%~dp0"
if exist "runtime\python.exe" (
    "runtime\python.exe" -B scripts\serve-atlas.py
) else (
    python -B scripts\serve-atlas.py
)
if errorlevel 1 pause

