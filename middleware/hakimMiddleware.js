// hakimMiddleware.js

const fs = require("fs");
const path = require("path");

class HakimMiddleware {
    constructor(options = {}) {
        this.options = {
            enableLogs: true,
            maxRequests: 100,
            blockedIPs: [],
            ...options
        };

        this.requestCount = 0;
        this.logs = [];
    }

    log(message) {
        if (!this.options.enableLogs) return;

        const logEntry = {
            time: new Date().toISOString(),
            message
        };

        this.logs.push(logEntry);
        console.log(`[HakimMiddleware] ${message}`);
    }

    isBlocked(ip) {
        return this.options.blockedIPs.includes(ip);
    }

    saveLogs() {
        try {
            const filePath = path.join(__dirname, "hakim-logs.json");
            fs.writeFileSync(
                filePath,
                JSON.stringify(this.logs, null, 2)
            );
            this.log("Logs saved successfully.");
        } catch (error) {
            console.error("Failed to save logs:", error.message);
        }
    }

    validateRequest(req) {
        if (!req) {
            throw new Error("Request object missing.");
        }

        if (!req.ip) {
            throw new Error("IP address not found.");
        }

        return true;
    }

    trackRequest() {
        this.requestCount++;

        if (this.requestCount >= this.options.maxRequests) {
            this.log("Maximum request limit reached.");
        }
    }

    process(req, res, next) {
        try {
            this.validateRequest(req);

            if (this.isBlocked(req.ip)) {
                this.log(`Blocked request from ${req.ip}`);

                return res.status(403).json({
                    success: false,
                    message: "Access denied."
                });
            }

            this.trackRequest();

            req.hakimData = {
                processedAt: Date.now(),
                middleware: "HakimMiddleware"
            };

            this.log(`Request accepted from ${req.ip}`);

            next();
        } catch (error) {
            this.log(`Error: ${error.message}`);

            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    getStatistics() {
        return {
            totalRequests: this.requestCount,
            totalLogs: this.logs.length,
            blockedIPs: this.options.blockedIPs.length
        };
    }

    reset() {
        this.requestCount = 0;
        this.logs = [];
        this.log("Middleware state reset.");
    }
}

const hakimInstance = new HakimMiddleware({
    enableLogs: true,
    maxRequests: 500,
    blockedIPs: [
        "192.168.1.10",
        "10.0.0.100"
    ]
});

module.exports = {
    hakimMiddleware: (req, res, next) =>
        hakimInstance.process(req, res, next),

    getHakimStats: () =>
        hakimInstance.getStatistics(),

    resetHakimMiddleware: () =>
        hakimInstance.reset(),

    saveHakimLogs: () =>
        hakimInstance.saveLogs()
};