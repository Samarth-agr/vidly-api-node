const winston = require('winston');
require('express-async-errors');

module.exports = function () {
    // Handle uncaught exceptions
    winston.exceptions.handle(
        new winston.transports.Console({ format: winston.format.simple() }),
        new winston.transports.File({ filename: 'uncaughtExceptions.log' })
    );

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (ex) => {
        throw ex;
    });

    // Add file transport for logging
    winston.add(new winston.transports.File({ filename: 'logfile.log' }));
};
