
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { IconContext } from "react-icons";
import { getPlaylists } from "./Spoti";
import { useEffect, useState } from "react";
import { Props } from "./App";
import { useFormControl } from "@mui/material";

type playlist = string;

export default function Playlists({token}: Props) {
  const [playArr, setPlayArr] = useState([]);
  
  useEffect( () => {
  
    (async ()=> {
     
      const playlists = await getPlaylists(token);
     
      console.log(playlists);

     setPlayArr(playlists.items);

    })()

},[token])

const Ps = playArr.map(item => <option key={item.key} value={item.name}></option> )


  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <IconContext.Provider
          value={{ size: "4em", color: "white", className: "global-class-name" }}
        >
          <Grid item xs={12}>
            <label>Choose your playlist</label>
            <form>
        <select name="pick-playlist">
         {Ps}
      </select>
    </form>
          </Grid>
        </IconContext.Provider>
      </Grid>
    </Box>
  );

}