import { reportEmailTemplateText } from 'constants/text';
import { getShareableUrlForImage } from './urlUtilities';

const createMailtoHrefForReporting = (imagePoint) => {
  const url = getShareableUrlForImage(imagePoint);
  const emailAddress = reportEmailTemplateText.emailAddress;
  const subject = `${reportEmailTemplateText.subject} "${imagePoint.id}"`;
  const body = `${reportEmailTemplateText.body.line1} ${url} \r\n\r\n${reportEmailTemplateText.body.line2}`;
  const mailto = `mailto:${emailAddress}?subject=${subject}&body=${encodeURIComponent(body)}`;
  return mailto;
};

export { createMailtoHrefForReporting };
