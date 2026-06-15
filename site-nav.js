(function () {
    function pathPrefix() {
        return location.pathname.includes("/blog/") ? "../" : "";
    }

    function injectDrawer() {
        if (document.getElementById("site-drawer")) {
            return;
        }

        var prefix = pathPrefix();
        var isBlog = prefix === "../";
        var homeHref = prefix + "index.html";
        var blogHref = isBlog ? "index.html" : "blog/index.html";
        var logoSrc = prefix + "assets/logos/main-app-logo-transparent.png";

        var root = document.createElement("div");
        root.innerHTML =
            '<button type="button" class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="site-drawer" aria-label="Open navigation">' +
            '  <span class="nav-toggle-bar" aria-hidden="true"></span>' +
            '  <span class="nav-toggle-bar" aria-hidden="true"></span>' +
            '  <span class="nav-toggle-bar" aria-hidden="true"></span>' +
            "</button>" +
            '<div class="nav-overlay" id="nav-overlay" hidden></div>' +
            '<aside id="site-drawer" class="site-drawer" aria-hidden="true">' +
            '  <div class="site-drawer-panel">' +
            '    <div class="site-drawer-header">' +
            '      <a href="' + homeHref + '" class="site-drawer-logo" aria-label="Home" title="Home">' +
            '        <img src="' + logoSrc + '" alt="Sylos">' +
            "      </a>" +
            '      <button type="button" class="site-drawer-close" id="nav-close" aria-label="Close navigation">&times;</button>' +
            "    </div>" +
            '    <nav class="site-drawer-nav" aria-label="Site">' +
            '      <a href="" data-link="codeberg" target="_blank" rel="noopener noreferrer" class="site-drawer-link">Source code</a>' +
            '      <a href="' + homeHref + '#community" class="site-drawer-link">Community</a>' +
            '      <a href="' + blogHref + '" class="site-drawer-link">Blog</a>' +
            "    </nav>" +
            "  </div>" +
            "</aside>";

        while (root.firstChild) {
            document.body.insertBefore(root.firstChild, document.body.firstChild);
        }
    }

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

    function initDrawer() {
        var toggle = document.getElementById("nav-toggle");
        var closeBtn = document.getElementById("nav-close");
        var drawer = document.getElementById("site-drawer");
        var overlay = document.getElementById("nav-overlay");

        if (!toggle || !drawer || !overlay) {
            return;
        }

        function setOpen(open) {
            toggle.setAttribute("aria-expanded", open ? "true" : "false");
            toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
            drawer.classList.toggle("is-open", open);
            drawer.setAttribute("aria-hidden", open ? "false" : "true");
            document.body.classList.toggle("nav-drawer-open", open);
            overlay.hidden = !open;
        }

        function openDrawer() {
            setOpen(true);
        }

        function closeDrawer() {
            setOpen(false);
        }

        toggle.addEventListener("click", function () {
            if (drawer.classList.contains("is-open")) {
                closeDrawer();
            } else {
                openDrawer();
            }
        });

        closeBtn.addEventListener("click", closeDrawer);
        overlay.addEventListener("click", closeDrawer);

        drawer.querySelectorAll(".site-drawer-link, .site-drawer-logo").forEach(function (link) {
            link.addEventListener("click", closeDrawer);
        });

        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && drawer.classList.contains("is-open")) {
                closeDrawer();
            }
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        injectDrawer();
        populateConfigLinks();
        initDrawer();
    });
})();
