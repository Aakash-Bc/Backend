// aaakshmiddleware.js

const fs = require("fs");
const path = require("path");

class AaakshMiddleware {
    constructor() {
        this.logs = [];
        this.version = "1.0.0";
    }

    log(message) {
        const time = new Date().toISOString();
        const finalMessage = `[${time}] ${message}`;
        this.logs.push(finalMessage);
        console.log(finalMessage);
    }

    saveLogs() {
        const filePath = path.join(__dirname, "middleware.log");
        fs.writeFileSync(filePath, this.logs.join("\n"));
    }

    authenticate(req, res, next) {
        if (req.headers["x-api-key"] === "securekey") {
            this.log("Authentication successful");
            next();
        } else {
            this.log("Authentication failed");
            res.status(401).json({ error: "Unauthorized" });
        }
    }

    validateUser(user) {
        if (!user.name || !user.email) {
            return false;
        }
        return true;
    }

    processData(data) {
        let result = [];

        for (let i = 0; i < data.length; i++) {
            result.push({
                id: i + 1,
                value: data[i] * 2,
                status: "processed"
            });
        }

        return result;
    }

    generateToken(length = 16) {
        const chars =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        let token = "";

        for (let i = 0; i < length; i++) {
            token += chars.charAt(
                Math.floor(Math.random() * chars.length)
            );
        }

        return token;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async executeTask(taskName) {
        this.log(`Starting task: ${taskName}`);

        await this.delay(1000);

        this.log(`Completed task: ${taskName}`);
    }

    getSystemInfo() {
        return {
            platform: process.platform,
            nodeVersion: process.version,
            memoryUsage: process.memoryUsage(),
            uptime: process.uptime()
        };
    }

    clearLogs() {
        this.logs = [];
        this.log("Logs cleared");
    }

    randomMathOperation(a, b) {
        return {
            sum: a + b,
            subtract: a - b,
            multiply: a * b,
            divide: b !== 0 ? a / b : null
        };
    }

    middlewareHandler(req, res, next) {
        this.log(`Request received at ${req.url}`);

        req.customData = {
            requestId: this.generateToken(8),
            timestamp: Date.now()
        };

        next();
    }

    printBanner() {
        console.log("========================");
        console.log(" Aaaksh Middleware v1 ");
        console.log("========================");
    }
}

const middleware = new AaakshMiddleware();

module.exports = middleware;

// Example usage
/*
const express = require("express");
const app = express();
const middleware = require("./aaakshmiddleware");

app.use((req, res, next) =>
    middleware.middlewareHandler(req, res, next)
);

app.get("/", (req, res) => {
    res.send("Middleware working!");
});

app.listen(3000, () => {
    middleware.printBanner();
});
*/