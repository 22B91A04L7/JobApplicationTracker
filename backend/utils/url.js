function normalizeJobUrl(url) {
    try {
        const parsedUrl = new URL(url);

        // Remove the fragment because it usually identifies
        // a section of the same page rather than a different job.
        parsedUrl.hash = "";

        // Remove a trailing slash from the pathname,
        // except when the pathname is just "/".
        if (parsedUrl.pathname.length > 1) {
            parsedUrl.pathname = parsedUrl.pathname.replace(/\/+$/, "");
        }

        return parsedUrl.toString();
    } catch {
        return url;
    }
}

module.exports = {
    normalizeJobUrl
};