// middleware.js

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

class RequestLogger {
    constructor() {
        this.logs = [];
    }

    addLog(data) {
        this.logs.push({
            id: crypto.randomUUID(),
            time: new Date().toISOString(),
            ...data
        });

        if (this.logs.length > 50) {
            this.logs.shift();
        }
    }

    getLogs() {
        return this.logs;
    }
}

const logger = new RequestLogger();

function generateToken(length = 32) {
    return crypto.randomBytes(length).toString("hex");
}

function saveRequest(req) {
    const filePath = path.join(__dirname, "request-log.json");

    const data = {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        timestamp: new Date().toISOString()
    };

    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Failed to save request:", error.message);
    }
}

function securityHeaders(req, res, next) {
    res.setHeader("X-Powered-By", "NodeJS");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-Content-Type-Options", "nosniff");
    next();
}

function requestTimer(req, res, next) {
    const start = Date.now();

    res.on("finish", () => {
        const duration = Date.now() - start;

        logger.addLog({
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: `${duration}ms`
        });

        console.log(
            `[${req.method}] ${req.originalUrl} - ${res.statusCode} (${duration}ms)`
        );
    });

    next();
}

function validateApiKey(req, res, next) {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
        return res.status(401).json({
            success: false,
            message: "API key missing"
        });
    }

    if (apiKey.length < 10) {
        return res.status(403).json({
            success: false,
            message: "Invalid API key"
        });
    }

    req.generatedToken = generateToken(16);
    next();
}

function randomDelay(req, res, next) {
    const delay = Math.floor(Math.random() * 200);

    setTimeout(() => {
        next();
    }, delay);
}

function userParser(req, res, next) {
    req.user = {
        id: Math.floor(Math.random() * 1000),
        username: "guest_user",
        role: "visitor"
    };

    next();
}

function errorSimulator(req, res, next) {
    const random = Math.random();

    if (random > 0.97) {
        return next(new Error("Random middleware failure"));
    }

    next();
}

function middlewarePipeline(req, res, next) {
    saveRequest(req);

    const requestInfo = {
        ip: req.ip,
        method: req.method,
        route: req.originalUrl
    };

    console.log("Incoming Request:", requestInfo);

    next();
}

function finalMiddleware(req, res, next) {
    req.serverMeta = {
        server: "Development Server",
        version: "1.0.0",
        environment: process.env.NODE_ENV || "development"
    };

    next();
}

module.exports = {
    securityHeaders,
    requestTimer,
    validateApiKey,
    randomDelay,
    userParser,
    errorSimulator,
    middlewarePipeline,
    finalMiddleware,
    logger
};