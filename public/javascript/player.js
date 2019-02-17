let spotifyKeyElements = document.getElementsByClassName("spotify-key");
let token = null;
if (spotifyKeyElements.length > 0 && spotifyKeyElements[0].innerText) {
    token = spotifyKeyElements[0].innerText;
}

window.onSpotifyWebPlaybackSDKReady = () => {
    const player = new Spotify.Player({
        name: 'Spotify Playback Station',
        getOAuthToken: cb => { cb(token); }
    });

    // Error handling
    player.addListener('initialization_error', ({ message }) => { console.error(message); });
    player.addListener('authentication_error', ({ message }) => { refresh(); });
    player.addListener('account_error', ({ message }) => { console.error(message); });
    player.addListener('playback_error', ({ message }) => { console.error(message); });

    // Playback status updates
    player.addListener('player_state_changed', state => { console.log(state); });

    // Ready
    player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
    });

    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
    });

    // Connect to the player!
    player.connect();
};

function refresh() {
    location.reload();
}

function deleteToken(tokenName) {
    console.log("delete token : " + tokenName);

}

function playPause() {
    console.log("playPause");
}

function goPrevious() {
    console.log("goPrevious");
}

function goNext() {
    console.log("goNext");
}
