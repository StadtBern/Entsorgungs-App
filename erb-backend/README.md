# Backend Entsorgungs-App of Entsorgung & Recycling der Stadt Bern

## db-api-express

This app is an express app used as interface between the database and the mobile- or web-app.
If you want to run the app, you have to install Node.js and express. You can follow the instructions from https://expressjs.com/en/starter/installing.html.

To start the db-api-express by itself you can switch to the folder db-api-express/ and run the command:

`node server.js`

## hybrid-app-erb-server

A react webapp was created so that the user can manage the content in the app. This app runs on a nginx webserver.
If you want to run the app, you have to install Node.js and npm. You can follow the instructions from
https://reactjs.org/docs/create-a-new-react-app.html

To start the hybrid-app-erb-server by itself you can switch to the folder hybrid-app-erb-server/app/ and run the command:

`npm start`

## Install

To run all the app, you need to install docker and run the following command:

`docker-compose up --build`
