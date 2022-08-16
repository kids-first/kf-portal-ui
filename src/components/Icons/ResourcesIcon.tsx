import cx from 'classnames';

import { IconProps } from '.';

const ResourcesIcon = ({ className = '', width = 24, height = 24 }: IconProps) => (
  <svg
    className={cx('anticon', className)}
    width={width}
    height={height}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
  >
    <path
      d="M22.4278 19.807L21.0098 14.8125V3.9375C21.0098 3.52266 20.6747 3.1875 20.2598 3.1875H3.75984C3.345 3.1875 3.00984 3.52266 3.00984 3.9375V14.8125L1.59187 19.807C1.41609 20.2969 1.77703 20.8125 2.29734 20.8125H21.7223C22.2427 20.8125 22.6036 20.2969 22.4278 19.807ZM4.69734 4.875H19.3223V14.1328H4.69734V4.875ZM10.0481 19.125L10.238 18.2578H13.7606L13.9505 19.125H10.0481ZM15.2981 19.125L14.8505 17.093C14.8317 17.0062 14.7544 16.9453 14.6677 16.9453H9.33328C9.24422 16.9453 9.16922 17.0062 9.15047 17.093L8.70281 19.125H3.53953L4.53093 15.6328H19.4887L20.4802 19.125H15.2981Z"
      fill="currentColor"
    />
  </svg>
);
export default ResourcesIcon;
