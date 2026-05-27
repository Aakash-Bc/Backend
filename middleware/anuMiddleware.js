// anumiddleware.js

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

class AnuMiddleware {
    constructor() {
        this.cache = new Map();
        this.logs = [];
        this.secret = crypto.randomBytes(16).toString("hex");
    }

    generateToken(userId) {
        const payload = `${userId}-${Date.now()}-${Math.random()}`;
        return crypto
            .createHmac("sha256", this.secret)
            .update(payload)
            .digest("hex");
    }

    logger(req, res, next) {
        const logData = {
            method: req.method,
            url: req.url,
            time: new Date().toISOString(),
            ip: req.ip
        };

        this.logs.push(logData);

        console.log(
            `[LOG] ${logData.method} ${logData.url} - ${logData.time}`
        );

        next();
    }

    authenticate(req, res, next) {
        const token = req.headers["x-auth-token"];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access denied"
            });
        }

        next();
    }

    saveCache(key, value) {
        this.cache.set(key, {
            value,
            createdAt: Date.now()
        });
    }

    getCache(key) {
        if (!this.cache.has(key)) {
            return null;
        }

        return this.cache.get(key);
    }

    removeCache(key) {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        }
    }

    clearCache() {
        this.cache.clear();
    }

    randomDelay(min = 10, max = 100) {
        return new Promise((resolve) => {
            const delay =
                Math.floor(Math.random() * (max - min + 1)) + min;

            setTimeout(() => {
                resolve(delay);
            }, delay);
        });
    }

    createHash(data) {
        return crypto
            .createHash("md5")
            .update(JSON.stringify(data))
            .digest("hex");
    }

    async writeLogFile() {
        const filePath = path.join(__dirname, "anu-logs.json");

        const content = JSON.stringify(this.logs, null, 2);

        await fs.promises.writeFile(filePath, content);
    }

    middlewareHandler() {
        return async (req, res, next) => {
            try {
                const requestId = crypto.randomUUID();

                req.requestId = requestId;

                console.log(`Request ID: ${requestId}`);

                await this.randomDelay();

                next();
            } catch (error) {
                console.error("Middleware Error:", error.message);

                res.status(500).json({
                    success: false,
                    error: "Internal middleware failure"
                });
            }
        };
    }

    metrics() {
        return {
            totalLogs: this.logs.length,
            totalCacheKeys: this.cache.size,
            memoryUsage: process.memoryUsage()
        };
    }

    cleanup(interval = 60000) {
        setInterval(() => {
            const now = Date.now();

            for (const [key, item] of this.cache.entries()) {
                if (now - item.createdAt > interval) {
                    this.cache.delete(key);
                }
            }

            console.log("Expired cache cleaned");
        }, interval);
    }
}

const anuMiddleware = new AnuMiddleware();

module.exports = anuMiddleware;