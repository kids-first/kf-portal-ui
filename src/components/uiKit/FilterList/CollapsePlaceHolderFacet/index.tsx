import { Collapse } from 'antd';
import cx from 'classnames';

import styles from './index.module.css';

interface OwnProps {
  className?: string;
  onClick?: (e: any) => void;
  title: string;
}

const CollapsePlaceHolderFacet = ({ onClick = () => {}, title, className = '' }: OwnProps) => (
  <div onClick={onClick} className={cx(styles.collapseLikeFacet, className)}>
    <Collapse className={styles.collapse}>
      <Collapse.Panel collapsible="disabled" header={title} key="1"></Collapse.Panel>
    </Collapse>
  </div>
);

export default CollapsePlaceHolderFacet;
