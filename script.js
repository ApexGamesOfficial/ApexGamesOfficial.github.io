/* =========================================
   PLAY PULSE
   ========================================= */


/* =========================================
   SOUND
   ========================================= */

const soundControl =
    document.getElementById("soundControl");

const soundIcon =
    document.getElementById("soundIcon");

const soundText =
    document.getElementById("soundText");


let soundEnabled =
    localStorage.getItem("playPulseSound") !== "off";


function updateSoundButton() {

    if (!soundControl) return;

    if (soundEnabled) {

        if (soundIcon)
            soundIcon.textContent = "🔊";

        if (soundText)
            soundText.textContent = "Sound On";

    } else {

        if (soundIcon)
            soundIcon.textContent = "🔇";

        if (soundText)
            soundText.textContent = "Sound Off";

    }

}


updateSoundButton();


if (soundControl) {

    soundControl.addEventListener("click", () => {

        soundEnabled = !soundEnabled;

        localStorage.setItem(
            "playPulseSound",
            soundEnabled ? "on" : "off"
        );

        updateSoundButton();

    });

}


/* =========================================
   FAVORITES
   ========================================= */

function getFavorites() {

    return JSON.parse(
        localStorage.getItem(
            "playPulseFavorites"
        )
    ) || [];

}


function saveFavorites(favorites) {

    localStorage.setItem(
        "playPulseFavorites",
        JSON.stringify(favorites)
    );

}


function addFavorite(gameName) {

    const favorites =
        getFavorites();

    if (!favorites.includes(gameName)) {

        favorites.push(gameName);

        saveFavorites(favorites);

    }

}


function removeFavorite(gameName) {

    let favorites =
        getFavorites();

    favorites =
        favorites.filter(
            game => game !== gameName
        );

    saveFavorites(favorites);

}


function isFavorite(gameName) {

    return getFavorites().includes(gameName);

}


/* =========================================
   FAVORITE BUTTON
   ========================================= */

document
    .querySelectorAll(".favorite-button")
    .forEach(button => {

        const gameName =
            button.dataset.favorite;


        /* Restore saved state */

        if (isFavorite(gameName)) {

            button.textContent = "♥";

            button.classList.add(
                "favorited"
            );

        } else {

            button.textContent = "♡";

        }


        /* Click */

        button.addEventListener(
            "click",
            () => {

                if (isFavorite(gameName)) {

                    removeFavorite(gameName);

                    button.textContent = "♡";

                    button.classList.remove(
                        "favorited"
                    );

                } else {

                    addFavorite(gameName);

                    button.textContent = "♥";

                    button.classList.add(
                        "favorited"
                    );

                }


                /* Animation */

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


/* =========================================
   RECENTLY PLAYED
   ========================================= */

function getRecentlyPlayed() {

    return JSON.parse(
        localStorage.getItem(
            "playPulseRecent"
        )
    ) || [];

}


function addRecentlyPlayed(gameName) {

    let recent =
        getRecentlyPlayed();


    recent =
        recent.filter(
            game => game !== gameName
        );


    recent.unshift(gameName);


    recent =
        recent.slice(0, 10);


    localStorage.setItem(
        "playPulseRecent",
        JSON.stringify(recent)
    );

}


/* =========================================
   GAME BUTTONS
   ========================================= */

document
    .querySelectorAll("[data-game]")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const gameName =
                    button.dataset.game;

                addRecentlyPlayed(
                    gameName
                );

            }
        );

    });


/* =========================================
   NAVIGATION
   ========================================= */

document
    .querySelectorAll(".nav-item")
    .forEach(item => {

        item.addEventListener(
            "click",
            () => {

                document.body.classList.add(
                    "page-changing"
                );

                setTimeout(() => {

                    document.body.classList.remove(
                        "page-changing"
                    );

                }, 300);

            }
        );

    });


/* =========================================
   PAGE LOADED
   ========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        document.body.classList.add(
            "page-loaded"
        );

    }
);
