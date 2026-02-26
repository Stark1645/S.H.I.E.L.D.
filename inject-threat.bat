@echo off
echo Installing required Python package...
pip install requests
echo.
echo Starting threat injection tool...
echo.
python inject-threat-interactive.py
