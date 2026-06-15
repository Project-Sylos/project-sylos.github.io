(function () {
    function populateConfigLinks() {
        if (typeof CONFIG === "undefined" || !CONFIG.links) {
            return;
        }
        document.querySelectorAll("[data-link]").forEach(function (element) {
            var linkKey = element.getAttribute("data-link");
            if (CONFIG.links[linkKey]) {
                element.href = CONFIG.links[linkKey];
            }
        });
    }

    document.addEventListener("DOMContentLoaded", populateConfigLinks);
})();
