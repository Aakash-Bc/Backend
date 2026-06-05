// randomMiddleware.js

const fs = require('fs');
const path = require('path');

const requestStats = {
    totalRequests: 0,
    blockedRequests: 0,
    successfulRequests: 0
};

function randomMiddleware(req, res, next) {
    const startTime = Date.now();

    requestStats.totalRequests++;

    const requestInfo = {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        timestamp: new Date().toISOString()
    };

    console.log('Incoming Request:', requestInfo);

    const blockedIPs = [
        '192.168.1.200',
        '10.0.0.100'
    ];

    if (blockedIPs.includes(req.ip)) {
        requestStats.blockedRequests++;

        return res.status(403).json({
            success: false,
            message: 'Access Denied'
        });
    }

    req.requestId = generateRequestId();

    req.customData = {
        environment: process.env.NODE_ENV || 'development',
        requestReceivedAt: new Date()
    };

    res.on('finish', () => {
        const duration = Date.now() - startTime;

        requestStats.successfulRequests++;

        const logMessage = `
Request ID: ${req.requestId}
Method: ${req.method}
URL: ${req.originalUrl}
Status: ${res.statusCode}
Duration: ${duration}ms
Time: ${new Date().toISOString()}
--------------------------------------------------
`;

        saveLog(logMessage);
    });

    if (req.headers['x-maintenance-mode'] === 'true') {
        return res.status(503).json({
            success: false,
            message: 'Server under maintenance'
        });
    }

    next();
}

function generateRequestId() {
    const randomPart = Math.random()
        .toString(36)
        .substring(2, 10);

    return `REQ-${Date.now()}-${randomPart}`;
}

function saveLog(content) {
    const logDir = path.join(__dirname, 'logs');

    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
    }

    const logFile = path.join(logDir, 'requests.log');

    fs.appendFile(logFile, content, (err) => {
        if (err) {
            console.error('Log Write Error:', err.message);
        }
    });
}

function getRequestStatistics() {
    return {
        ...requestStats,
        generatedAt: new Date().toISOString()
    };
}

module.exports = {
    randomMiddleware,
    getRequestStatistics
};