import "./App.scss";

import { useState } from "react";
import { useEffect } from "react";

import Player from "./Player";
import Moods from "./Moods";
import { fetchTracks } from "./Spoti";
import { getTrack } from "./Spoti";
import loadingIcon from "./loading-icon.svg";
import MainInterfaces from "./MainInterfaces";

function App() {
  const [showPlayer, setShowPlayer] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [Mood, setMood] = useState<Mood | null>(null);
  const [SongsArray, setSongsArray] = useState();
  const [currentTrack, setCurrentTrack] = useState(new Audio);
  const [firstPlay, setFirstPlay] = useState(true);
  const [firstToken, setFirstToken] = useState();
/*
  const firstFetchTracks = useEffect(() => {
    (async () => {
      
    })();
  }, [firstToken]);*/
/*
  const heyToto = ()=> {
    console.log(firstToken);
  }
  */
  useEffect(() => {
    (async () => {
      
      //get tocken from server
      const response = await fetch('/moods');
      const body = await response.json();

      if (response.status !== 200) {
        throw Error(body.message);
      }
      setFirstToken(body.token);
      const data = await fetchTracks(body.token);
      setSongsArray(data);
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
  /*
  useEffect(() => {
    getTracks().catch(console.error);
  }, [getTracks]);*/

  if (isLoading) {
    return (
      <div className="App-header">
        <img src={loadingIcon} alt="loadingIcon"></img>
      </div>
    );
  } else {
    return (
      <div className="App">
        <header className="App-header">
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
        </header>
      </div>
    );
  }
}

export default App;
