/* eslint-disable react/prop-types */
import { useEffect } from "react";
import config from "./config.json";
// import Quagga from "quagga";

// const config = {
//   inputStream: {
//     type: "LiveStream",
//     constraints: {
//       width: window.innerWidth,
//       facingMode: "environment",
//       aspectRatio: { min: 10, max: 100 },
//     },
//   },
//   locator: {
//     patchSize: "medium",
//     halfSample: true,
//   },
//   numOfWorkers: 2,
//   frequency: 10,
//   decoder: {
//     readers: ["code_128_reader"],
//   },
//   locate: true,
// };

export const Scanner = (props) => {
  const { onDetected, Quagga } = props;
  // config.inputStream.constraints.height = window.innerWidth
  // config.inputStream.constraints.width = window.innerHeight

  useEffect(() => {
    if(window.innerWidth > 768){
      config.inputStream.constraints.height.min = 300
      config.inputStream.constraints.width.min = 800
    }
    Quagga.init(config, (err) => {
      if (err) {
        console.log(err, "error msg");
      }
      Quagga.start();
      return () => {
        Quagga.stop();
      };
    });

    //detecting boxes on stream
    Quagga.onProcessed((result) => {
      var drawingCtx = Quagga.canvas.ctx.overlay,
        drawingCanvas = Quagga.canvas.dom.overlay;

      if (result) {
        if (result.boxes) {
          drawingCtx.clearRect(
            0,
            0,
            Number(drawingCanvas.getAttribute("width")),
            Number(drawingCanvas.getAttribute("height"))
          );
          result.boxes
            .filter(function (box) {
              return box !== result.box;
            })
            .forEach(function (box) {
              Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
                color: "green",
                lineWidth: 2,
              });
            });
        }

        if (result.box) {
          Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
            color: "#00F",
            lineWidth: 2,
          });
        }

        if (result.codeResult && result.codeResult.code) {
          Quagga.ImageDebug.drawPath(
            result.line,
            { x: "x", y: "y" },
            drawingCtx,
            { color: "red", lineWidth: 3 }
          );
        }
      }
    });

    Quagga.onDetected(detected);
  }, []);

  const detected = (result) => {
    onDetected(result.codeResult.code);
  };

  return (
    // If you do not specify a target,
    // QuaggaJS would look for an element that matches
    // the CSS selector #interactive.viewport
    <div id="interactive" className="viewport" />
  );
};

// export default Scanner;
