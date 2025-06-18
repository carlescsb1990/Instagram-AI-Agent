"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var dotenv = require("dotenv");
dotenv.config();
var app = express();
app.get("/", function (_req, res) {
    res.json({ message: "Simple server is working!", status: "ok" });
});
app.get("/health", function (_req, res) {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
});
var port = process.env.PORT || 3000;
var server = app.listen(port, function () {
    console.log("Simple server running on port ".concat(port));
});
process.on("SIGTERM", function () {
    console.log("Received SIGTERM, shutting down...");
    server.close(function () {
        console.log("Server closed");
        process.exit(0);
    });
});
process.on("SIGINT", function () {
    console.log("Received SIGINT, shutting down...");
    server.close(function () {
        console.log("Server closed");
        process.exit(0);
    });
});
