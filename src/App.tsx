import "./App.scss";

import { useState } from "react";
import { useEffect } from "react";

import Player from "./Player";
import Moods from "./Moods";
import { fetchTracks } from "./Spoti";
import { getTrack } from "./Spoti";
import loadingIcon from "./loading-icon.svg";
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
 
}


function App() {
  const [showPlayer, setShowPlayer] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [Mood, setMood] = useState();
  const [SongsArray, setSongsArray] = useState();
  const [currentTrack, setCurrentTrack] = useState(new Audio);
  const [firstPlay, setFirstPlay] = useState(true);
  const [firstToken, setFirstToken] = useState<string>("");

  //const [code, setCode] = useState<string | null>(null);


  useEffect(() => {
    (async () => {
 
      const a = await authUser();
    
      setFirstToken( a?.accessToken);
     
      //const data = await fetchTracks(a?.accessToken);
      //setSongsArray(data);
      setLoading(false);
      // fetch the tracks
      //firstFetchTracks();

    })();
  }, []);

  const openPlayer = (mood : string) => {
    setShowPlayer(true);
    setMood(mood);
    (async () => {
      const t = await getTrack(SongsArray, mood);
      const newAudioElem = new Audio(t); //get the audio
      setCurrentTrack(newAudioElem);
      newAudioElem.play(); //
    })();
  };

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
          <Playlists token={firstToken}/>
          <Moods openPlayer={openPlayer} />
          <Player
            token={firstToken}
            firstPlay={firstPlay}
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
