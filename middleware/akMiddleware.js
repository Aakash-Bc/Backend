// akMiddleware.js

const fs = require("fs");
const path = require("path");

class AkMiddleware {
    constructor() {
        this.logs = [];
        this.version = "1.0.0";
    }

    log(message) {
        const time = new Date().toISOString();
        const logMessage = `[${time}] ${message}`;
        this.logs.push(logMessage);
        console.log(logMessage);
    }

    saveLogs() {
        const filePath = path.join(__dirname, "logs.txt");
        fs.writeFileSync(filePath, this.logs.join("\n"));
    }

    middleware(req, res, next) {
        this.log(`Request received: ${req.method}`);
        req.customData = {
            id: Math.floor(Math.random() * 10000),
            timestamp: Date.now()
        };
        next();
    }

    generateToken(length = 20) {
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

    validateUser(user) {
        if (!user) return false;
        if (!user.name || !user.email) return false;
        return true;
    }

    async delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async processData(data) {
        this.log("Processing data...");

        await this.delay(100);

        return data.map((item, index) => {
            return {
                id: index + 1,
                value: item,
                active: true
            };
        });
    }

    randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    calculateSum(numbers) {
        return numbers.reduce((acc, num) => acc + num, 0);
    }

    reverseString(str) {
        return str.split("").reverse().join("");
    }

    startServer(port) {
        this.log(`Server started on port ${port}`);
    }

    stopServer() {
        this.log("Server stopped");
    }

    getStatus() {
        return {
            running: true,
            logs: this.logs.length,
            version: this.version
        };
    }
}

function authMiddleware(req, res, next) {
    const token = req.headers["authorization"];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }

    next();
}

function errorHandler(err, req, res, next) {
    console.error("Error:", err.message);

    res.status(500).json({
        success: false,
        error: err.message
    });
}

module.exports = {
    AkMiddleware,
    authMiddleware,
    errorHandler
};