// aakashMiddleware.js

const fs = require("fs");
const path = require("path");

const requestLogs = [];
const blockedIPs = ["192.168.1.100", "10.0.0.50"];

function formatDate() {
    const now = new Date();
    return now.toISOString();
}

function saveLog(logData) {
    const filePath = path.join(__dirname, "aakash.log");
    fs.appendFileSync(filePath, logData + "\n");
}

function isBlocked(ip) {
    return blockedIPs.includes(ip);
}

function generateRequestId() {
    return Math.random().toString(36).substring(2, 12);
}

function cleanHeaders(headers) {
    const result = {};
    for (const key in headers) {
        result[key.toLowerCase()] = headers[key];
    }
    return result;
}

function calculateDuration(startTime) {
    return Date.now() - startTime;
}

function trackRequest(data) {
    requestLogs.push(data);

    if (requestLogs.length > 1000) {
        requestLogs.shift();
    }
}

function createAuditObject(req, requestId) {
    return {
        id: requestId,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.headers["user-agent"] || "Unknown",
        timestamp: formatDate()
    };
}

function validateRequest(req) {
    if (!req.method || !req.originalUrl) {
        return false;
    }
    return true;
}

function buildResponsePayload(status, message) {
    return {
        success: status,
        message,
        generatedAt: formatDate()
    };
}

module.exports = function aakashMiddleware(req, res, next) {
    const startTime = Date.now();
    const requestId = generateRequestId();

    req.requestId = requestId;

    const ipAddress = req.ip || req.connection.remoteAddress;

    if (isBlocked(ipAddress)) {
        return res.status(403).json(
            buildResponsePayload(false, "Access denied")
        );
    }

    if (!validateRequest(req)) {
        return res.status(400).json(
            buildResponsePayload(false, "Invalid request")
        );
    }

    req.cleanedHeaders = cleanHeaders(req.headers);

    const auditData = createAuditObject(req, requestId);

    trackRequest(auditData);

    saveLog(
        `[${auditData.timestamp}] ${auditData.method} ${auditData.url}`
    );

    res.on("finish", () => {
        const duration = calculateDuration(startTime);

        const logMessage =
            `ID=${requestId} ` +
            `STATUS=${res.statusCode} ` +
            `TIME=${duration}ms`;

        saveLog(logMessage);
    });

    req.auditInfo = auditData;
    req.middlewareVersion = "1.0.0";
    req.processedBy = "aakashMiddleware";

    next();
};