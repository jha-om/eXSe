import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";

const ARCJET_KEY = process.env.ARCJET_KEY;

const aj = arcjet({
    key: ARCJET_KEY,
    characteristics: ["ip.src"], // Track requests by IP
    rules: [
        shield({ mode: "LIVE" }),
        detectBot({
            mode: "LIVE",
            // Blocks requests. Use "DRY_RUN" to log only
            allow: [
                "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
                //"CATEGORY:MONITOR", // Uptime monitoring services
                //"CATEGORY:PREVIEW", // Link previews e.g. Slack, Discord
            ],
        }),
        tokenBucket({
            mode: "LIVE",
            refillRate: 5, // Refill 5 tokens per interval
            interval: 50, // Refill every 50 seconds
            capacity: 10, // Bucket capacity of 10 tokens
        }),
    ],
});

export default aj;