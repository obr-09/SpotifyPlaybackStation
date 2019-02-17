const hash = window.location.hash
    .substring(1)
    .split('&')
    .reduce(function (initial, item) {
        if (item) {
            let parts = item.split('=');
            initial[parts[0]] = decodeURIComponent(parts[1]);
        }
        return initial;
    }, {});

const spotifyProfileHttp = new XMLHttpRequest();
const spotifyProfileUrl = 'https://api.spotify.com/v1/me?';
spotifyProfileHttp.open('GET', spotifyProfileUrl);
spotifyProfileHttp.setRequestHeader('Authorization', 'Bearer ' + hash.access_token);
spotifyProfileHttp.send();
spotifyProfileHttp.onreadystatechange=(e)=>{
    if (spotifyProfileHttp.response) {
        const displayName = JSON.parse(spotifyProfileHttp.response).display_name;
        window.location.replace('/player?access_token=' + hash.access_token + '&profile=' + displayName);
    }
};

