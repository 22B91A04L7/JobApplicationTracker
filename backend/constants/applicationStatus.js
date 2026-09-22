const APPLICATION_STATUSES = [
    "Applied",
    "Assessment",
    "Interview",
    "Offer Received",
    "Selected",
    "Rejected"
];

const STATUS_TRANSITIONS = {
    Applied: [
        "Assessment",
        "Interview",
        "Rejected"
    ],

    Assessment: [
        "Interview",
        "Rejected"
    ],

    Interview: [
        "Offer Received",
        "Selected",
        "Rejected"
    ],

    "Offer Received": [
        "Selected",
        "Rejected"
    ],

    Selected: [],

    Rejected: []
};

module.exports = {
    APPLICATION_STATUSES,
    STATUS_TRANSITIONS
};