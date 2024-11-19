import { getTrack } from "./Spoti";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { IconContext } from "react-icons";
import { GrPlay } from "react-icons/gr";
import { GrChapterNext } from "react-icons/gr";
import { GrStop } from "react-icons/gr";
import { fetchTracks } from "./Spoti";
import { useState } from "react";
import { useEffect } from "react";
//import { Props } from "./App";

const style = {
  width: "100vw",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  top: 0,
  left: 0,
  backgroundColor: "#282c34",
  position: "absolute",
};

const track = {
  name: "",
  album: {
      images: [
          { url: "" }
      ]
  },
  artists: [
      { name: "" }
  ]
}



interface Props{
  token: string;
  selectedMood: string;
  firstPlay: boolean;
  songsArray: string[];
  showPlayer: boolean;
  getDeviceId: (deviceId:string) => void;
 
}

export default function Player({token, selectedMood, getDeviceId}: Props) {
  const [nextTrack, setNextTrack] = useState<HTMLAudioElement | null>(null);
  const mood = selectedMood;
  const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [player, setPlayer] = useState(undefined);
    const [current_track, setTrack] = useState(track);



  useEffect(() => {
    /*
    if (selectedMood) {
      //console.log(props.firstPlay);
      //props.setFirstPlay(false);
      (async () => {
        // get the next track
        const SongsArray = await fetchTracks(token);
        
        const t = await getTrack(SongsArray, selectedMood);
        
        const newAudioElem = new Audio(t); //get the audio
        
        setNextTrack(newAudioElem);
      
      })();
    }
    console.log("mood", selectedMood);*/

    const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {

            const player = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: cb => { cb(token); },
                volume: 0.5
            });

            setPlayer(player);

            player.addListener('ready', ({ device_id }) => {
              getDeviceId(device_id);
                console.log('Ready with Device ID', device_id);
            });

            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            player.addListener('player_state_changed', ( state => {

                if (!state) {
                    return;
                }

                setTrack(state.track_window.current_track);
                setPaused(state.paused);

                player.getCurrentState().then( state => { 
                    (!state)? setActive(false) : setActive(true) 
                });

            }));

            player.connect();

        };
    }, []);

    if (!is_active) { 
        return (
            <>
                <div className="container">
                    <div className="main-wrapper">
                        <b> Instance not active. Transfer your playback using your Spotify app </b>
                    </div>
                </div>
            </>)
    } else {
        return (
            <>
                <div className="container">
                    <div className="main-wrapper">

                        <img src={current_track.album.images[0].url} className="now-playing__cover" alt="" />

                        <div className="now-playing__side">
                            <div className="now-playing__name">{current_track.name}</div>
                            <div className="now-playing__artist">{current_track.artists[0].name}</div>

                            <button className="btn-spotify" onClick={() => { player.previousTrack() }} >
                                &lt;&lt;
                            </button>

                            <button className="btn-spotify" onClick={() => { player.togglePlay() }} >
                                { is_paused ? "PLAY" : "PAUSE" }
                            </button>

                            <button className="btn-spotify" onClick={() => { player.nextTrack() }} >
                                &gt;&gt;
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
