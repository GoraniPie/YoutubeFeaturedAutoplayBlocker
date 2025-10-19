// cross-browser storage get wrapper (Promise-based)
async function getEnabledSetting() {
    if (globalThis.chrome?.storage?.local?.get) {
        return await new Promise((resolve) => {
            chrome.storage.local.get('enabled', (res) => resolve(res || {}));
        });
    }
    if (globalThis.browser?.storage?.local?.get) {
        return await browser.storage.local.get('enabled');
    }
    return {};
}

(async () => {
    const data = await getEnabledSetting();
    if (data.enabled === false) {
        return;
    }

    function findFeaturedVideoElement() {
        return document.querySelector(
            'ytd-channel-video-player-renderer video.html5-main-video,' +
            'ytd-channel-featured-content-renderer video.html5-main-video'
        );
    }

    function pauseFeaturedVideoIfPlaying() {
        const video = findFeaturedVideoElement();
        if (!video || video.paused || video.readyState < 2) return;
        const apiTarget = document.querySelector('ytd-channel-video-player-renderer #movie_player') || document.getElementById('movie_player');
        const ytPlayer = document.querySelector('ytd-player')?.getPlayer?.();
        video.pause();
        apiTarget?.pauseVideo?.();
        ytPlayer?.pauseVideo?.();
        
        console.log("YT featured video autopaused.");
    }



    function scheduleChecks() {
        let pauseInterval = setInterval(pauseFeaturedVideoIfPlaying, 50);
        setTimeout(() => clearInterval(pauseInterval), 1500);
    }

    // SPA navigation hooks to catch in-page navigations on YouTube
    document.addEventListener('yt-navigate-finish', scheduleChecks, true);
    document.addEventListener('yt-page-data-updated', scheduleChecks, true);

    scheduleChecks();
})();