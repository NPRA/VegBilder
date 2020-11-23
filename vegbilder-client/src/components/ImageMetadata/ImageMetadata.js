import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import { useCurrentImagePoint } from "../../contexts/CurrentImagePointContext";
import { toLocaleDateAndTime } from "../../utilities/dateTimeUtilities";

const useStyles = makeStyles({
  vegsystemreferanse: {
    fontWeight: "bold",
  },
});

const ImageMetadata = () => {
  const classes = useStyles();
  const { currentImagePoint } = useCurrentImagePoint();
  let metadata;
  if (currentImagePoint) {
    const {
      VEGKATEGORI,
      VEGSTATUS,
      VEGNUMMER,
      FELTKODE,
      STREKNING,
      DELSTREKNING,
      METER,
      TIDSPUNKT,
      KRYSSDEL,
      SIDEANLEGGSDEL,
      ANKERPUNKT,
    } = currentImagePoint.properties;

    const meterRounded = Math.round(METER);
    const dateTime = toLocaleDateAndTime(TIDSPUNKT);

    const vegOgStrekning = `${VEGKATEGORI}${VEGSTATUS}${VEGNUMMER} S${STREKNING}D${DELSTREKNING}`;
    let vegsystemreferanse;
    if (KRYSSDEL) {
      vegsystemreferanse = `${vegOgStrekning} M${ANKERPUNKT} KD${KRYSSDEL} m${meterRounded}`;
    } else if (SIDEANLEGGSDEL) {
      vegsystemreferanse = `${vegOgStrekning} M${ANKERPUNKT} KD${KRYSSDEL} m${meterRounded}`;
    } else {
      vegsystemreferanse = `${vegOgStrekning} M${meterRounded}`;
    }

    metadata = {
      vegsystemreferanse,
      feltkode: FELTKODE,
      dateTime,
    };
  }

  return metadata ? (
    <div>
      <span className={classes.vegsystemreferanse}>
        {metadata.vegsystemreferanse} (F{metadata.feltkode})
      </span>
      <br />
      {metadata.dateTime.date} kl. {metadata.dateTime.time}
    </div>
  ) : null;
};

export default ImageMetadata;
