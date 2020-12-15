import React, { useEffect, useRef } from "react";

function MeterLineCanvas({ baseLineInfo, ...rest }) {
  console.log(baseLineInfo);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.fillStyle = "#FFFFFF";
  }, []);

  return <canvas {...rest} ref={canvasRef} />;
}

export default MeterLineCanvas;
