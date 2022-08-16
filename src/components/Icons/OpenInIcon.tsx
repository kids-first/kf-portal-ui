import cx from 'classnames';

import { IconProps } from '.';

const OpenInNewIcon = ({ className = '', width = 24, height = 24 }: IconProps) => (
  <svg
    className={cx('anticon', className)}
    width={width}
    height={height}
    viewBox="0 0 14 15"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.91667 3.41667V11.5833H11.0833V7.5H12.25V11.5833C12.25 12.225 11.725 12.75 11.0833 12.75H2.91667C2.26917 12.75 1.75 12.225 1.75 11.5833V3.41667C1.75 2.775 2.26917 2.25 2.91667 2.25H7V3.41667H2.91667ZM8.16667 3.41667V2.25H12.25V6.33333H11.0833V4.23917L5.34917 9.97333L4.52667 9.15083L10.2608 3.41667H8.16667Z"
    />
  </svg>
);
export default OpenInNewIcon;
