/* =========================================
   PLAY PULSE v.01
   MAIN JAVASCRIPT
   ========================================= */


/* =========================================
   STORAGE HELPERS
   ========================================= */

function getStoredArray(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.warn(`Play Pulse: Could not read ${key}`, error);
        return [];
    }
}


function saveStoredArray(key, array) {
    try {
        localStorage.setItem(key, JSON.stringify(array));
    } catch (error) {
        console.warn(`Play Pulse: Could not save ${key}`, error);
    }
}


/* =========================================
   SOUND
   ========================================= */

let soundEnabled =
    localStorage.getItem("playPulseSound") !== "off";


const soundControl =
    document.getElementById("soundControl");

const soundIcon =
    document.getElementById("soundIcon");

const soundText =
    document.getElementById("soundText");


function updateSoundButton() {

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


function toggleSound() {

    soundEnabled = !soundEnabled;

    localStorage.setItem(
        "playPulseSound",
        soundEnabled ? "on" : "off"
    );

    updateSoundButton();
}


if (soundControl) {

    soundControl.addEventListener(
        "click",
        toggleSound
    );

}


updateSoundButton();


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

        favorites.push(gameName);

        saveFavorites(favorites);

    }

}


function removeFavorite(gameName) {

    if (!gameName) return;

    const favorites =
        getFavorites();

    const updatedFavorites =
        favorites.filter(
            game => game !== gameName
        );

    saveFavorites(updatedFavorites);

}


function isFavorite(gameName) {

    if (!gameName) return false;

    return getFavorites().includes(
        gameName
    );

}


/* =========================================
   UPDATE FAVORITE BUTTON
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
            "aria-label",
            `Remove ${gameName} from favorites`
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
            "aria-label",
            `Add ${gameName} to favorites`
        );

        button.setAttribute(
            "aria-pressed",
            "false"
        );

    }

}


/* =========================================
   FAVORITE BUTTONS
   ========================================= */

function initializeFavoriteButtons() {

    document
        .querySelectorAll(".favorite-button")
        .forEach(button => {

            updateFavoriteButton(button);


            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();
                    event.stopPropagation();

                    const gameName =
                        button.dataset.favorite;

                    if (!gameName) return;


                    if (isFavorite(gameName)) {

                        removeFavorite(gameName);

                    } else {

                        addFavorite(gameName);

                    }


                    updateFavoriteButton(
                        button
                    );


                    /* Favorite animation */

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


    /* Remove duplicate */

    recent =
        recent.filter(
            game => game !== gameName
        );


    /* Put newest game first */

    recent.unshift(
        gameName
    );


    /* Keep latest 10 */

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

function initializeGameButtons() {

    document
        .querySelectorAll("[data-game]")
        .forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    /*
                     * Favorite buttons may also be
                     * inside a game card, so don't
                     * treat them as a game launch.
                     */

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

}


initializeGameButtons();


/* =========================================
   GAME SEARCH FOUNDATION
   ========================================= */

function initializeGameSearch() {

    const searchInput =
        document.querySelector(
            "#gameSearch, .game-search"
        );


    if (!searchInput) {
        return;
    }


    const gameCards =
        document.querySelectorAll(
            ".game-card"
        );


    searchInput.addEventListener(
        "input",
        () => {

            const searchTerm =
                searchInput.value
                    .trim()
                    .toLowerCase();


            gameCards.forEach(card => {

                const text =
                    card.textContent
                        .toLowerCase();


                const matches =
                    text.includes(
                        searchTerm
                    );


                card.style.display =
                    matches ? "" : "none";

            });

        }
    );

}


initializeGameSearch();


/* =========================================
   NAVIGATION
   ========================================= */

function initializeNavigation() {

    document
        .querySelectorAll(".nav-item")
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

}


initializeNavigation();


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
        .querySelectorAll(".nav-item")
        .forEach(item => {

            const link =
                item.getAttribute("href");

            if (!link) return;

            const linkPage =
                link
                    .split("/")
                    .pop()
                    .split("?")[0]
                    .toLowerCase();


            if (
                linkPage === currentPage
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
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializePage
    );

} else {

    initializePage();

}


/* =========================================
   PLAY PULSE READY
   ========================================= */

console.log(
    "Play Pulse v.01 loaded successfully."
);
