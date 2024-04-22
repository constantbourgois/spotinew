import "./assets/App.scss";

import { SetStateAction, useState } from "react";
import { useEffect } from "react";

import Player from "./Player";
import Moods from "./Moods";
import { getTransferPlayback } from "./Spoti";
import { getTrack } from "./Spoti";
import loadingIcon from "./assets/loading-icon.svg";
import {authUser}  from "./Spoti";
import Playlists from "./Playlists";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export interface Props{
  token: string;
  selectedMood: string;
 
}


function App() {
  const [showPlayer, setShowPlayer] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [Mood, setMood] = useState<string>("");
  const [SongsArray, setSongsArray] = useState<string[]>([]);
  const [currentTrack, setCurrentTrack] = useState(new Audio);
  const [firstPlay, setFirstPlay] = useState(true);
  const [firstToken, setFirstToken] = useState<string>("");
  const [deviceId, setDeviceId]  = useState<string>("");


  useEffect(() => {
    (async () => {
 
      const accessToken = await authUser(); // authenticate the user
      
      setFirstToken(accessToken);
     
      setLoading(false);
    

    })();
  }, []);

  const openPlayer = (mood : string) => {
    setShowPlayer(true);
    setMood(mood);
    (async () => {
      const track = await getTrack(SongsArray, mood);
      await getTransferPlayback(deviceId,firstToken,track);
      /*
      const newAudioElem = new Audio(t); //get the audio
      setCurrentTrack(newAudioElem);
      newAudioElem.play(); //*/
    })();
  };
  
  const getPlaylistTracks = (tracks: SetStateAction<string[]>) =>{
    setSongsArray(tracks);
  }

  const getDeviceId = (deviceId: SetStateAction<string>) => {
    setDeviceId(deviceId);
  }
  

  if (isLoading) {
    return (
      <div className="App-header">
        <img src={loadingIcon} alt="loadingIcon"></img>
      </div>
    );
  } else {
    return (
      <ThemeProvider theme={darkTheme}>
         <CssBaseline />
      <div className="App">
          <Playlists getPlaylistTracks={getPlaylistTracks} token={firstToken}/>
          <Moods openPlayer={openPlayer} />
          <Player
            token={firstToken}
            firstPlay={firstPlay}
            getDeviceId={getDeviceId}
            setFirstPlay={setFirstPlay}
            currentTrack={currentTrack}
            songsArray={SongsArray}
            selectedMood={Mood}
            showPlayer={showPlayer}
          />
      </div>
      </ThemeProvider>
    );
  }
}

export default App;
