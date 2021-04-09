import React, { useState } from 'react';
import { Button, List, Space } from 'antd';
import { ListProps } from 'antd/lib/list';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';

type OwnProps = ListProps<any> & {
  numWhenCollapsed?: number;
};

const DEFAULT_NUM_COLLAPSED = 5;

const ExpandableCell = ({ numWhenCollapsed, dataSource, renderItem, ...listProps }: OwnProps) => {
  const [showAll, setShowAll] = useState(false);

  const nLimit = numWhenCollapsed || DEFAULT_NUM_COLLAPSED;

  const sliceNum = showAll ? undefined : nLimit;

  const showButton = (dataSource?.length || 0) > nLimit;

  return (
    <Space direction="vertical" align={'start'}>
      <List
        dataSource={(dataSource || []).slice(0, sliceNum)}
        renderItem={renderItem}
        split={false}
        {...(listProps || {})}
      />
      {showButton && (
        <Button
          type={'link'}
          icon={showAll ? <CaretUpOutlined /> : <CaretDownOutlined />}
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? 'Less' : 'More'}
        </Button>
      )}
    </Space>
  );
};

export default ExpandableCell;
