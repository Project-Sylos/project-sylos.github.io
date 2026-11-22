(function () {
    var STORAGE_KEY = "sylos.theme";
    var COOKIE_NAME = "sylos_theme";
    var DEFAULT_THEME = "obsidian";
    var THEMES = { obsidian: true, quartz: true };

    function pathPrefix() {
        var path = location.pathname || "";
        return path.indexOf("/blog/") !== -1 || /\/blog\/?$/.test(path) ? "../" : "";
    }

    function normalizeTheme(value) {
        if (value == null) {
            return DEFAULT_THEME;
        }
        value = String(value).trim();
        return THEMES[value] ? value : DEFAULT_THEME;
    }

    function readCookieTheme() {
        try {
            var parts = String(document.cookie || "").split(";");
            for (var i = 0; i < parts.length; i++) {
                var part = parts[i].trim();
                if (part.indexOf(COOKIE_NAME + "=") === 0) {
                    return normalizeTheme(decodeURIComponent(part.slice(COOKIE_NAME.length + 1)));
                }
            }
        } catch (e) {
            /* ignore */
        }
        return null;
    }

    function writeCookieTheme(theme) {
        try {
            document.cookie =
                COOKIE_NAME +
                "=" +
                encodeURIComponent(theme) +
                "; path=/; max-age=31536000; SameSite=Lax";
        } catch (e) {
            /* ignore */
        }
    }

    function readStoredTheme() {
        try {
            var fromLs = localStorage.getItem(STORAGE_KEY);
            if (fromLs != null && String(fromLs).trim() !== "") {
                return normalizeTheme(fromLs);
            }
        } catch (e) {
            /* ignore quota / private mode */
        }
        var fromCookie = readCookieTheme();
        if (fromCookie) {
            return fromCookie;
        }
        return DEFAULT_THEME;
    }

    function writeStoredTheme(theme) {
        theme = normalizeTheme(theme);
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch (e) {
            /* ignore quota / private mode */
        }
        writeCookieTheme(theme);
    }

    function logoSrcForTheme(theme) {
        var prefix = pathPrefix();
        var file =
            theme === "quartz"
                ? "assets/logos/sylos-wordmark-quartz.png"
                : "assets/logos/sylos-wordmark-obsidian.png";
        return prefix + file;
    }

    function applyLogos(theme) {
        var src = logoSrcForTheme(theme);
        document.querySelectorAll("[data-sylos-logo]").forEach(function (img) {
            img.src = src;
        });
    }

    function screenshotSrcForTheme(base, theme) {
        var suffix = theme === "quartz" ? "_light" : "_dark";
        var match = base.match(/^(.*)(\.[a-zA-Z0-9]+)$/);
        if (!match) {
            return base + suffix + ".png";
        }
        return match[1] + suffix + match[2];
    }

    function applyThemeScreenshots(theme) {
        document.querySelectorAll("[data-theme-screenshot]").forEach(function (img) {
            var base = img.getAttribute("data-theme-screenshot");
            if (!base) {
                return;
            }
            var nextSrc = screenshotSrcForTheme(base, theme);
            if (img.getAttribute("src") === nextSrc) {
                return;
            }

            // While light assets are still being added, fall back to dark on 404.
            if (theme === "quartz") {
                var darkSrc = screenshotSrcForTheme(base, "obsidian");
                var probe = new Image();
                probe.onload = function () {
                    img.src = nextSrc;
                };
                probe.onerror = function () {
                    img.src = darkSrc;
                };
                probe.src = nextSrc;
            } else {
                img.src = nextSrc;
            }
        });
    }

    function updateToggleLabels(theme) {
        var nextLabel = theme === "quartz" ? "Dark" : "Light";
        var nextFull = theme === "quartz" ? "Switch to dark theme" : "Switch to light theme";

        document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
            btn.setAttribute("aria-label", nextFull);
            btn.setAttribute("title", nextFull);
            btn.setAttribute("aria-pressed", theme === "quartz" ? "true" : "false");

            var label = btn.querySelector("[data-theme-toggle-label]");
            if (label) {
                label.textContent = nextLabel;
            }

            var icon = btn.querySelector("[data-theme-toggle-icon]");
            if (icon) {
                icon.textContent = theme === "quartz" ? "☾" : "☀";
            }
        });
    }

    function applyTheme(theme, persist) {
        theme = normalizeTheme(theme);
        document.documentElement.setAttribute("data-theme", theme);
        applyLogos(theme);
        applyThemeScreenshots(theme);
        updateToggleLabels(theme);
        if (persist !== false) {
            writeStoredTheme(theme);
        }
        return theme;
    }

    function getTheme() {
        return normalizeTheme(document.documentElement.getAttribute("data-theme"));
    }

    function setTheme(theme) {
        return applyTheme(theme, true);
    }

    function toggleTheme() {
        return setTheme(getTheme() === "quartz" ? "obsidian" : "quartz");
    }

    // Apply before paint when this script runs in <head>
    applyTheme(readStoredTheme(), false);

    // Back/forward cache and same-tab navigations can restore a stale attribute.
    window.addEventListener("pageshow", function () {
        applyTheme(readStoredTheme(), false);
    });

    window.SylosTheme = {
        get: getTheme,
        set: setTheme,
        toggle: toggleTheme,
        logoSrc: logoSrcForTheme,
        applyLogos: applyLogos,
        refreshControls: function () {
            updateToggleLabels(getTheme());
            applyLogos(getTheme());
            applyThemeScreenshots(getTheme());
        },
    };

    document.addEventListener("click", function (event) {
        var toggle = event.target.closest("[data-theme-toggle]");
        if (!toggle) {
            return;
        }
        event.preventDefault();
        toggleTheme();
    });

    document.addEventListener("DOMContentLoaded", function () {
        applyTheme(readStoredTheme(), false);
        window.SylosTheme.refreshControls();
    });
})();
