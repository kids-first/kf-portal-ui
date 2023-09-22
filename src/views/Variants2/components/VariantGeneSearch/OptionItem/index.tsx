import { Space, Typography } from 'antd';
import cx from 'classnames';

import SquareLabel from 'components/uiKit/search/GlobalSearch/SquareLabel';
import { Suggestion, SuggestionType } from 'services/api/arranger/models';

import styles from './index.module.scss';

interface OwnProps {
  type: SuggestionType;
  suggestion: Suggestion;
  value: string;
}

enum OptionLabel {
  VARIANT = 'VR',
  GENE = 'GN',
}

const OptionItem = ({ type, suggestion, value }: OwnProps) => {
  const label = type === SuggestionType.GENES ? OptionLabel.GENE : OptionLabel.VARIANT;

  return (
    <Space size={12}>
      <SquareLabel label={label} className={cx(styles.searchLabel, styles[type])} />
      <Space direction="vertical" size={0}>
        <Typography.Text className={styles.variantSearchLocus}>{value}</Typography.Text>
        {suggestion.rsnumber || suggestion.ensembl_gene_id || '--'}
      </Space>
    </Space>
  );
};

export default OptionItem;
