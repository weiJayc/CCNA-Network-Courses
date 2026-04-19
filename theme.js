/* Shared light/dark mode toggle (session-scoped persistence, default light). */

(function () {
    const STORAGE_KEY = 'ccna-theme';

    function readStoredTheme() {
        try {
            const t = sessionStorage.getItem(STORAGE_KEY);
            return t === 'dark' || t === 'light' ? t : null;
        } catch (e) {
            return null;
        }
    }

    function writeStoredTheme(theme) {
        try {
            sessionStorage.setItem(STORAGE_KEY, theme);
        } catch (e) {
            // Ignore storage errors.
        }
    }

    function getTheme() {
        const stored = readStoredTheme();
        if (stored) return stored;
        return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
    }

    function setTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.dataset.theme = 'dark';
        } else {
            delete document.documentElement.dataset.theme;
        }

        writeStoredTheme(theme);
    }

    function ensureButton() {
        if (document.querySelector('.theme-toggle')) return;

        const labels = {
            toDark: 'Dark',
            toLight: 'Light',
            toggleAria: 'Toggle theme',
        };

        const wrap = document.createElement('div');
        wrap.className = 'theme-toggle-wrap';

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'theme-toggle';
        button.setAttribute('aria-label', labels.toggleAria);

        function updateLabel() {
            const current = getTheme();
            const next = current === 'dark' ? 'light' : 'dark';
            button.textContent = next === 'dark' ? labels.toDark : labels.toLight;
            button.setAttribute('aria-pressed', String(current === 'dark'));
        }

        button.addEventListener('click', function () {
            const next = getTheme() === 'dark' ? 'light' : 'dark';
            setTheme(next);
            updateLabel();
        });

        // Sync from stored theme (default: light) and set initial label.
        const initial = getTheme();
        if (initial === 'dark') document.documentElement.dataset.theme = 'dark';
        else delete document.documentElement.dataset.theme;

        updateLabel();
        wrap.appendChild(button);
        document.body.prepend(wrap);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', ensureButton);
    } else {
        ensureButton();
    }
})();
