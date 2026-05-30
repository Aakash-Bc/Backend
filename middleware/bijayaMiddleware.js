// bijayaMiddleware.js

const crypto = require('crypto');

class BijayaMiddleware {
    constructor() {
        this.requestCount = 0;
        this.blockedIPs = new Set();
        this.logs = [];
    }

    generateRequestId() {
        return crypto.randomBytes(8).toString('hex');
    }

    logRequest(req, requestId) {
        const log = {
            id: requestId,
            method: req.method,
            url: req.originalUrl,
            ip: req.ip,
            time: new Date().toISOString()
        };

        this.logs.push(log);

        if (this.logs.length > 1000) {
            this.logs.shift();
        }
    }

    isBlocked(ip) {
        return this.blockedIPs.has(ip);
    }

    blockIP(ip) {
        this.blockedIPs.add(ip);
    }

    unblockIP(ip) {
        this.blockedIPs.delete(ip);
    }

    middleware() {
        return (req, res, next) => {
            this.requestCount++;

            const requestId = this.generateRequestId();

            req.requestId = requestId;

            if (this.isBlocked(req.ip)) {
                return res.status(403).json({
                    success: false,
                    message: 'Access Denied',
                    requestId
                });
            }

            this.logRequest(req, requestId);

            res.setHeader('X-Request-ID', requestId);
            res.setHeader('X-Powered-By', 'BijayaMiddleware');

            const startTime = Date.now();

            res.on('finish', () => {
                const duration = Date.now() - startTime;

                console.log(
                    `[${requestId}] ${req.method} ${req.originalUrl} ` +
                    `${res.statusCode} - ${duration}ms`
                );
            });

            next();
        };
    }

    getStats() {
        return {
            totalRequests: this.requestCount,
            blockedIPs: this.blockedIPs.size,
            storedLogs: this.logs.length
        };
    }

    clearLogs() {
        this.logs = [];
    }
}

const bijayaMiddleware = new BijayaMiddleware();

module.exports = {
    middleware: bijayaMiddleware.middleware(),
    manager: bijayaMiddleware
};