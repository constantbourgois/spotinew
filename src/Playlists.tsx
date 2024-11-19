import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { IconContext } from "react-icons";
import { fetchTracks, getPlaylists, getTracksFromPlaylists } from "./Spoti";
import { useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from '@mui/material/Select';


interface PlaylistI {
  key: string;
  name: string;
  id: string;
  token: string;
  getPlaylistTracks: (tracks: any) => void;

}

export default function Playlists({ token, getPlaylistTracks }: PlaylistI) {

  const [playArr, setPlayArr] = useState<PlaylistI[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>('');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>('');
  const [tracksArray ,setTracksArray] = useState<string>('');

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedPlaylist(event.target.value);
    const obj = JSON.parse(event.target.value);
    setSelectedPlaylistId(obj.id);
   
     // get the playlist id selected by user
    //setSelectedPlaylistName(event.target.playlistName);
    /*playArr.forEach((item) => {
      console.log(item.id, event.target.value);
      if (item.id === event.target.value) {
        setSelectedPlaylistName(item.name);
        console.log(selectedPlaylistName);
      }
    });*/
    // get the playlist name selected by user

    (async () => {

     
      

    })()
  };

  useEffect(() => {
    console.log(selectedPlaylist);

    (async () => {

      const ps = await getPlaylists(token);

      setPlayArr(ps.items);

      let tracks = await getTracksFromPlaylists(token, selectedPlaylistId);
      
      tracks = await fetchTracks(token, tracks);
      
      getPlaylistTracks(tracks);

    })()

  }, [selectedPlaylist,token])

  const playlists = playArr.map((item) => <MenuItem key={item.id} value={JSON.stringify({id: item.id,name:item.name})} >{item.name}</MenuItem>)

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <IconContext.Provider
          value={{ size: "4em", color: "white", className: "global-class-name" }}>
          <Grid item xs={12}>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-controlled-open-select-label">Playlist</InputLabel>
              <Select value={selectedPlaylist} onChange={handleChange} name="pick-playlist">
                {playlists}
              </Select>
            </FormControl>
          </Grid>
        </IconContext.Provider>
      </Grid>
    </Box>
  );

}