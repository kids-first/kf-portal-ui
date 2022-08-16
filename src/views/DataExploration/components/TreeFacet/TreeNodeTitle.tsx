import { Col, Row, Tag } from 'antd';

import styles from './index.module.scss';

interface OwnProps {
  title: string | React.ReactNode;
  exactTagCount: number;
  totalCount: number;
}

const TreeNodeTitle = (props: OwnProps) => (
  <div className={styles.treeNodeTitle}>
    <div>{props.title}</div>
    <div style={{ minWidth: 100 }}>
      <Row>
        <Col md={12} className={styles.phenotypeTreeCountTag}>
          <Tag>{props.exactTagCount}</Tag>
        </Col>
        <Col md={12} className={styles.phenotypeTreeCountTag}>
          <Tag>{props.totalCount}</Tag>
        </Col>
      </Row>
    </div>
  </div>
);

export default TreeNodeTitle;
