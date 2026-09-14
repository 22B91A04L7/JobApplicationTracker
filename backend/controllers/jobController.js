const mongoose = require("mongoose");
const Job = require("../models/Job")
const { extractJobData } = require("../services/aiService");

//controller to fetch all jobs
async function getJobs(req, res) {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 })
        res.status(200).json({
            jobs: jobs
        })
    } catch (error) {
        console.error("Fetch jobs error:", error);
        res.status(500).json({
            error: "Failed to fetch job applications"
        });
    }
}

//controller to fetch individual job using id
async function getJobById(req, res) {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                error: "Invalid job ID format"
            });
        }
        const job = await Job.findById(id);
        if (!job) {
            return res.status(404).json({
                error: "Job application not found"
            })
        }
        res.status(200).json({
            job: job
        });
    } catch (error) {
        console.error("Fetch single job error:", error);

        res.status(500).json({
            error: "Failed to fetch job application"
        });
    }
}

//controller to add a new job to db
async function createJob(req, res) {
    try {
        const {
            title,
            company,
            jobId,
            location,
            salary,
            description,
            url,
            source
        } = req.body;

        if (!title || !company || !url || !source) {
            return res.status(400).json({
                error: "title, company, url, and source are required"
            });
        }

        const appliedAt = new Date();

        const job = await Job.create({
            userId: "local-user",

            title,
            company,
            jobId: jobId || null,
            location: location || null,
            salary: salary || null,
            description: description || null,

            url,
            source,

            status: "Applied",
            appliedAt,

            timeline: [
                {
                    status: "Applied",
                    timestamp: appliedAt
                }
            ]
        });

        res.status(201).json({
            message: "Job application saved",
            job
        });

    } catch (error) {
        console.error("Save job error:", error);

        res.status(500).json({
            error: "Failed to save job application"
        });
    }
}

//controller to extract job info
async function extractJob(req, res) {
    try {
        const { pageText } = req.body;
        const jobData = await extractJobData(pageText);
        res.json({
            jobData: jobData
        });

    } catch (error) {
        console.error("Job extraction error:", error);

        res.status(500).json({
            error: "Failed to extract job information"
        });
    }
}

//controller to update status of job application
async function updateJobStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                error: "Invalid job ID format"
            });
        }
        const allowedStatuses = [
            "Applied",
            "Assessment",
            "Interview",
            "Selected",
            "Rejected",
            "Offer Received"
        ];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                error: "Invalid status"
            });
        }
        const job = await Job.findById(id);
        if (!job) {
            return res.status(404).json({
                error: "Job application not found"
            });
        }
        job.status = status;
        job.timeline.push({
            status,
            timestamp: new Date()
        });
        await job.save();
        res.status(200).json({
            message: "Job status updated successfully",
            job
        });
    } catch (error) {
        console.error("Update job status error:", error);

        res.status(500).json({
            error: "Failed to update job status"
        });
    }
}

module.exports = {
    getJobs,
    getJobById,
    createJob,
    extractJob,
    updateJobStatus
};