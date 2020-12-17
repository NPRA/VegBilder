import React, { useEffect, useRef } from "react";

function getBaseLineData(baseLineInfo) {
  let split = baseLineInfo.split(";");
  if (split.length !== 5) {
    return null;
  }
  const baseLinePosition = parseInt(split[0], 10);
  const baseLineTickInterval = parseInt(split[1], 10);
  const baseLineTickOffset = parseInt(split[2], 10);
  const tiltPoint = parseInt(split[3], 10);
  /* We currently do not use the final property, which is tilt.
   * It is assumed to always be 0, which is usually correct. A
   * non-zero (yet almost zero) tilt would give a slightly slanted
   * meter line, which might put users off. We deemed it more important
   * to render a nice-looking, almost entirely correct line, rather
   * than a perfectly correct but jagged one.
   */

  if (
    isNaN(baseLinePosition) ||
    isNaN(baseLineTickInterval) ||
    isNaN(baseLineTickOffset) ||
    isNaN(tiltPoint)
  ) {
    return null;
  }
  return {
    baseLinePosition,
    baseLineTickInterval,
    baseLineTickOffset,
    tiltPoint,
  };
}

function MeterLineCanvas({ baseLineInfo, ...rest }) {
  const canvasRef = useRef(null);

  // Draw the meter line on canvas
  useEffect(() => {
    if (baseLineInfo) {
      const baseLineData = getBaseLineData(baseLineInfo);
      if (baseLineData == null) {
        console.error(
          `Could not parse BASELINEINFO for drawing meter line. BASELINEINFO was ${baseLineInfo}`
        );
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
      let baseLineStartX = baseLineData.tiltPoint - 3 * meter;
      let baseLineEndX = baseLineData.tiltPoint + 3 * meter;
      context.moveTo(baseLineStartX, y);
      context.lineTo(baseLineEndX, y);
      context.stroke();

      // Ticks
      const firstTickX =
        baseLineData.tiltPoint + baseLineData.baseLineTickOffset;
      let x = firstTickX;
      while (x >= baseLineStartX) {
        drawMeterTick(x, y);
        x = x - meter;
      }
      x = firstTickX + meter;
      while (x <= baseLineEndX) {
        drawMeterTick(x, y);
        x = x + meter;
      }

      function drawMeterTick(x, y) {
        context.moveTo(x, y - 20);
        context.lineTo(x, y + 20);
        context.stroke();
      }
    }
  }, [baseLineInfo]);

  return <canvas {...rest} ref={canvasRef} />;
}

export default MeterLineCanvas;
