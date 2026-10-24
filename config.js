// Configuration for Sylos landing page
const CONFIG = {
    links: {
        // organization page: entry point for repos, releases context, and contributing
        github: "https://github.com/Project-Sylos",
        // Help widget links (from Sylos-UI HelpModalContext)
        wiki: "https://github.com/Project-Sylos/Sylos/wiki",
        issues: "https://github.com/Project-Sylos/Sylos/issues",
        discussions: "https://github.com/orgs/Project-Sylos/discussions",
        blog: "blog/index.html",
    },
    /*
     * Connector brand logos — single source of truth in Sylos-UI.
     * Served via jsDelivr (CDN-cached) so this site does not copy the files.
     * Pin `ref` to a tag/commit later if you want stricter reproducibility than @main.
     */
    externalIcons: {
        base: "https://cdn.jsdelivr.net/gh/Project-Sylos/Sylos-UI@main/src/assets/external/",
        files: {
            "google-drive": "Google_Drive_Logo.svg",
            dropbox: "dropbox-1-logo-png-transparent.png",
            onedrive: "onedrive.webp",
            sharepoint: "sharepoint.svg",
            box: "BOX.svg",
        },
    },
};
