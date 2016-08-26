@Echo off
Color 02
Echo  ---------------------------------------------
Echo  Unzipping program files, please wait...
unzip -q -n venv_win.zip
Echo  ---------------------------------------------
Echo  Running youtube-dl, this program supports resuming broken downloads.
Echo  Downloading...
"venv_win\Scripts\python.exe" util.dat

Echo  Donwloading succeeded! You can close this windows now :)
Echo  ---------------------------------------------
pause