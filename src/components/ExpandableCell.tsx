import React, { useState, ReactNode } from 'react';
import { Button } from 'antd';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import styles from './ExpandableCell.module.scss';

type OwnProps = {
  nOfElementsWhenCollapsed?: number;
  dataSource: string[] | string[][];
  renderItem?: (item: string | string[] | string[][]) => React.ReactNode;
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
  const slicedData = dataSource.slice(0, sliceNum);
  return (
    <>
      {slicedData.forEach((item: string | string[] | string[][]) => renderItem(item))}
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
