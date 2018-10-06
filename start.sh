#!/bin/bash

 # docker run -p 80:80 --name darts-scoreboard -ti --rm -v "$PWD":/usr/src/myapp -w /usr/src/myapp darts-scoreboard:0.0.1 grunt serv
 # docker run --name darts-scoreboard -ti --rm -v "$PWD":/usr/src/myapp -w /usr/src/myapp darts-scoreboard:0.0.1 npm install

# clear the screen
tput clear
 
# Move cursor to screen location X,Y (top left is 0,0)
tput cup 3 15
 
# Set a foreground colour using ANSI escape
tput setaf 3
echo "##darts-scoreboard##"
tput sgr0
 
tput cup 5 17
# Set reverse video mode
tput rev
echo "M A I N - M E N U"
tput sgr0
 
tput cup 7 15
echo "1. Start"
 
tput cup 8 15
echo "wp: 2. Reset database"
 
tput cup 9 15
echo "wp: 3. Run tests"
 
tput cup 10 15
echo "wp: 4. Remove npm and node modules"
 
# Set bold mode 
tput bold
tput cup 12 15
read -p "Enter your choice [1-4] " choice
 
tput clear
tput sgr0
tput rc

if [ $choice = 1 ]
   then
        echo "Starting up application.."
        docker run --name darts-scoreboard -ti --rm -v "$PWD":/usr/src/myapp -w /usr/src/myapp node:8 npm install &&
        docker run --name darts-scoreboard -d -ti -p 4141:80 --rm -v "$PWD":/usr/src/myapp -w /usr/src/myapp digitallyseamless/nodejs-bower-grunt grunt serve
fi
