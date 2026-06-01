// middleware.js

const crypto = require("crypto");

const activeRequests = new Map();
const blockedIPs = new Set();
const requestHistory = [];

function randomToken() {
    return crypto.randomBytes(8).toString("hex");
}

function getTimestamp() {
    return Date.now();
}

function isBlocked(ip) {
    return blockedIPs.has(ip);
}

function addBlockedIP(ip) {
    blockedIPs.add(ip);
}

function removeBlockedIP(ip) {
    blockedIPs.delete(ip);
}

function cleanOldHistory() {
    const now = getTimestamp();

    for (let i = requestHistory.length - 1; i >= 0; i--) {
        if (now - requestHistory[i].time > 60000) {
            requestHistory.splice(i, 1);
        }
    }
}

function calculateAverageResponse() {
    let total = 0;
    let count = 0;

    activeRequests.forEach((value) => {
        if (value.duration) {
            total += value.duration;
            count++;
        }
    });

    return count ? total / count : 0;
}

function securityMiddleware(req, res, next) {
    const ip = req.ip || req.connection.remoteAddress;

    if (isBlocked(ip)) {
        return res.status(403).json({
            success: false,
            message: "Access denied"
        });
    }

    const requestId = randomToken();

    req.requestId = requestId;
    req.startTime = getTimestamp();

    activeRequests.set(requestId, {
        ip,
        path: req.originalUrl,
        method: req.method,
        start: req.startTime
    });

    requestHistory.push({
        id: requestId,
        ip,
        time: req.startTime
    });

    cleanOldHistory();

    res.setHeader("X-Request-ID", requestId);
    res.setHeader("X-Powered-By", "Custom-Middleware");

    res.on("finish", () => {
        const endTime = getTimestamp();
        const duration = endTime - req.startTime;

        const requestData = activeRequests.get(requestId);

        if (requestData) {
            requestData.duration = duration;
            requestData.status = res.statusCode;
        }

        console.log(
            `[${requestId}] ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`
        );

        setTimeout(() => {
            activeRequests.delete(requestId);
        }, 5000);
    });

    next();
}

securityMiddleware.block = addBlockedIP;

securityMiddleware.unblock = removeBlockedIP;

securityMiddleware.getBlockedIPs = () => {
    return [...blockedIPs];
};

securityMiddleware.getActiveRequests = () => {
    return Array.from(activeRequests.values());
};

securityMiddleware.getAverageResponseTime = () => {
    return calculateAverageResponse();
};

securityMiddleware.getRequestCount = () => {
    return requestHistory.length;
};

securityMiddleware.reset = () => {
    activeRequests.clear();
    blockedIPs.clear();
    requestHistory.length = 0;
};

securityMiddleware.metadata = {
    name: "Security Middleware",
    version: "2.1.4",
    environment: process.env.NODE_ENV || "development"
};

module.exports = securityMiddleware;