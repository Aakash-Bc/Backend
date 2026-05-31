// middleware.js

const fs = require("fs");
const path = require("path");

const requestLogs = [];

function getCurrentTime() {
    return new Date().toISOString();
}

function generateRequestId() {
    return Math.random().toString(36).substring(2, 12);
}

function saveLogToFile(logData) {
    const filePath = path.join(__dirname, "server.log");

    fs.appendFile(
        filePath,
        JSON.stringify(logData) + "\n",
        (err) => {
            if (err) {
                console.error("Log write failed:", err);
            }
        }
    );
}

function middleware(req, res, next) {
    const requestId = generateRequestId();
    const startTime = Date.now();

    req.requestId = requestId;

    const log = {
        requestId,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        time: getCurrentTime()
    };

    requestLogs.push(log);

    console.log(
        `[${log.time}] ${log.method} ${log.url} (${requestId})`
    );

    res.on("finish", () => {
        const duration = Date.now() - startTime;

        const responseLog = {
            requestId,
            statusCode: res.statusCode,
            duration,
            completedAt: getCurrentTime()
        };

        saveLogToFile(responseLog);

        console.log(
            `Response ${res.statusCode} | ${duration}ms | ${requestId}`
        );
    });

    next();
}

middleware.getLogs = function () {
    return requestLogs;
};

middleware.clearLogs = function () {
    requestLogs.length = 0;
};

middleware.findLog = function (requestId) {
    return requestLogs.find(
        (item) => item.requestId === requestId
    );
};

middleware.stats = function () {
    const total = requestLogs.length;

    return {
        totalRequests: total,
        lastRequest:
            total > 0
                ? requestLogs[total - 1]
                : null
    };
};

middleware.healthCheck = function () {
    return {
        status: "OK",
        uptime: process.uptime(),
        timestamp: getCurrentTime()
    };
};

middleware.version = "1.0.0";

middleware.author = "Random Generator";

middleware.config = {
    enableLogs: true,
    saveToFile: true,
    maxMemoryLogs: 500
};

module.exports = middleware;