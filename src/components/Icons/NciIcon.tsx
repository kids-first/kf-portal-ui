import cx from 'classnames';

import { IconProps } from '.';

const NciIcon = ({ className = '', width = 24, height = 24 }: IconProps) => (
  <svg
    className={cx('anticon', className)}
    width={width}
    height={height}
    viewBox="0 0 46 46"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
  >
    <g mask="url(#mask0_79_3600)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M45.1748 23C45.1748 35.247 35.2468 45.175 22.9998 45.175C10.7528 45.175 0.824829 35.247 0.824829 23C0.824829 10.753 10.7528 0.825043 22.9998 0.825043C35.2468 0.825043 45.1748 10.753 45.1748 23Z"
        fill="#323E77"
      />
    </g>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M24.4864 13.125L12.7084 24.903C12.0734 25.537 11.0354 25.537 10.4014 24.903L9.52944 24.031C8.89444 23.396 8.89444 22.358 9.52944 21.724L21.3064 9.94504C21.9414 9.31204 22.9794 9.31204 23.6144 9.94504L24.4864 10.818C25.1204 11.452 25.1204 12.49 24.4864 13.125Z"
      fill="white"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M21.8125 36.4707L10.0355 24.6937C9.40055 24.0587 9.40055 23.0207 10.0355 22.3857L10.9075 21.5137C11.5415 20.8797 12.5795 20.8797 13.2135 21.5137L24.9925 33.2917C25.6265 33.9267 25.6265 34.9647 24.9925 35.5987L24.1205 36.4707C23.4855 37.1057 22.4475 37.1057 21.8125 36.4707Z"
      fill="#00ACE7"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M36.4717 24.2754L24.6937 36.0534C24.0587 36.6884 23.0207 36.6884 22.3857 36.0534L21.5137 35.1814C20.8797 34.5474 20.8797 33.5094 21.5137 32.8754L33.2917 21.0964C33.9267 20.4624 34.9647 20.4624 35.5997 21.0964L36.4717 21.9684C37.1057 22.6034 37.1057 23.6414 36.4717 24.2754Z"
      fill="#C7CAC7"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M32.6533 24.4854L20.8753 12.7084C20.2413 12.0734 20.2413 11.0354 20.8753 10.4004L21.7473 9.52845C22.3823 8.89445 23.4203 8.89445 24.0543 9.52845L35.8333 21.3064C36.4663 21.9414 36.4663 22.9794 35.8333 23.6134L34.9613 24.4854C34.3263 25.1204 33.2883 25.1204 32.6533 24.4854Z"
      fill="#00ABA2"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18.0284 19.583C16.2551 21.3564 12.9191 18.3338 14.6139 16.6387C16.1012 15.1512 18.332 12.92 21.3064 9.94504C21.9414 9.31204 22.9794 9.31204 23.6144 9.94504L24.4864 10.818C25.1204 11.452 25.1204 12.49 24.4864 13.125C21.6162 15.9953 19.4635 18.1479 18.0284 19.583Z"
      fill="white"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M21.4471 24.5539H24.5541V21.4469H21.4471V24.5539Z"
      fill="white"
    />
  </svg>
);
export default NciIcon;