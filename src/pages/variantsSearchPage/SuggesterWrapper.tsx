import React from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import { Col, Row, Tooltip } from 'antd';

import style from './SuggesterWrapper.module.scss';

type SuggesterWrapperProps = {
  children: React.ReactNode;
  tooltipMessage: string;
  title: string;
};

const SuggesterWrapper = (props: SuggesterWrapperProps) => {
  const { children, tooltipMessage, title } = props;

  return (
    <StackLayout vertical className={style.autoCompleteContainer} fitContent>
      <div id={'anchor-search-bar'}>
        <Row gutter={5}>
          <Col>
            <div className={style.searchTitle}>{title}</div>
          </Col>
          <Col>
            <Tooltip
              align={{
                offset: [-12],
              }}
              placement="topLeft"
              title={tooltipMessage}
            >
              <InfoCircleOutlined className={style.searchIconsDisabled} />
            </Tooltip>
          </Col>
        </Row>
        {children}
      </div>
    </StackLayout>
  );
};

export default SuggesterWrapper;
