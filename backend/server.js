require("dotenv").config(); // to process env variables
const express = require("express");
const app = express();

const mongoose = require("mongoose");
const jobRoutes = require("./routes/JobRoutes")


// Middleware
app.use(express.json());

// API routes
app.use("/", jobRoutes);

// Root route
app.get("/", (req, res) => {
    res.send("Job Tracker Backend is running");
});

//mongodb connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MONGO DB connected!");
        // Start server
        app.listen(5000, () => {
            console.log("SERVER running on PORT 5000");
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    })

