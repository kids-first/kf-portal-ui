import ExternalLink from '@ferlab/ui/core/components/ExternalLink';
import { Button, ButtonProps } from 'antd';
import { Link, LinkProps } from 'react-router-dom';

import styles from './index.module.scss';

type OwnProps = Omit<LinkProps, 'to'> & {
  title: string;
  externalHref?: string;
  to?: any;
};

const buttonProps: ButtonProps = {
  type: 'link',
  size: 'small',
  className: styles.popoverContentLink,
};

const PopoverContentLink = ({ title, externalHref, to, ...linkProps }: OwnProps) =>
  externalHref ? (
    <ExternalLink href={externalHref}>
      <Button {...buttonProps}>{title}</Button>
    </ExternalLink>
  ) : (
    <Link to={to} {...linkProps}>
      <Button {...buttonProps}>{title}</Button>
    </Link>
  );

export default PopoverContentLink;
