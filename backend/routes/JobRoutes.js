require("dotenv").config(); // to process env variables
const express = require("express")
const router = express.Router();
const { getJobs, getJobById, createJob, extractJob, updateJobStatus, deleteJob, deleteJobs,
    checkJobDuplicate
} = require("../controllers/jobController")
const protect = require("../middlewares/authMiddleware");

//update status of job
router.patch("/jobs/:id/status", protect, updateJobStatus)

//GET --> retrive saved jobs
router.get("/jobs", protect, getJobs)

// Check whether a job is already tracked
router.post("/jobs/check-duplicate", protect, checkJobDuplicate);

//GET --> to retrive a single job by ID
router.get("/jobs/:id", protect, getJobById)

//deletes job with id
router.delete("/jobs/:id", protect, deleteJob);

//deletes multiple jobs
router.delete("/jobs", protect, deleteJobs);

// Job routes to post 
router.post("/jobs", protect, createJob);

// Extract Job
router.post("/jobs/extract", protect, extractJob);


module.exports = router;