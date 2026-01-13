/* eslint-disable max-len */
import Icon from '@ant-design/icons';

import { IconProps } from '.';

const ListRemoveIcon = (props: IconProps) => (
  <Icon {...props}>
    <svg viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.33333 4H9.33333V5.33333H1.33333V4ZM1.33333 6.66667H9.33333V8H1.33333V6.66667ZM13.2596 9.87892L12.4111 9.03039L10.714 10.7274L9.01698 9.03039L8.16845 9.87892L9.86551 11.576L8.16845 13.273L9.01698 14.1216L10.714 12.4245L12.4111 14.1216L13.2596 13.273L11.5626 11.576L13.2596 9.87892ZM6.66666 10.6667H1.33333V9.33333H6.66666V10.6667Z"
      />
    </svg>
  </Icon>
);

ListRemoveIcon.defaultProps = {
  viewBox: '0 0 1024 1024',
};

export default ListRemoveIcon;
