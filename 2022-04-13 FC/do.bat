REM where node
REM where timeout
set path=C:\Windows\System32;C:\Program Files\nodejs
:loop
    npm run start:dev
    timeout /t 0
    goto loop
:end