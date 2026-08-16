/* =========================================
   PLAY PULSE
   Main Website Script
   ========================================= */


/* =========================================
   SOUND SYSTEM
   ========================================= */

const soundControl = document.getElementById("soundControl");
const soundIcon = document.getElementById("soundIcon");
const soundText = document.getElementById("soundText");

let soundEnabled =
    localStorage.getItem("playPulseSound") !== "off";


function updateSoundButton() {

    if (!soundControl) return;

    if (soundEnabled) {

        if (soundIcon) soundIcon.textContent = "🔊";
        if (soundText) soundText.textContent = "Sound On";

    } else {

        if (soundIcon) soundIcon.textContent = "🔇";
        if (soundText) soundText.textContent = "Sound Off";

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
   FAVORITES SYSTEM
   ========================================= */

function getFavorites() {

    return JSON.parse(
        localStorage.getItem("playPulseFavorites")
    ) || [];

}


function saveFavorites(favorites) {

    localStorage.setItem(
        "playPulseFavorites",
        JSON.stringify(favorites)
    );

}


/* Add a game to Favorites */

function addFavorite(gameName) {

    let favorites = getFavorites();

    if (!favorites.includes(gameName)) {

        favorites.push(gameName);

        saveFavorites(favorites);

    }

}


/* Remove a game from Favorites */

function removeFavorite(gameName) {

    let favorites = getFavorites();

    favorites = favorites.filter(
        game => game !== gameName
    );

    saveFavorites(favorites);

}


/* Check if a game is already favorited */

function isFavorite(gameName) {

    const favorites = getFavorites();

    return favorites.includes(gameName);

}


/* Toggle favorite */

function toggleFavorite(gameName, button) {

    if (isFavorite(gameName)) {

        removeFavorite(gameName);

        if (button) {
            button.textContent = "♡ Favorite";
            button.classList.remove("favorited");
        }

    } else {

        addFavorite(gameName);

        if (button) {
            button.textContent = "♥ Favorited";
            button.classList.add("favorited");
        }

    }

}


/* =========================================
   AUTOMATIC FAVORITE BUTTON SETUP
   ========================================= */

document.querySelectorAll(
    "[data-favorite]"
).forEach(button => {

    const gameName =
        button.dataset.favorite;


    /* Set correct state when page loads */

    if (isFavorite(gameName)) {

        button.textContent = "♥ Favorited";

        button.classList.add("favorited");

    }


    /* Button click */

    button.addEventListener(
        "click",
        () => {

            toggleFavorite(
                gameName,
                button
            );

        }
    );

});


/* =========================================
   RECENTLY PLAYED SYSTEM
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


    /* Remove duplicate */

    recent =
        recent.filter(
            game => game !== gameName
        );


    /* Put newest game first */

    recent.unshift(gameName);


    /* Keep only the last 10 */

    recent =
        recent.slice(0, 10);


    localStorage.setItem(
        "playPulseRecent",
        JSON.stringify(recent)
    );

}


/* =========================================
   GAME PLAY BUTTONS
   ========================================= */

document.querySelectorAll(
    "[data-game]"
).forEach(button => {

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
   NAVIGATION CLICK EFFECT
   ========================================= */

document.querySelectorAll(
    ".nav-item"
).forEach(item => {

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
   PAGE READY
   ========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        document.body.classList.add(
            "page-loaded"
        );

    }
);

