import React, { useEffect, useRef } from "react";

/* Have to do some awkward string manipulation to extract the data from imagepoint.properties.BASELINEINFO,
 * as it cannot be parsed as a json object in its current form. This function should be replaced as soon as
 * BASELINEINFO gets appropriately formatted.
 */
function getBaseLineData(baseLineInfo) {
  let split = baseLineInfo.split("{");
  if (split.length !== 2) return null;

  let stripped = split[1];
  split = stripped.split("}");
  if (split.length !== 2) return null;

  stripped = split[0];
  const elements = stripped.split(",");
  if (elements.length !== 5) return null;

  let valid = true;
  const values = elements.map((e) => {
    const keyAndValue = e.split(": ");
    if (keyAndValue.length !== 2) {
      valid = false;
      return null;
    } else {
      return keyAndValue[1];
    }
  });
  return valid
    ? {
        baseLinePosition: parseInt(values[0], 10),
        baseLineTickInterval: parseInt(values[1], 10),
        baseLineTickOffset: parseInt(values[2], 10),
        tiltPoint: parseInt(values[3], 10),
        /* We currently do not use the final property, which is tilt.
         * It is assumed to always be 0, which is usually correct. A
         * non-zero (yet almost zero) tilt would give a slightly slanted
         * meter line, which might put users off. We deemed it more important
         * to render a nice-looking, almost entirely correct line, rather
         * than a perfectly correct but ugly one.
         */
      }
    : null;
}

function MeterLineCanvas({ baseLineInfo, ...rest }) {
  const canvasRef = useRef(null);

  // Draw the meter line on canvas
  useEffect(() => {
    if (baseLineInfo) {
      const baseLineData = getBaseLineData(baseLineInfo);
      if (baseLineData == null) {
        console.error("Could not parse BASELINEINFO for drawing meter line");
        return;
      }
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      context.strokeStyle = "#FFFFFF";
      context.lineWidth = 3;
      context.beginPath();

      const meter = baseLineData.baseLineTickInterval;

      // Baseline
      const y = baseLineData.baseLinePosition;
      let x = baseLineData.tiltPoint - 2.5 * meter;
      context.moveTo(x, y);
      context.lineTo(x + 5 * meter, y);
      context.stroke();

      // Ticks
      x = baseLineData.tiltPoint + baseLineData.baseLineTickOffset - 2 * meter;
      for (let i = 0; i < 5; i++) {
        context.moveTo(x + i * meter, y - 20);
        context.lineTo(x + i * meter, y + 20);
        context.stroke();
      }
    }
  }, [baseLineInfo]);

  return <canvas {...rest} ref={canvasRef} />;
}

export default MeterLineCanvas;
