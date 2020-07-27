/* eslint-disable react/prop-types */
import { Col, Row, Tag } from 'antd';
import React, { FunctionComponent } from 'react';
import './SelectionTree.css';

interface Props {
  title: React.ReactElement | string;
  exactTagCount?: number;
  results?: number;
}

const TermCounts: FunctionComponent<Props> = ({ title, exactTagCount, results }) => (
  <Row justify="space-between" className={'fixed-width-100'}>
    <Col>{title}</Col>
    <Col className={'display-flex center-space-around'} style={{ width: 100 }}>
      <Row className={'fixed-width-100'}>
        <Col span={12} className={'flex-center'}>
          <Tag className={`label-document-count no-margins ${exactTagCount === 0 ? 'faded' : ''}`}>
            {exactTagCount || 0}
          </Tag>
        </Col>
        <Col span={12} className={'flex-center'}>
          <Tag className="label-document-count no-margins">{results || 0}</Tag>
        </Col>
      </Row>
    </Col>
  </Row>
);

export default TermCounts;
