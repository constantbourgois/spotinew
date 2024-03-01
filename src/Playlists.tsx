
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { IconContext } from "react-icons";
import { getPlaylists } from "./Spoti";
import { useEffect, useState } from "react";
import { Props } from "./App";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from '@mui/material/Select';


interface ItemI {
  key: string;
  name: string;
  id: string;
}

export default function Playlists({token}: Props) {

  const [playArr, setPlayArr] = useState<ItemI[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>('');

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedPlaylist(event.target.value);
    console.log(event.target.value)
  };

  useEffect( () => {
  
    (async ()=> {
     
    const ps = await getPlaylists(token);
     
     setPlayArr(ps.items);
 
    })()

},[token])

const playlists = playArr.map((item,index )=> <MenuItem id={item.id} key={index} value={item.id}>{item.name}</MenuItem> )

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