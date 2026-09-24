require("dotenv").config(); // to process env variables
const express = require("express");
const app = express();
const cors = require("cors");

const mongoose = require("mongoose");
const jobRoutes = require("./routes/JobRoutes")
const authRoutes = require("./routes/authRoutes")


// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use("/api", jobRoutes);
app.use("/api/auth", authRoutes);

// Root route
app.get("/", (req, res) => {
    res.send("Job Tracker Backend is running");
});


//mongodb connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MONGO DB connected!");
        // Start server
        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`SERVER running on PORT ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    })

