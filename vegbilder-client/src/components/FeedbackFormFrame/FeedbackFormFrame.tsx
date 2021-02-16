import React from 'react';

interface IFeedbackFormFrameProps {
  formLink: string;
}

const FeedbackFormFrame = ({ formLink }: IFeedbackFormFrameProps) => {
  const webPageHeightInPixels = document.body.offsetHeight;
  const webPageWidthInPixels = document.body.offsetWidth;
  return (
    <iframe
      title="tilbakemeldingsskjema"
      src={formLink}
      width={webPageWidthInPixels / 2}
      height={webPageHeightInPixels - 120} // iframe needs height and width in pixels.
      frameBorder="0"
      marginWidth={0}
      marginHeight={0}
      sandbox="allow-same-origin allow-scripts"
    />
  );
};

export default FeedbackFormFrame;
