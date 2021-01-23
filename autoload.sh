#!/bin/sh

source ~/.bashrc;

echo "[ RTN / Exchange Sync ]";

PATH_DEMON="/root/demon";
PATH_SYNC="/root/rtnesync";

if [ -d "$PATH_SYNC" ]; then

    echo "- Loading sync interface...";
    cd $PATH_SYNC;
    forever start apps/rtnesync.js;

else

    echo "Don't found sync interface.";

fi;

echo "[ End ]";
