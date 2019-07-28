This package use @sha/configurable module.
You need define the argument in npm script --data=DataFolder, or use default one
After the launch app will check /Users/UserName/btceApps/poker-ru-service

there will be config folder with json files, change the values there

### How to debug ###
Example for Win10
```
C:\work\btce\eos-front\node_modules\.bin\ts-node-dev.cmd --inspect-brk=62615 --transpileOnly --respawn C:\work\btce\eos-front\packages\btce-service\src\index.ts --data=btce-debug
```
