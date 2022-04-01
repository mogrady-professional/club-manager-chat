// Create Express Server that Listens for Incoming Requests
const express = require("express");
// Session and Cookie NPM Package
const session = require("express-session");
// Bring in Sessions in MongoDB
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const markdown = require("marked");
const csrf = require("csurf"); // CSRF protection
const app = express();
// Config options for sessions; 1 day before cookie expires
// Pass to MongoStore
const sanitizeHTML = require("sanitize-html");

// app.use() applies to all the below routes...
// enable app.use() to be able to read incoming body request data and json data

// Add user submitted data onto the request object; then accessable from request body
app.use(express.urlencoded({ extended: false })); // Traditional form submit
app.use(express.json()); // Sending JSON data

// Seperate route for the API
app.use("/api", require("./router-api"));

let sessionOptions = session({
    secret: "JavaScript is sooooooooo coool",
    store: MongoStore.create({ client: require("./db") }),
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true },
});

// app.use -> uses run those functions for every route that's listed below "app.use() lines"

app.use(sessionOptions);
app.use(flash());

// Auth using session for every request -> user property within ejs templates
app.use(function(req, res, next) {
    // make our markdown function available from within ejs templates
    res.locals.filterUserHTML = function(content) {
        return sanitizeHTML(markdown.parse(content), {
            allowedTags: [
                "p",
                "br",
                "ul",
                "ol",
                "li",
                "strong",
                "bold",
                "i",
                "em",
                "h1",
                "h2",
                "h3",
                "h4",
                "h5",
                "h6",
            ],
            allowedAttributes: {},
        });
    };

    // make all error and success flash messages available from all templates
    res.locals.errors = req.flash("errors");
    res.locals.success = req.flash("success");

    // make current user id available on the req object
    if (req.session.user) {
        req.visitorId = req.session.user._id;
    } else {
        req.visitorId = 0;
    }

    // make user session data available from within view templates
    res.locals.user = req.session.user;
    next();
});

const router = require("./router"); // bing in code from router to handle routes!
// const MongoStore = require("connect-mongo");
// console.log(router);

// Bring in the Public folder -> make accessable
app.use(express.static("public"));

// Set Views Configuration Object for Express
// Parameters a) Must be "views" b) folder where they are located (views folder)
app.set("views", "views");

/*
Let Express know which Templating System/Engine we are using
There are many! Such as: 
Handlebars, Pug, EJS 
EJS is the one we are using in this course
*/
app.set("view engine", "ejs");

// CRSF Protection -> token
app.use(csrf());

// Make token available to use within the app
app.use(function(req, res, next) {
    // CSRF token to output to into the HTML template
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use("/", router); // Router Template for the homepage

// Error Template including -> CSRF Protection -> /redirection
app.use(function(err, req, res, next) {
    if (err) {
        if (err.code == "EBADCSRFTOKEN") {
            // If the error is related to the CSRF token not being a metch
            req.flash("errors", "Cross site request forgery detected.");
            req.session.save(() => res.redirect("/"));
        } else {
            res.render("404");
        }
    }
});

// Server to power socket connections
// Create server that uses express app as handler
const server = require("http").createServer(app);

const io = require("socket.io")(server);

// Express Session Package integrating with Socket IO Package
// Run anytime there is a new transfer of data
// Make express session data available within the context of socket.io
io.use(function(socket, next) {
    sessionOptions(socket.request, socket.request.res, next);
});

// Socket Functionality
io.on("connection", function(socket) {
    // Output message to Server console
    console.log("A new user connected!");
    //    Only if user is actually logged in with user session data will chat be acknowledged (web browser has opened socket connection)
    if (socket.request.session.user) {
        // When a user log's in, store
        let user = socket.request.session.user;

        // Run when new connection is established -> Welcome Event
        socket.emit("Welcome", { username: user.username, avatar: user.avatar });

        // recieve incoming data the server is sending to the browser
        socket.on("chatMessageFromBrowser", function(data) {
            // Send message to servers command line
            console.log(data.message);
            // Send message out to any and all connected browsers
            // Include relevant username and gravatar
            // io.emit("chatMessageFromServer", {
            // Send message to aly and all connected browsers except the socket connection that sent the message
            socket.broadcast.emit("chatMessageFromServer", {
                message: sanitizeHTML(data.message, {
                    allowedTags: [],
                    allowedAttributes: {},
                }),
                username: user.username,
                avatar: user.avatar,
            });
        });
    }
});

// app.listen(3002);
// module.exports = app; // exporting it from this file! and importing it into db!
module.exports = server;