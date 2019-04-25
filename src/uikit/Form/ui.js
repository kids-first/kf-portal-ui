import styled from 'react-emotion';
import { applyDefaultStyles } from '../Core';
import TextArea from '../TextArea';

const formText = ` 
  font-family: ${({ theme }) => theme.fonts.details};
  margin: 0;
  font-size: 14px;
  line-height: 26px;
  color: #343434;
`;

export const FormCopy = applyDefaultStyles(styled('p')`
  ${formText};
`);

export const FormLabel = applyDefaultStyles(styled('label')`
  ${formText};
`);

export const FormTextArea = applyDefaultStyles(styled(TextArea)`
  ${formText};
`);

export const FormHeading = applyDefaultStyles(styled('label')`
  font-size: 16px;
  font-weight: 500;
  color: #2b388f;
  display: block;
`);
