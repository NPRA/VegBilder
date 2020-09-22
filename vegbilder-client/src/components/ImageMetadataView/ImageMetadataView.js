import React from "react";
import { Container, Statistic } from "semantic-ui-react";
import { splitDateTimeString } from "../../utilities/dateTimeUtilities";

const ImageMetadataView = ({ currentImagePoint }) => {
  let roadMetadata = [];
  let timeMetadata = [];
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
    const { date, time } = splitDateTimeString(TIDSPUNKT);
    const vegOgStrekning = `${VEGKATEGORI}${VEGSTATUS}${VEGNUMMER} S${STREKNING}D${DELSTREKNING}`;
    let vegsystemreferanse;
    if (KRYSSDEL) {
      vegsystemreferanse = `${vegOgStrekning} M${ANKERPUNKT} KD${KRYSSDEL} m${meterRounded}`;
    } else if (SIDEANLEGGSDEL) {
      vegsystemreferanse = `${vegOgStrekning} M${ANKERPUNKT} KD${KRYSSDEL} m${meterRounded}`;
    } else {
      vegsystemreferanse = `${vegOgStrekning} M${meterRounded}`;
    }

    roadMetadata = [
      {
        key: "vegsystemreferanse",
        label: "Vegsystemreferanse",
        value: `${vegsystemreferanse}`,
      },
      { key: "felt", label: "Felt", value: FELTKODE },
    ];
    timeMetadata = [
      { key: "dato", label: "Dato", value: date },
      { key: "tidspunkt", label: "Tidspunkt", value: time },
    ];
  }

  return (
    <Container>
      <Statistic.Group items={roadMetadata} />
      <Statistic.Group items={timeMetadata} />
    </Container>
  );
};

export default ImageMetadataView;
