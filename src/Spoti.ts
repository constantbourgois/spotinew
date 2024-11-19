import { redirectToAuthCodeFlow, getAccessToken } from "./authCodeWithPkce";

const params = new URLSearchParams(window.location.search);
const code = params.get("code");
const clientId = "b75ef8547d5a48debd9d8ac5a0a34b33";

export async function authUser() {
  /* get the client id and token */
  if (!code) {
    await redirectToAuthCodeFlow(clientId);
  } else {
    const accessToken = await getAccessToken(clientId, code);
    //const prof = await fetchProfile(accessToken);

    return accessToken;
  }
}
/*
async function fetchProfile(code: string): Promise<UserProfile> {
  const result = await fetch("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${code}` },
  });

  return result.json();
}
*/

export async function getPlaylists(code: string) {
  const result = await fetch(`https://api.spotify.com/v1/me/playlists`, {
    method: "GET",
    headers: { Authorization: `Bearer ${code}` },
  });

  return result.json();
}

export async function getTracksFromPlaylists(code: string, id: string) {
  const result = await fetch(
    `https://api.spotify.com/v1/playlists/${id}?fields=tracks.items`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${code}` },
    }
  );

  return result.json();
}

function getRandomSearch() {
  // A list of all characters that can be chosen.
  const characters = "abcdefghijklmnopqrstuvwxyz";

  // Gets a random character from the characters string.
  const randomCharacter = characters.charAt(
    Math.floor(Math.random() * characters.length)
  );
  let randomSearch = "";

  // Places the wildcard character at the beginning, or both beginning and end, randomly.

  randomSearch = "%25" + randomCharacter + "%25";

  return randomSearch;
}

export async function fetchTracks(code: string, tracksP: number[]) {

  const myHeaders = new Headers();

  myHeaders.append("Authorization", `Bearer ${code}`);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    //redirect: 'follow'
  };

 
    let r = [];
    const t = tracksP.tracks.items.map( i => { 
        (async () => {
            await fetch(
              `https://api.spotify.com/v1/audio-features/${i.track.id}`,
              requestOptions
            )
              .then(function (response) {
                return response.json();
              })
              .then(function (audio_features) {
               
                i.track.audio_features = audio_features;
                i.track.valence = audio_features["valence"];
                i.track.danceability = audio_features["danceability"];
                i.track.energy = audio_features["energy"];
                r.push(i.track);
               
              })
              .catch((error) => console.log("error", error));
          })();
    }
    ); // create a new array with the tracks ids

    return r;

}

export async function getTrack(Songs, mood) {
  let songsArray = Songs;
  console.log(Songs);

  let songUrl;

  if (songsArray && mood) {
    // sort the songs by valence
    songsArray = songsArray.sort((a, b) => a.valence - b.valence);

    switch (mood) {
      case "happy": {
        songUrl = songsArray[Math.floor(songsArray.length / 2)]["uri"];
        return songUrl;
      }
      case "sad": {
        songUrl = songsArray[0]["uri"];
        return songUrl;
      }
      case "excited": {
        // get the song with highest danceability

        const dancingSong = songsArray.reduce((previous, current) => {
          const a =
            current.danceability > previous.danceability ? current : previous;
          return a;
        });
        songUrl = dancingSong.uri;
        return songUrl;
      }
      default: {
        return songUrl;
      }
    }
  }
}

export async function getTransferPlayback(deviceId: string, code: string, uri:string){
 
  await fetch(
    `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
    {
      method: "PUT",
      headers: { Authorization: `Bearer ${code}` },
      body: JSON.stringify({uris: [`${uri}`]})
    }
  );

}