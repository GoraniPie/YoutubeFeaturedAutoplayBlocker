browser.storage.local.get("enabled").then((data) => {
    if (data.enabled === false) {
        return;
    }

    let alreadyPaused = false;

    function isChannelHome() {
        return /^\/(@|c\/|user\/)[^/]+(\/featured)?$/.test(location.pathname);
    }

    function pauseFeaturedVideoIfPlaying(retry = 0) {
        if (!isChannelHome()) return;

        const video = document.querySelector('.html5-video-container video.html5-main-video');

        if (!video) {
            if (retry < 10) setTimeout(() => pauseFeaturedVideoIfPlaying(retry + 1), 500);
            return;
        }

        if (
            !alreadyPaused &&
            !video.paused &&
            video.readyState >= 2
        ) {
            video.pause();
            alreadyPaused = true;
            console.log("YT featured video autopaused.");
        } else if (!alreadyPaused && retry < 10) {
            setTimeout(() => pauseFeaturedVideoIfPlaying(retry + 1), 500);
        }
    }



    let lastPath = location.pathname;
    setInterval(() => {
        if (location.pathname !== lastPath) {
            lastPath = location.pathname;
            alreadyPaused = false;
            pauseFeaturedVideoIfPlaying();
        }
    }, 500);

    const observer = new MutationObserver(() => {
    	pauseFeaturedVideoIfPlaying();
    });
    observer.observe(document.body, { childList: true, subtree: true });

pauseFeaturedVideoIfPlaying();
});