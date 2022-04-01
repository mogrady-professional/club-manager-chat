const path = require("path");
const webpack = require("webpack");
// Where the JavaScript file/s are located, and where to export to; also setup of babel, turn modern JS into all compatable browsers
module.exports = {
    entry: "./frontend-js/main.js",
    output: {
        filename: "main-bundled.js",
        path: path.resolve(__dirname, "public"),
    },
    mode: "production",
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader",
                options: {
                    presets: ["@babel/preset-env"],
                },
            },
        }, ],
    },
};