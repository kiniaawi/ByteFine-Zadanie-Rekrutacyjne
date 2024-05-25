import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { Box, Button, Grid, Typography } from "@mui/material";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import FormatShapesIcon from "@mui/icons-material/FormatShapes";
import ImageSearchIcon from "@mui/icons-material/ImageSearch";
import WallpaperIcon from "@mui/icons-material/Wallpaper";
import DeleteIcon from "@mui/icons-material/Delete";

const CanvasEditor = () => {
  const canvasRef = useRef(null);
  const [textColor, setTextColor] = useState("black");
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const canvas = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    canvas.current = new fabric.Canvas(canvasRef.current);

    canvas.current.setBackgroundColor(
      "plum",
      canvas.current.renderAll.bind(canvas.current)
    );

    fabric.Image.fromURL("path_to_your_image.jpg", (img) => {
      img.set({
        selectable: false,
        evented: false,
      });
      canvas.current.setBackgroundImage(
        img,
        canvas.current.renderAll.bind(canvas.current)
      );
    });

    return () => {
      if (canvas.current) {
        canvas.current.dispose();
        canvas.current = null;
      }
    };
  }, []);

  const handleResetClick = () => {
    canvas.current.clear();
    setShowTextColorPicker(false);
    canvas.current.setBackgroundColor(
      "plum",
      canvas.current.renderAll.bind(canvas.current)
    );
    fabric.Image.fromURL("path_to_your_image.jpg", (img) => {
      img.set({
        selectable: false,
        evented: false,
      });
      canvas.current.setBackgroundImage(
        img,
        canvas.current.renderAll.bind(canvas.current),
        {
          scaleX: canvas.current.width / img.width,
          scaleY: canvas.current.height / img.height,
        }
      );
    });
  };

  const handleBackgroundButtonClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = handleBackgroundChange;
    input.click();
  };

  const handleBackgroundChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const fabricImg = new fabric.Image(img);
        fabricImg.scaleToWidth(canvas.current.width);
        fabricImg.scaleToHeight(canvas.current.height);
        canvas.current.setBackgroundImage(
          fabricImg,
          canvas.current.renderAll.bind(canvas.current)
        );
      };
    };
    reader.readAsDataURL(file);
  };

  const handleTextButtonClick = () => {
    setShowTextColorPicker(true);
    const textObj = new fabric.IText("Create your own Poster!", {
      left: 50,
      top: 50,
      fill: textColor,
      hasControls: true,
      cornerStyle: "circle",
      borderColor: "black",
      cornerColor: "black",
    });
    canvas.current.add(textObj);
    canvas.current.setActiveObject(textObj);
  };

  const handleColorClick = (newColor) => {
    setTextColor(newColor);
    const activeObj = canvas.current.getActiveObject();
    if (activeObj && activeObj.type === "i-text") {
      activeObj.set("fill", newColor);
      canvas.current.renderAll();
    }
  };

  const handleExportClick = () => {
    const canvasObjects = canvas.current.getObjects();
    if (canvasObjects.length === 0) return;

    const visibleArea = {
      left: 0,
      top: 0,
      width: canvas.current.width,
      height: canvas.current.height,
    };

    const canvasDataUrl = canvas.current.toDataURL({
      format: "png",
      left: visibleArea.left,
      top: visibleArea.top,
      width: visibleArea.width,
      height: visibleArea.height,
    });

    const link = document.createElement("a");
    link.download = "zadanie-rekrutacyjne.png";
    link.href = canvasDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = handleImageChange;
    input.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const fabricImg = new fabric.Image(img, {
          left: 50,
          top: 50,
          scaleX: 0.5,
          scaleY: 0.5,
          cornerStyle: "circle",
          borderColor: "black",
          cornerColor: "black",
        });
        canvas.current.add(fabricImg);
      };
    };
    reader.readAsDataURL(file);
  };

  return (
    <Box display="flex" flexDirection="row" gap={6}>
      <Box>
        <canvas ref={canvasRef} width={500} height={650} />
      </Box>

      <Box width={"40vw"}>
        <Box
          display="flex"
          flexDirection="row"
          sx={{ justifyContent: "space-between", marginBottom: 5 }}
        >
          <Typography variant="h5">
            <DesignServicesIcon />
            CanvasEditor
          </Typography>
          <Button sx={{ color: "red" }} onClick={handleResetClick}>
            <RestartAltIcon />
            Reset
          </Button>
        </Box>
        <Button
          sx={{
            backgroundColor: "lightgray",
            color: "black",
            marginBottom: 3,
            textAlign: "left",
          }}
          fullWidth
          disabled
        >
          Add content
        </Button>
        <Box sx={{ marginBottom: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button
                sx={{
                  backgroundColor: "lightgray",
                  color: "black",
                  height: "25vh",
                }}
                fullWidth
                onClick={handleTextButtonClick}
              >
                <FormatShapesIcon /> Text
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                sx={{
                  backgroundColor: "lightgray",
                  color: "black",
                  height: "25vh",
                }}
                fullWidth
                onClick={handleImageUpload}
              >
                <ImageSearchIcon /> Image
              </Button>
            </Grid>
          </Grid>
        </Box>
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button
                sx={{
                  backgroundColor: "lightgray",
                  color: "black",
                  height: "25vh",
                }}
                fullWidth
                onClick={handleBackgroundButtonClick}
              >
                <WallpaperIcon /> Background
              </Button>
            </Grid>
            <Grid item xs={6}>
              {showTextColorPicker && (
                <Box sx={{ backgroundColor: "lightgray", p: 1 }}>
                  <Typography sx={{ marginBottom: 2 }}>
                    CHOOSE TEXT COLOR
                  </Typography>
                  <Box
                    display="flex"
                    flexDirection="row"
                    sx={{ marginBottom: 2 }}
                  >
                    <Button
                      style={{
                        backgroundColor: "white",
                        height: "2vw",
                        border:
                          textColor === "white"
                            ? "2px solid plum"
                            : "2px solid black",
                      }}
                      onClick={() => handleColorClick("white")}
                    />
                    <Button
                      style={{
                        backgroundColor: "black",
                        border:
                          textColor === "black" ? "2px solid black" : "none",
                      }}
                      onClick={() => handleColorClick("black")}
                    />
                    <Button
                      style={{
                        backgroundColor: "red",
                        border:
                          textColor === "red" ? "2px solid black" : "none",
                      }}
                      onClick={() => handleColorClick("red")}
                    />
                    <Button
                      style={{
                        backgroundColor: "blue",
                        border:
                          textColor === "blue" ? "2px solid black" : "none",
                      }}
                      onClick={() => handleColorClick("blue")}
                    />
                    <Button
                      style={{
                        backgroundColor: "green",
                        border:
                          textColor === "green" ? "2px solid black" : "none",
                      }}
                      onClick={() => handleColorClick("green")}
                    />
                  </Box>
                </Box>
              )}
            </Grid>
          </Grid>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              sx={{ backgroundColor: "darkviolet", color: "white" }}
              onClick={handleExportClick}
            >
              Export to PNG
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CanvasEditor;
