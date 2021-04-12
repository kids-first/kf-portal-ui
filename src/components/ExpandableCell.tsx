import React, { useState } from 'react';
import { Button, Space } from 'antd';
import { ListProps } from 'antd/lib/list';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { RecordWithTtl } from 'dns';
import styles from './ExpandableCell.module.scss';

type OwnProps = {
  nOfElementsWhenCollapsed?: number;
  dataSource: string[] | string[][];
  renderItem?: (item: string | string[]) => React.ReactNode;
};

const DEFAULT_NUM_COLLAPSED = 3;

const renderItemDefault = (item: React.ReactNode) => <span>{item}</span>;

const ExpandableCell = ({
  nOfElementsWhenCollapsed = DEFAULT_NUM_COLLAPSED,
  dataSource = [],
  renderItem = renderItemDefault,
}: OwnProps) => {
  const [showAll, setShowAll] = useState(false);
  const dataTotalLength = dataSource?.length || 0;
  const sliceNum = showAll ? dataTotalLength : nOfElementsWhenCollapsed;
  const showButton = dataTotalLength > nOfElementsWhenCollapsed;
  return (
    <>
      {dataSource.slice(0, sliceNum).map((data: any) => renderItem(data))}
      {showButton && (
        <Button
          className={styles.tableCellButton}
          type={'link'}
          icon={showAll ? <CaretUpOutlined /> : <CaretDownOutlined />}
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? 'Less' : 'More'}
        </Button>
      )}
    </>
  );
};

export default ExpandableCell;
