// Source: https://reedbarger.com/how-to-create-a-custom-usecopytoclipboard-react-hook/

import { useState } from 'react';
import copy from 'copy-to-clipboard';

const useCopyToClipboard = () => {
  const [isCopied, setCopied] = useState(false);

  const copyToClipboard = (text) => {
    if (typeof text === 'string' || typeof text == 'number') {
      copy(text.toString());
      setCopied(true);
    } else {
      setCopied(false);
      console.error(`Cannot copy typeof ${typeof text} to clipboard, must be a string or number.`);
    }
  };

  return { isCopied, copyToClipboard };
};

export default useCopyToClipboard;
