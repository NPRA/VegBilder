import React from 'react';

interface IFeedbackFormFrameProps {
  formLink: string;
}

const FeedbackFormFrame = ({ formLink }: IFeedbackFormFrameProps) => {
  const webPageHeightInPixels = document.documentElement.clientHeight;
  const webPageWidthInPixels = document.documentElement.clientWidth;

  const offset = webPageHeightInPixels * 0.3;

  return (
    <iframe
      title="tilbakemeldingsskjema"
      src={formLink}
      width={webPageWidthInPixels / 2.5}
      height={webPageHeightInPixels - offset} // iframe needs height and width in pixels.
      frameBorder="0"
      marginWidth={0}
      marginHeight={0}
      sandbox="allow-same-origin allow-scripts"
      style={{ alignSelf: 'center' }}
    />
  );
};

export default FeedbackFormFrame;
