const mongoose = require("mongoose");

const timelineEventSchema = new mongoose.Schema({
    status: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    },
},
    {
        _id: false
    });


const jobSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        company: {
            type: String,
            required: true,
            trim: true
        },

        jobId: {
            type: String,
            default: null
        },

        location: {
            type: String,
            default: null
        },

        salary: {
            type: String,
            default: null
        },

        description: {
            type: String,
            default: null
        },

        url: {
            type: String,
            required: true
        },

        source: {
            type: String,
            required: true
        },

        status: {
            type: String,
            required: true,
            enum: ["Applied"],
            default: "Applied"
        },

        appliedAt: {
            type: Date,
            required: true
        },

        timeline: {
            type: [timelineEventSchema],
            required: true,
            default: []
        }
    },

    {
        timestamps: true
    }
);

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;