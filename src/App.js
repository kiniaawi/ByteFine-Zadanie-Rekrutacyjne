import React from "react";
import CanvasEditor from "./CanvasEditor";
import { Box } from "@mui/material";

const App = () => {
  return (
    <Box
      sx={{
        p: 10,
        marginLeft: "10vw",
        marginRight: "auto",
      }}
    >
      <CanvasEditor />
    </Box>
  );
};

export default App;
