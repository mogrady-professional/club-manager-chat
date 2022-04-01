# Club Manager Chat

<p align="center"><img src="images/screencapture-localhost-3000-2022-03-30-21_25_14.png"  height="auto" width="100%">
</p>

# Table of Contents

# Introduction

Full-Stack JavaScript application representing a GAA Club Team Chat App developed in a MVC Pattern. Project uses the EJS templating engine to display views.

# Functionality

- Automatic App Restarts with Nodemon
- Follow and Post Functionality by user ID
- Protected Routes (UserController.mustBeLoggedIn)
- Flash messages
- Object Validation with Prototype TypeOf
- Await/Async for database interaction
- Try catch block added to Await/Async
- Gravitar used for Avatars
- Array Destructuring used for Post,Followers,Following Counts
- Chat Functionality for logged in users
- socket connection between browser and server
- Security addded to chat functionality with sanitizeHTML on the server and DOMPurify on the client side
- Real time Registration Form Validation to enhance user experience, real Validation is done on the server side.
- Checking if the username already exists within the MongoDB database prior to user registering -> using axios in the Registration to send async request to server; trip to the server
- Form submission prevented unless all elements are validated
- onBlur event listened to within form submission -> ensure if user skips field errors still show
- CSRF attack protection
- API Built including -> Seperate Router for API Requests
- JSON Webtokens
- MVC Pattern
- Publicly available request
- CORS Request
- Send email functionality through SendGrid API

# Live application

To view the live application visit the following URL:

- [https://the-great-irish-bucket-list.herokuapp.com/](https://the-great-irish-bucket-list.herokuapp.com/)

# Project Schema

```
.
├── public -> Client Public Side
│   ├── browser.js -> Client-side JavaScript
│   └── assets
│     └── img
│     └── css
│       └── style.css
├── server.js -> Server-side code in Node.js with an Express Back-end
```

## Package used

├── @babel/core@7.17.7
├── @babel/preset-env@7.16.11
├── @sendgrid/mail@7.6.2
├── axios@0.24.0
├── babel-loader@8.2.3
├── bcryptjs@2.4.3
├── connect-flash@0.1.1
├── connect-mongo@4.6.0
├── cors@2.8.5
├── csurf@1.11.0
├── dompurify@2.3.6
├── dotenv@10.0.0
├── ejs@3.1.6
├── env@0.0.2
├── express-session@1.17.2
├── express@4.17.3
├── jsonwebtoken@8.5.1
├── marked@4.0.12
├── md5@2.3.0
├── mongodb@4.4.1
├── nodemon@2.0.15
├── sanitize-html@2.7.0
├── socket.io@4.4.1
├── validator@13.7.0
├── webpack-cli@4.9.2
└── webpack@5.70.0

# Instructions for running the application locally in development

To run the application for the first time, clone or download the repo and run the following commands:

- `npm install`
- `npm run watch`

`npm run watch` starts two command prompt windows;

- webpack (Webpack is an open-source JavaScript module bundler.)
- nodemon (nodemon is a tool that helps develop node.js based applications by automatically restarting the node application when file changes in the directory are detected.)
