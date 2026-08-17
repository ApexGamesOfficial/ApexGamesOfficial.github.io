/* =========================================
   PLAY PULSE v.01
   MAIN JAVASCRIPT
   ========================================= */


/* =========================================
   STORAGE
   ========================================= */

function getStoredArray(key) {

    try {

        const data =
            localStorage.getItem(key);

        return data
            ? JSON.parse(data)
            : [];

    } catch (error) {

        console.warn(
            `Play Pulse: Could not read ${key}`,
            error
        );

        return [];

    }

}


function saveStoredArray(key, array) {

    try {

        localStorage.setItem(
            key,
            JSON.stringify(array)
        );

    } catch (error) {

        console.warn(
            `Play Pulse: Could not save ${key}`,
            error
        );

    }

}


/* =========================================
   SETTINGS STORAGE
   ========================================= */

function getSetting(key, fallback) {

    const value =
        localStorage.getItem(key);

    if (value === null) {
        return fallback;
    }

    return value;

}


function saveSetting(key, value) {

    localStorage.setItem(
        key,
        value
    );

}


/* =========================================
   SOUND
   ========================================= */

let soundEnabled =
    getSetting(
        "playPulseSound",
        "on"
    ) !== "off";


const soundControl =
    document.getElementById(
        "soundControl"
    );

const soundIcon =
    document.getElementById(
        "soundIcon"
    );

const soundText =
    document.getElementById(
        "soundText"
    );


function updateSoundButton() {

    if (!soundControl) return;


    if (soundEnabled) {

        if (soundIcon) {
            soundIcon.textContent = "🔊";
        }

        if (soundText) {
            soundText.textContent = "Sound On";
        }

    } else {

        if (soundIcon) {
            soundIcon.textContent = "🔇";
        }

        if (soundText) {
            soundText.textContent = "Sound Off";
        }

    }

}


function setSoundEnabled(enabled) {

    soundEnabled = enabled;

    saveSetting(
        "playPulseSound",
        enabled ? "on" : "off"
    );

    updateSoundButton();

}


if (soundControl) {

    soundControl.addEventListener(
        "click",
        () => {

            setSoundEnabled(
                !soundEnabled
            );

        }
    );

}


updateSoundButton();


/* =========================================
   THEME
   ========================================= */

function applyTheme(theme) {

    document.documentElement
        .setAttribute(
            "data-theme",
            theme
        );


    if (theme === "light") {

        document.body.classList.add(
            "light-theme"
        );

    } else {

        document.body.classList.remove(
            "light-theme"
        );

    }

}


function initializeTheme() {

    const themeSelect =
        document.getElementById(
            "themeSetting"
        );


    const savedTheme =
        getSetting(
            "playPulseTheme",
            "dark"
        );


    applyTheme(
        savedTheme
    );


    if (!themeSelect) return;


    themeSelect.value =
        savedTheme;


    themeSelect.addEventListener(
        "change",
        () => {

            const theme =
                themeSelect.value;

            saveSetting(
                "playPulseTheme",
                theme
            );

            applyTheme(
                theme
            );

        }
    );

}


initializeTheme();


/* =========================================
   GAME ANIMATIONS
   ========================================= */

function applyAnimations(enabled) {

    document.body.classList.toggle(
        "animations-disabled",
        !enabled
    );

}


function initializeAnimations() {

    const control =
        document.getElementById(
            "animationsSetting"
        );


    const saved =
        getSetting(
            "playPulseAnimations",
            "on"
        ) !== "off";


    applyAnimations(
        saved
    );


    if (!control) return;


    control.checked =
        saved;


    control.addEventListener(
        "change",
        () => {

            const enabled =
                control.checked;

            saveSetting(
                "playPulseAnimations",
                enabled
                    ? "on"
                    : "off"
            );

            applyAnimations(
                enabled
            );

        }
    );

}


initializeAnimations();


/* =========================================
   INTERFACE SOUNDS
   ========================================= */

function initializeInterfaceSounds() {

    const control =
        document.getElementById(
            "interfaceSoundsSetting"
        );


    const saved =
        getSetting(
            "playPulseSound",
            "on"
        ) !== "off";


    if (!control) return;


    control.checked =
        saved;


    control.addEventListener(
        "change",
        () => {

            setSoundEnabled(
                control.checked
            );

        }
    );

}


initializeInterfaceSounds();


/* =========================================
   AUTO FULLSCREEN
   ========================================= */

function initializeFullscreenSetting() {

    const control =
        document.getElementById(
            "fullscreenSetting"
        );


    const saved =
        getSetting(
            "playPulseFullscreen",
            "off"
        ) === "on";


    if (!control) return;


    control.checked =
        saved;


    control.addEventListener(
        "change",
        () => {

            saveSetting(
                "playPulseFullscreen",
                control.checked
                    ? "on"
                    : "off"
            );

        }
    );

}


initializeFullscreenSetting();


/* =========================================
   FAVORITES
   ========================================= */

function getFavorites() {

    return getStoredArray(
        "playPulseFavorites"
    );

}


function saveFavorites(favorites) {

    saveStoredArray(
        "playPulseFavorites",
        favorites
    );

}


function addFavorite(gameName) {

    if (!gameName) return;

    const favorites =
        getFavorites();


    if (!favorites.includes(gameName)) {

        favorites.push(
            gameName
        );

        saveFavorites(
            favorites
        );

    }

}


function removeFavorite(gameName) {

    if (!gameName) return;


    const favorites =
        getFavorites();


    const updated =
        favorites.filter(
            game =>
                game !== gameName
        );


    saveFavorites(
        updated
    );

}


function isFavorite(gameName) {

    return getFavorites().includes(
        gameName
    );

}


/* =========================================
   FAVORITE BUTTONS
   ========================================= */

function updateFavoriteButton(button) {

    if (!button) return;


    const gameName =
        button.dataset.favorite;


    if (!gameName) return;


    if (isFavorite(gameName)) {

        button.textContent = "♥";

        button.classList.add(
            "favorited"
        );

        button.setAttribute(
            "aria-pressed",
            "true"
        );

    } else {

        button.textContent = "♡";

        button.classList.remove(
            "favorited"
        );

        button.setAttribute(
            "aria-pressed",
            "false"
        );

    }

}


function initializeFavoriteButtons() {

    document
        .querySelectorAll(
            ".favorite-button"
        )
        .forEach(button => {

            updateFavoriteButton(
                button
            );


            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();
                    event.stopPropagation();


                    const gameName =
                        button.dataset.favorite;


                    if (!gameName) return;


                    if (
                        isFavorite(
                            gameName
                        )
                    ) {

                        removeFavorite(
                            gameName
                        );

                    } else {

                        addFavorite(
                            gameName
                        );

                    }


                    updateFavoriteButton(
                        button
                    );


                    button.classList.remove(
                        "favorite-pop"
                    );

                    void button.offsetWidth;

                    button.classList.add(
                        "favorite-pop"
                    );

                }
            );

        });

}


initializeFavoriteButtons();


/* =========================================
   RECENTLY PLAYED
   ========================================= */

function getRecentlyPlayed() {

    return getStoredArray(
        "playPulseRecent"
    );

}


function addRecentlyPlayed(gameName) {

    if (!gameName) return;


    let recent =
        getRecentlyPlayed();


    recent =
        recent.filter(
            game =>
                game !== gameName
        );


    recent.unshift(
        gameName
    );


    recent =
        recent.slice(0, 10);


    saveStoredArray(
        "playPulseRecent",
        recent
    );

}


/* =========================================
   GAME BUTTONS
   ========================================= */

document
    .querySelectorAll(
        "[data-game]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                if (
                    button.classList.contains(
                        "favorite-button"
                    )
                ) {
                    return;
                }


                const gameName =
                    button.dataset.game;


                if (!gameName) return;


                addRecentlyPlayed(
                    gameName
                );

            }
        );

    });


/* =========================================
   SEARCH FOUNDATION
   ========================================= */

function initializeGameSearch() {

    const searchInput =
        document.querySelector(
            "#gameSearch, .game-search"
        );


    if (!searchInput) return;


    const cards =
        document.querySelectorAll(
            ".game-card"
        );


    searchInput.addEventListener(
        "input",
        () => {

            const term =
                searchInput.value
                    .trim()
                    .toLowerCase();


            cards.forEach(card => {

                const text =
                    card.textContent
                        .toLowerCase();


                card.style.display =
                    text.includes(term)
                        ? ""
                        : "none";

            });

        }
    );

}


initializeGameSearch();


/* =========================================
   NAVIGATION
   ========================================= */

document
    .querySelectorAll(
        ".nav-item"
    )
    .forEach(item => {

        item.addEventListener(
            "click",
            () => {

                document.body.classList.add(
                    "page-changing"
                );


                setTimeout(
                    () => {

                        document.body.classList.remove(
                            "page-changing"
                        );

                    },
                    300
                );

            }
        );

    });


/* =========================================
   ACTIVE NAVIGATION
   ========================================= */

function setActiveNavigation() {

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();


    document
        .querySelectorAll(
            ".nav-item"
        )
        .forEach(item => {

            const link =
                item.getAttribute(
                    "href"
                );


            if (!link) return;


            const page =
                link
                    .split("/")
                    .pop()
                    .split("?")[0]
                    .toLowerCase();


            if (
                page === currentPage
            ) {

                item.classList.add(
                    "active"
                );

            }

        });

}


setActiveNavigation();


/* =========================================
   PAGE LOADED
   ========================================= */

function initializePage() {

    document.body.classList.add(
        "page-loaded"
    );

}


if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializePage
    );

} else {

    initializePage();

}


console.log(
    "Play Pulse v.01 loaded successfully."
);
