#!/bin/bash

export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools
ember cdv:build --platform android

