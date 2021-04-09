import React, { useState } from 'react';
import { Button, List, Space } from 'antd';
import { ListProps } from 'antd/lib/list';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';

type OwnProps = ListProps<any> & {
  nOfElementsWhenCollapsed?: number;
};

const DEFAULT_NUM_COLLAPSED = 5;

const ExpandableCell = ({
  nOfElementsWhenCollapsed = DEFAULT_NUM_COLLAPSED,
  dataSource,
  renderItem,
  ...listProps
}: OwnProps) => {
  const [showAll, setShowAll] = useState(false);
  const dataTotalLength = dataSource?.length || 0;
  const sliceNum = showAll ? dataTotalLength : nOfElementsWhenCollapsed;
  const showButton = dataTotalLength > nOfElementsWhenCollapsed;
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
