const Post = require("../models/Post");
const sendgrid = require("@sendgrid/mail");
sendgrid.setApiKey(process.env.SENDGRIDAPIKEY);

exports.viewCreateScreen = function(req, res) {
    res.render("create-post");
};

// Old
// Create Post and Send Email -> Posts Model
// exports.create = function(req, res) {
//     let post = new Post(req.body, req.session.user._id);
//     post
//         .create()
//         .then(function(newId) {
//             // Send Email
//             sendgrid.send({
//                 to: "mogrady.professional@gmail.com",
//                 from: "mogrady.personal@gmail.com",
//                 subject: "Congrats on Creating a New Post!",
//                 text: "You did a great job of creating a post.",
//                 html: "You did a <strong>Great</strong> job of creating a post.",
//             });
//             req.flash("success", "New post successfully created.");
//             req.session.save(() => res.redirect(`/post/${newId}`));
//         })
//         .catch(function(errors) {
//             errors.forEach((error) => req.flash("errors", error));
//             req.session.save(() => res.redirect("/create-post"));
//         });
// };

// Removal of .then() and .catch()
exports.create = async function(req, res) {
    let post = new Post(req.body, req.session.user._id);

    try {
        const newId = await post.create();

        // Send Email
        sendgrid.send({
            to: "mogrady.professional@gmail.com",
            from: "mogrady.personal@gmail.com",
            subject: "Congrats on Creating a New Post!",
            text: "You did a great job of creating a post.",
            html: "You did a <strong>Great</strong> job of creating a post.",
        });
        req.flash("success", "New post successfully created.");
        req.session.save(() => res.redirect(`/post/${newId}`));
    } catch (error) {
        errors.forEach((error) => req.flash("errors", error));
        req.session.save(() => res.redirect("/create-post"));
    }
};

// API Post Request  (api/create-post)
// exports.apiCreate = function(req, res) {
//     // Pass in user id -> no longer using sessions
//     // apiUser -> payload that was stored in the token -> look inside it for the _id
//     let post = new Post(req.body, req.apiUser._id);
//     post
//         .create()
//         .then(function(newId) {
//             res.json("Congrats");
//             // In production, include the Object ID
//             console.log(newId);
//         })
//         .catch(function(errors) {
//             res.json(errors);
//         });
// };

// API Post Request  (api/create-post) -> try catch improved
exports.apiCreate = async function(req, res) {
    // Pass in user id -> no longer using sessions
    // apiUser -> payload that was stored in the token -> look inside it for the _id
    let post = new Post(req.body, req.apiUser._id);

    try {
        const newId = await post.create();
        res.json("Congrats");
        // In production, include the Object ID
        console.log(newId);
    } catch (error) {
        res.json(errors);
    }

    post
        .create()
        .then(function(newId) {})
        .catch(function(errors) {});
};

// Render the Single Post Screen
exports.viewSingle = async function(req, res) {
    try {
        let post = await Post.findSingleById(req.params.id, req.visitorId);
        res.render("single-post-screen", { post: post, title: post.title });
    } catch {
        res.render("404");
    }
};

// Render the Edit Post Screen
exports.viewEditScreen = async function(req, res) {
    try {
        let post = await Post.findSingleById(req.params.id, req.visitorId);
        if (post.isVisitorOwner) {
            res.render("edit-post", { post: post });
        } else {
            req.flash("errors", "You do not have permission to perform that action.");
            req.session.save(() => res.redirect("/"));
        }
    } catch {
        res.render("404");
    }
};

// exports.edit = function(req, res) {
//     let post = new Post(req.body, req.visitorId, req.params.id);
//     post
//         .update()
//         .then((status) => {
//             // the post was successfully updated in the database
//             // or user did have permission, but there were validation errors
//             if (status == "success") {
//                 // post was updated in db
//                 req.flash("success", "Post successfully updated.");
//                 req.session.save(function() {
//                     res.redirect(`/post/${req.params.id}/edit`);
//                 });
//             } else {
//                 post.errors.forEach(function(error) {
//                     req.flash("errors", error);
//                 });
//                 req.session.save(function() {
//                     res.redirect(`/post/${req.params.id}/edit`);
//                 });
//             }
//         })
//         .catch(() => {
//             // a post with the requested id doesn't exist
//             // or if the current visitor is not the owner of the requested post
//             req.flash("errors", "You do not have permission to perform that action.");
//             req.session.save(function() {
//                 res.redirect("/");
//             });
//         });
// };

// Converted from .then().catch() to await async try catch
exports.edit = async function(req, res) {
    let post = new Post(req.body, req.visitorId, req.params.id);
    try {
        const status = await post.actuallyUpdate.update();
        // the post was successfully updated in the database
        // or user did have permission, but there were validation errors
        if (status == "success") {
            // post was updated in db
            req.flash("success", "Post successfully updated.");
            req.session.save(function() {
                res.redirect(`/post/${req.params.id}/edit`);
            });
        } else {
            post.errors.forEach(function(error) {
                req.flash("errors", error);
            });
            req.session.save(function() {
                res.redirect(`/post/${req.params.id}/edit`);
            });
        }
    } catch (error) {
        // a post with the requested id doesn't exist
        // or if the current visitor is not the owner of the requested post
        req.flash("errors", "You do not have permission to perform that action.");
        req.session.save(function() {
            res.redirect("/");
        });
    }
};

// exports.delete = function(req, res) {
//     Post.delete(req.params.id, req.visitorId)
//         .then(() => {
//             req.flash("success", "Post successfully deleted.");
//             req.session.save(() =>
//                 res.redirect(`/profile/${req.session.user.username}`)
//             );
//         })
//         .catch(() => {
//             req.flash("errors", "You do not have permission to perform that action.");
//             req.session.save(() => res.redirect("/"));
//         });
// };

// Converted from .then().catch() to await async try catch
exports.delete = async function(req, res) {
    try {
        await Post.delete(req.params.id, req.visitorId);
        req.flash("success", "Post successfully deleted.");
        req.session.save(() =>
            res.redirect(`/profile/${req.session.user.username}`)
        );
    } catch (error) {
        req.flash("errors", "You do not have permission to perform that action.");
        req.session.save(() => res.redirect("/"));
    }
};

// API DELETE request (delete post)
// API must be logged in function will make this available
// exports.apiDelete = function(req, res) {
//     Post.delete(req.params.id, req.apiUser._id)
//         .then(() => {
//             res.json("Success");
//         })
//         .catch(() => {
//             res.json("You do not have permission to preform that action.");
//         });
// };

// Converted from .then().catch() to await async try catch
exports.apiDelete = async function(req, res) {
    try {
        await Post.delete(req.params.id, req.apiUser._id);
        res.json("Success");
    } catch (errors) {
        res.json("You do not have permission to perform that action.");
    }
};

// exports.search = function(req, res) {
//     Post.search(req.body.searchTerm)
//         .then((posts) => {
//             res.json(posts);
//         })
//         .catch(() => {
//             res.json([]);
//         });
// };

// Converteded from .then().catch() to await async try catch
exports.search = async function(req, res) {
    try {
        const posts = await Post.search(req.body.searchTerm);
        res.json(posts);
    } catch (errors) {
        res.json([]);
    }
};