import React, { ReactElement, useState } from 'react';
import { Button, Table } from 'antd';
import { TableProps } from 'antd/lib/table';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';

type OwnProps = TableProps<any> & {
  nOfElementsWhenCollapsed?: number;
  buttonText: (showAll: boolean, hiddenNum: number) => ReactElement | string;
};

const DEFAULT_NUM_COLLAPSED = 5;

const ExpandableTable = ({
  buttonText,
  nOfElementsWhenCollapsed = DEFAULT_NUM_COLLAPSED,
  dataSource,
  ...tableProps
}: OwnProps) => {
  const [showAll, setShowAll] = useState(false);

  const dataTotalLength = dataSource?.length || 0;
  const sliceNum = showAll ? dataTotalLength : nOfElementsWhenCollapsed;
  const showButton = dataTotalLength > nOfElementsWhenCollapsed;
  const hiddenNum = dataTotalLength - sliceNum;

  return (
    <>
      <Table dataSource={(dataSource || []).slice(0, sliceNum)} {...tableProps} />
      {showButton && (
        <Button
          type={'link'}
          icon={showAll ? <CaretUpOutlined /> : <CaretDownOutlined />}
          onClick={() => setShowAll(!showAll)}
        >
          {buttonText(showAll, hiddenNum)}
        </Button>
      )}
    </>
  );
};

export default ExpandableTable;
