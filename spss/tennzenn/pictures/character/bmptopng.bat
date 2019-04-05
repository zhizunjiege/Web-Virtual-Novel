@echo off
for %%i in (*.bmp) do start E:\ffmpeg\bin\ffmpeg -i "%%i" "%%~dpni.png"