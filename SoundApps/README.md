# Sound App

## Description

This application allows users to toggle buttons on/off to play an audio track on a loop or pause the loop.

## Server

The server is written as a simple JavaScript file. You will need to provide a collection of .wav files in the assets/sounds folder. As an example, you can visit this [link](https://samples.landr.com/packs/pantone-classic-blue-sample-pack?creator=eyJ2ZXJzaW9uIjoxLCJicG0iOjEyMCwia2V5Um9vdCI6IkMiLCJrZXlRdWFsaXR5IjoibWFqb3IiLCJzYW1wbGVzIjpbXX0%3D) to download the preferred PANTONE 2020 Color of the Year Sample Pack.
Once you have loaded .wav files, you can use `npm server.js` in the /soundserver directory to run the server application.

## React Page

The view is written in React. Use `npm start` to start the application.
The application will retrieve the .wav file names to display from the server & retrieve tracks when the buttons are selected. 