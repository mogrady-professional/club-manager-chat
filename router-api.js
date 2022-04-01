// Bring in Express router
const apiRouter = require("express").Router();
// Classes and Functionality to Import
const userController = require("./controllers/userController");
const postController = require("./controllers/postController");
const followController = require("./controllers/followController");
const cors = require("cors");

// Use CORS on all Routes below this line
// Config's all routes listed below this to set the CORS Policy so it is aloud from any domain
apiRouter.use(cors());

// Add routes to listen for and functions to run

// apiRouter.post("/api/login") -> not required as already prepended to the route request in the app.js file

apiRouter.post("/login", userController.apiLogin);

// POST -> Create a Post (POST request)
// Must be logged in otherwise apiCreate will not be reached, otherwise never will reach the api.create function
apiRouter.post(
    "/create-post",
    userController.apiMustBeLoggedIn,
    postController.apiCreate
);

// DELETE -> delete a post (DELETE request)
apiRouter.delete(
    "/post/:id",
    userController.apiMustBeLoggedIn,
    postController.apiDelete
);

// GET Request -> Find posts by User
apiRouter.get("/postsByAuthor/:username", userController.apiGetPostsByUsername);

// export this so it's available to the file importing it
module.exports = apiRouter;