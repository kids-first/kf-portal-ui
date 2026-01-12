/* eslint-disable max-len */
import Icon from '@ant-design/icons';

import { IconProps } from '.';

const ListAddIcon = (props: IconProps) => (
  <Icon {...props}>
    <svg viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.33333 4H9.33333V5.33333H1.33333V4ZM1.33333 6.66667H9.33333V8H1.33333V6.66667ZM12 9.33333V6.66667H10.6667V9.33333H7.99999V10.6667H10.6667V13.3333H12V10.6667H14.6667V9.33333H12ZM6.66666 10.6667H1.33333V9.33333H6.66666V10.6667Z"
      />
    </svg>
  </Icon>
);

ListAddIcon.defaultProps = {
  viewBox: '0 0 1024 1024',
};

export default ListAddIcon;
