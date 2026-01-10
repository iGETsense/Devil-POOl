
const fs = require('fs');
const path = require('path');
const Mesomb = require('@hachther/mesomb');

// Load .env.local manually
try {
    const envConfig = fs.readFileSync(path.resolve(__dirname, '.env.local'), 'utf-8');
    envConfig.split(/\r?\n/).forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
} catch (e) {
    console.error("Could not load .env.local", e);
}

async function testBalance() {
    console.log("Inspecting @hachther/mesomb exports...");
    console.log("Exports:", Object.keys(Mesomb));

    const { PaymentOperation, Application } = Mesomb;

    if (!Application) {
        console.error("Application class is NOT exported.");
    } else {
        console.log("Application class IS exported.");
        console.log("Application Prototype:", Object.getOwnPropertyNames(Application.prototype || {}));

        try {
            const app = new Application({
                applicationKey: process.env.MESOMB_APPLICATION_KEY,
                accessKey: process.env.MESOMB_ACCESS_KEY,
                secretKey: process.env.MESOMB_SECRET_KEY,
            });
            console.log("App Instance Methods:", Object.getOwnPropertyNames(Object.getPrototypeOf(app)));

            // Try getBalance
            if (app.getBalance) {
                console.log("Calling app.getBalance()...");
                const b = await app.getBalance();
                console.log("BALANCE:", b);
            } else if (app.getStatus) {
                console.log("Calling app.getStatus()...");
                const s = await app.getStatus();
                console.log("STATUS:", s);
            }
        } catch (e) {
            console.error("Error invoking Application methods:", e.message);
        }
    }
}

testBalance();
