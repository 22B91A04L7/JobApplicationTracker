require("dotenv").config(); // to process env variables
const express = require("express")
const router = express.Router();
const { getJobs, getJobById, createJob, extractJob, updateJobStatus } = require("../controllers/jobController")
const protect = require("../middlewares/authMiddleware");

//update status of job
router.patch("/jobs/:id/status", protect, updateJobStatus)

//GET --> retrive saved jobs
router.get("/jobs", protect, getJobs)

//GET --> to retrive a single job by ID
router.get("/jobs/:id", protect, getJobById)

// Job routes to post 
router.post("/jobs", protect, createJob);

// Extract Job
router.post("/jobs/extract", protect, extractJob);


module.exports = router;