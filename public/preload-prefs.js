(() => {
    try {
        const mobileLite =
            (typeof window.matchMedia === 'function' && window.matchMedia('(max-width: 768px)').matches)
            || navigator.connection?.saveData === true;
        if (mobileLite) {
            document.documentElement.classList.add('mobile-lite', 'skip-intro');
        }

        const raw = localStorage.getItem('sao_prefs');
        if (!raw) return;

        const prefs = JSON.parse(raw);
        if (prefs?.anim === false) document.documentElement.classList.add('no-anim');
        if (prefs?.skipIntro === true) document.documentElement.classList.add('skip-intro');
    } catch {
        return;
    }
})();
