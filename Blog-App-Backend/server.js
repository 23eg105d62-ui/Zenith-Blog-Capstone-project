import exp from "express";
import { connect } from "mongoose";
import { config } from "dotenv";
import { userRoute } from "./APIs/UserApi.js";
import cookieParser from "cookie-parser";
import { adminRoute } from "./APIs/AdminApi.js";
import { authorRoute } from "./APIs/AuthorApi.js";
import { commonRouter } from "./APIs/CommonApi.js";
import cors from "cors";

config(); //process.env

//Create express application
const app = exp();
//use cors middleware
const allowedOrigins = new Set([
    "http://localhost:5173",
    "http://localhost:5174",
]);
const DEFAULT_FRONTEND_URL = "https://zenith-blog-capstone-project.vercel.app";

// Normalize origins so trailing slashes don't break strict matching
// e.g. "https://example.com/" -> "https://example.com"
const normalizeOrigin = (value) => {
    if (typeof value !== "string") return value;
    return value.replace(/\/+$/, "");
};

const frontendUrls = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(",").map((url) => url.trim()).filter(Boolean)
    : [DEFAULT_FRONTEND_URL];

frontendUrls.forEach((url) => allowedOrigins.add(normalizeOrigin(url)));
// also normalize the static ones just in case
["http://localhost:5173", "http://localhost:5174"].forEach((url) => allowedOrigins.add(normalizeOrigin(url)));

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) {
            callback(null, true);
            return;
        }

        const normalizedRequestOrigin = normalizeOrigin(origin);
        if (
            allowedOrigins.has(normalizedRequestOrigin) ||
            (normalizedRequestOrigin.includes("zenith-blog-capstone") && normalizedRequestOrigin.endsWith(".vercel.app"))
        ) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
//add body parser middleware
app.use(exp.json());
//add cookie parser middleware
app.use(cookieParser());

//connect APIs
app.use("/user-api", userRoute);
app.use("/author-api", authorRoute);
app.use("/admin-api", adminRoute);
app.use("/common-api", commonRouter);

//connect to db
const connectDB = async () => {
    try {
        await connect(process.env.DB_URL);
        console.log("DB connection success");

        //start http server
        app.listen(process.env.PORT, () => console.log(`server started on port ${process.env.PORT}`));
    } catch (err) {
        console.log("Err in DB connection", err);
    }
};

connectDB();




// Error handling middleware
const isProduction = process.env.NODE_ENV === "production";

app.use((err, req, res, next) => {
    const status = err.status || err.statusCode || 500;
    let message = err.message || "Internal Server Error";
    let details;

    // Mongoose validation errors
    if (err.name === "ValidationError") {
        message = "Validation error";
        details = Object.values(err.errors || {}).map((e) => e.message);
    }

    // Mongoose cast errors (e.g. invalid ObjectId)
    if (err.name === "CastError") {
        message = "Invalid value for field";
        details = [`${err.path} is invalid`];
    }

    // Duplicate key errors
    if (err.code === 11000) {
        message = "Duplicate value";
        const fields = Object.keys(err.keyValue || {});
        details = fields.length ? fields.map((f) => `${f} already exists`) : undefined;
    }

    // Strict mode "throw" errors from schema
    if (err.name === "StrictModeError") {
        message = "Invalid fields provided";
        details = err.path ? [`${err.path} is not allowed`] : undefined;
    }

    // Default to 400 for known client errors without explicit status
    const finalStatus = status === 500 && (err.name || err.code) ? 400 : status;

    const response = {
        message,
        status: finalStatus,
    };

    if (details) response.details = details;
    if (!isProduction) {
        response.stack = err.stack;
    }

    console.log("err :", err);
    res.status(finalStatus).json(response);
});