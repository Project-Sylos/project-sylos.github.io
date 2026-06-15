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

    function initPinnedHeader() {
        var header = document.getElementById("site-header");
        if (!header) {
            return;
        }

        var hero = document.querySelector(".hero");
        if (!hero) {
            header.classList.add("is-pinned");
            return;
        }

        function updateHeader() {
            var threshold = Math.max(hero.offsetHeight - 48, 120);
            header.classList.toggle("is-pinned", window.scrollY > threshold);
        }

        window.addEventListener("scroll", updateHeader, { passive: true });
        window.addEventListener("resize", updateHeader);
        updateHeader();
    }

    document.addEventListener("DOMContentLoaded", function () {
        populateConfigLinks();
        initPinnedHeader();
    });
})();
