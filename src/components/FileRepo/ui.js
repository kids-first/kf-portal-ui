import * as React from 'react';
import Spinner from 'react-spinkit';

import { css } from 'emotion';

// [NEXT] beagle import moved to ./index.css
import '@kfarranger/components/public/themeStyles/beagle/beagle.css';

import Row from 'uikit/Row';
import ControlledAccessIcon from 'icons/ControlledAccessIcon';

import { flexCenter } from 'theme/tempTheme.module.css';
import './FileRepo.css';

export const ControlledIcon = ({ className = '', ...props }) => (
  <ControlledAccessIcon {...props} className={`controlledAccessIcon ${className}`} />
);

export const SaveShareButtonContainer = ({ style = {}, children, ...props }) => (
  <Row className={flexCenter} style={{ padding: '10px 5px', ...style }} {...props}>
    {children}
  </Row>
);

export const OpenIcon = () => (
  <img
    src={require('../../assets/icon-open-access.svg')}
    alt=""
    style={{
      width: '10px',
      margin: 'auto',
      display: 'block',
    }}
  />
);

export const TableSpinner = ({ props, style = {} }) => (
  <Spinner
    fadeIn="none"
    name="circle"
    color="#a9adc0"
    style={{ width: 50, height: 60, ...style }}
    {...props}
  />
);

// const StyledActionButton = styled(TealActionButton)`
//   justify-content: flex-start;
//   color: ${({ theme, disabled }) => (disabled ? theme.white : 'auto')};
//   background: ${({ theme, disabled }) => (disabled ? theme.greyScale8 : theme.lightBlue)};
//   width: 100%;
//   &:hover {
//     background-color: ${({ theme, disabled }) => (disabled ? theme.greyScale8 : theme.tertiary)};
//   }
//   padding: 0px 10px;
//   margin-top: 3px;
//   font-size: 11px;
// `;

export const cavaticaCopyButtonStyle = props => css`
  justify-content: flex-start;
  margin-top: 3px;
  font-size: 11px;
  & img {
    width: 20px;
  }
`;

// export const DownloadButton = ({
//   onClick,
//   content = () => 'Download',
//   buttonRef = React.createRef(),
//   disabled = false,
//   onBlur = noop,
// }) => {
//   return (
//     <StyledActionButton
//       className="downloadButtonWrapper"
//       onClick={onClick}
//       innerRef={ref => {
//         buttonRef.current = ref;
//       }}
//       disabled={disabled}
//       onBlur={onBlur}
//     >
//       <DownloadIcon
//         className={css`
//           height: 28px;
//           margin-right: 9px;
//         `}
//       />
//       <span style={{ textTransform: 'uppercase' }}>{content()}</span>
//     </StyledActionButton>
//   );
// };
