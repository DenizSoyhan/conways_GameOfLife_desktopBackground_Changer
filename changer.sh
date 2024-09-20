#!/bin/zsh

for ((i=0; i<21; i++ )); do
{

    xfconf-query -c xfce4-desktop \
-p /backdrop/screen0/monitoreDP-2/workspace0/last-image \
-s /home/denizsoyhan/Desktop/deneme/desktopBackgroundConway/gameBackground/game_frame_0.png

    sleep 0.3
}
done