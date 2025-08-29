"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shutdown = void 0;
var logger_1 = require("../config/logger");
// Graceful shutdown function
var shutdown = function (server) {
    try {
        logger_1.default.info("Shutting down gracefully...");
        // Attempt to close the server
        server.close(function () {
            logger_1.default.info("Closed all connections gracefully.");
            // Optional: clean up other resources (like DB connections)
            process.exit(0); // Exit the process after everything is closed
        });
        // If server hasn't closed after 10 seconds, force shutdown
        setTimeout(function () {
            logger_1.default.error("Forcing shutdown after timeout.");
            process.exit(1); // Force exit with an error code if shutdown times out
        }, 10000);
    }
    catch (error) {
        // Handle any error that occurs during the shutdown process
        logger_1.default.error("Error during shutdown: ".concat(error.message));
        process.exit(1); // Exit with error code if shutdown fails
    }
};
exports.shutdown = shutdown;
