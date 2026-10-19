
(() => {
    const audio = document.getElementById("playerAudio");
    if (!audio) return;

    const tracks = [
        {
            title: "F L Y",
            artist: "SPECTRUM",
            file: "music/F L Y.mp3",
            cover: "music/F L Y.jpg"
        },
        {
            title: "FANTASY",
            artist: "MINAMI'S SOUNDTRACK",
            file: "music/FANTASY.mp3",
            cover: "music/FANTASY.jpg"
        },
        {
            title: "I CAN'T STOP THE LONELINESS",
            artist: "MINAMI'S SOUNDTRACK",
            file: "music/I CAN'T STOP THE LONELINESS.mp3",
            cover: "music/I CAN'T STOP THE LONELINESS.jpg"
        },
        {
            title: "Mayonaka no Door",
            artist: "MINAMI'S SOUNDTRACK",
            file: "music/Mayonaka no Door.mp3",
            cover: "music/Mayonaka no Door.jpg"
        }
    ];

    const cover = document.getElementById("playerCover");
    const title = document.getElementById("playerTitle");
    const artist = document.getElementById("playerArtist");
    const trackNumber = document.getElementById("playerTrackNumber");
    const seek = document.getElementById("playerSeek");
    const currentTime = document.getElementById("playerCurrentTime");
    const duration = document.getElementById("playerDuration");
    const playButton = document.getElementById("playerPlay");
    const previousButton = document.getElementById("playerPrevious");
    const nextButton = document.getElementById("playerNext");
    const shuffleButton = document.getElementById("playerShuffle");
    const repeatButton = document.getElementById("playerRepeat");
    const status = document.getElementById("playerStatus");

    let currentTrack = 0;
    let shuffle = false;
    let repeat = false;

    function formatTime(seconds) {
        if (!Number.isFinite(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${String(secs).padStart(2, "0")}`;
    }

    function loadTrack(index, autoplay = false) {
        currentTrack = (index + tracks.length) % tracks.length;
        const track = tracks[currentTrack];

        audio.pause();
        audio.src = track.file;
        cover.src = track.cover;
        cover.alt = `Album cover for ${track.title}`;
        title.textContent = track.title;
        artist.textContent = track.artist;
        trackNumber.textContent =
            `TRACK ${String(currentTrack + 1).padStart(2, "0")} / ${String(tracks.length).padStart(2, "0")}`;

        seek.value = 0;
        currentTime.textContent = "0:00";
        duration.textContent = "0:00";
        playButton.textContent = "▶";
        playButton.setAttribute("aria-label", "Play music");
        status.textContent = "ready when you are ♡";

        audio.load();

        if (autoplay) {
            audio.play().catch(() => {
                status.textContent = "press play to start the music ♡";
            });
        }
    }

    function playTrack() {
        if (audio.paused) {
            audio.play().then(() => {
                status.textContent = "now playing ♫";
            }).catch(() => {
                status.textContent = "couldn't play this file — check its filename";
            });
        } else {
            audio.pause();
        }
    }

    function nextTrack() {
        if (shuffle && tracks.length > 1) {
            let next;
            do {
                next = Math.floor(Math.random() * tracks.length);
            } while (next === currentTrack);

            loadTrack(next, true);
        } else {
            loadTrack(currentTrack + 1, true);
        }
    }

    function previousTrack() {
        if (audio.currentTime > 3) {
            audio.currentTime = 0;
        } else {
            loadTrack(currentTrack - 1, true);
        }
    }

    playButton.addEventListener("click", playTrack);
    nextButton.addEventListener("click", nextTrack);
    previousButton.addEventListener("click", previousTrack);

    audio.addEventListener("play", () => {
        playButton.textContent = "Ⅱ";
        playButton.setAttribute("aria-label", "Pause music");
        status.textContent = "now playing ♫";
    });

    audio.addEventListener("pause", () => {
        playButton.textContent = "▶";
        playButton.setAttribute("aria-label", "Play music");
    });

    audio.addEventListener("loadedmetadata", () => {
        duration.textContent = formatTime(audio.duration);
    });

    audio.addEventListener("timeupdate", () => {
        currentTime.textContent = formatTime(audio.currentTime);

        if (Number.isFinite(audio.duration) && audio.duration > 0) {
            seek.value = String(
                Math.round((audio.currentTime / audio.duration) * 1000)
            );
        }
    });

    seek.addEventListener("input", () => {
        if (Number.isFinite(audio.duration) && audio.duration > 0) {
            audio.currentTime = (Number(seek.value) / 1000) * audio.duration;
        }
    });

    audio.addEventListener("ended", () => {
        if (!repeat) nextTrack();
    });

    audio.addEventListener("error", () => {
        status.textContent = "audio couldn't load — check the music folder and filenames";
    });

    shuffleButton.addEventListener("click", () => {
        shuffle = !shuffle;
        shuffleButton.classList.toggle("is-active", shuffle);
        shuffleButton.setAttribute("aria-pressed", String(shuffle));
        status.textContent = shuffle ? "shuffle is on ✧" : "shuffle is off";
    });

    repeatButton.addEventListener("click", () => {
        repeat = !repeat;
        audio.loop = repeat;
        repeatButton.classList.toggle("is-active", repeat);
        repeatButton.setAttribute("aria-pressed", String(repeat));
        status.textContent = repeat ? "repeat is on ↻" : "repeat is off";
    });

    cover.addEventListener("error", () => {
        status.textContent = "cover not found — check the image filename";
    });

    loadTrack(0);
})();
