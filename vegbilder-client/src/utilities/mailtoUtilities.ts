import { contactEmailTemplateText, reportEmailTemplateText } from 'constants/text';
import { IImagePoint } from 'types';
import { getShareableUrlForImage } from './urlUtilities';

const createMailtoHrefForReporting = (imagePoint: IImagePoint) => {
  const url = getShareableUrlForImage();
  const emailAddress = reportEmailTemplateText.emailAddress;
  const subject = `${reportEmailTemplateText.subject} "${imagePoint.id}"`;
  const body = `${reportEmailTemplateText.body.line1} ${url} \r\n\r\n${reportEmailTemplateText.body.line2}`;
  const mailto = `mailto:${emailAddress}?subject=${subject}&body=${encodeURIComponent(body)}`;
  return mailto;
};

const createMailtoHrefForFeedbackOrContact = () => {
  const emailAddress = contactEmailTemplateText.emailAddress;
  const subject = contactEmailTemplateText.subject;
  const mailto = `mailto:${emailAddress}?subject=${subject}`;
  return mailto;
};

export { createMailtoHrefForReporting, createMailtoHrefForFeedbackOrContact };
