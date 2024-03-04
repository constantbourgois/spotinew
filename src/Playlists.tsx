
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { IconContext } from "react-icons";
import { fetchTracks, getPlaylists, getTracksFromPlaylists } from "./Spoti";
import { useEffect, useState } from "react";
import { Props } from "./App";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from '@mui/material/Select';


interface PlaylistI {
  key: string;
  name: string;
  id: string;
}

export default function Playlists({ token }: Props) {

  const [playArr, setPlayArr] = useState<PlaylistI[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>('');

  const handleChange = (event: SelectChangeEvent) => {
    console.log(event.target);

    const selPs = event.target.value;

    setSelectedPlaylist(selPs);

    (async () => {

      let tracks = await getTracksFromPlaylists(token, selPs);
      
      tracks = await fetchTracks(token, tracks);
      
      console.log(tracks);

    })()
  };

  useEffect(() => {

    (async () => {

      const ps = await getPlaylists(token);

      setPlayArr(ps.items);

    })()

  }, [token])

  const playlists = playArr.map((item, index) => <MenuItem id={item.id} key={index} value={item.id}>{item.name}</MenuItem>)

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <IconContext.Provider
          value={{ size: "4em", color: "white", className: "global-class-name" }}>
          <Grid item xs={12}>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-controlled-open-select-label">Playlist</InputLabel>
              <Select value='' onChange={handleChange} name="pick-playlist">
                {playlists}
              </Select>
            </FormControl>
          </Grid>
        </IconContext.Provider>
      </Grid>
    </Box>
  );

}