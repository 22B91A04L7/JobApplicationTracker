require("dotenv").config(); // to process env variables
const express = require("express")
const router = express.Router();
const { getJobs, getJobById, createJob, extractJob, updateJobStatus } = require("../controllers/jobController")

//update status of job
router.patch("/api/jobs/:id/status", updateJobStatus)

//GET --> retrive saved jobs
router.get("/api/jobs", getJobs)

//GET --> to retrive a single job by ID
router.get("/api/jobs/:id", getJobById)

// Job routes to post 
router.post("/api/jobs", createJob);

// Extract Job
router.post("/api/jobs/extract", extractJob);


module.exports = router;