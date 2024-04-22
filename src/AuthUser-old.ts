import { redirectToAuthCodeFlow, getAccessToken } from "./authCodeWithPkce";

const params = new URLSearchParams(window.location.search);
const code = params.get("code");
const clientId = "b75ef8547d5a48debd9d8ac5a0a34b33";

export default async function AuthUser(){
    /* get the client id and token */
    if (!code) {
    redirectToAuthCodeFlow(clientId);
    } else {
       
    const accessToken = await getAccessToken(clientId, code);
    const prof = await fetchProfile(accessToken);
    const playlists = await getPlaylists(accessToken);
   
    return { accessToken, prof, playlists }
    
    }

    async function fetchProfile(code: string): Promise<UserProfile> {

    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${code}` }
    });

    return result.json();
    }
    async function getPlaylists( code: string): Promise<PlaylistTypes>{
        const result = await fetch("https://api.spotify.com/v1/me/playlists",{
            method: "GET", headers: { Authorization: 'Bearer ' + code }
        }
        )

    return result.json();
    }

}
