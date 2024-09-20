This is my ricing attempt of my Kali Linux machine by making a dynamic desktop background by creating **"Conway's Game Of Life"** in node.js<br>

Only dependency should be "node.js" if you have it on your machine it should run without a problem.

![Screencast 2024-09-20 16-14-34(2)](https://github.com/user-attachments/assets/c477296c-0d91-402c-831c-2f557e94115c)
## Some Features:
* There are several color palettes that you can change to and you can simply add your own rgb values!
<p align="center">
<img src="https://github.com/user-attachments/assets/30634435-0518-4e73-8fd2-60d90a159e41" width="450" />
  <img src="https://github.com/user-attachments/assets/3ab9e941-124a-478b-ae0c-6ba86b13e667" width="450" />
</p><br>
 <ul>
  <li>You can change the size of the cells depending on your preference</li>
  <li>You can change how much of the grid should be filled initially.</li>
  <li>How fast each frame should be displayed.</li>
  <li>After many generations the grid might become stale and stuck in a loop so after a while it resets and starts over. You can change the reset time.</li>
</ul> 

## Setup:
1)There is a line in the script where you define a path for the screenshot of the game state to be saved.

````javascript
    const filePath = path.join(process.env.HOME, 
        'Desktop', 'deneme', 'desktopBackgroundConway', 'gameBackground', `game_frame_0.png`);
````
This is my filepath so create a directory for this one image that will change constantly and be your desktop background.

Then execute the **"conwayOfLife.js"** on terminal to create first "game_frame_0.png" and make it your desktop background.

````shell
node conwayOfLife.js
````

2)There is another script in this repo called **"backgroundStarter.sh"** change the path in here to the "**"conwayOfLife.js"**. We will add this to our crontab so when we boot the system 
it will start automatically. And also my terminal has "zsh" interpreter. If yours is different like "bash" change the shebang (#!/bin/bash)at the first line. You can learn your shell interpreter by typing this to terminal:

````shell
echo $0
````

3)The let's add it to the crontab. Use terminal and enter edit mode for crontab:

````shell
crontab -e
````
If you don't have a crontab choose "nano" to create a new one.

Add the path to the **"backgroundStarter.sh"** to the first line with @reboot:
````crontab
@reboot ~/[YOUR_PATH]/backgroundStarter.sh 
````
You can check if the crontab is setup properly by list -l option:
````shell
crontab -l
````

