import intl from 'react-intl-universal';

import { TABLE_EMPTY_PLACE_HOLDER } from 'common/constants';
import { readableDistanceByDays } from 'utils/dates';
import { isNumber } from 'utils/helper';

import styles from './index.module.css';

interface OwnProps {
  ageInDays?: number;
}

const AgeCell = ({ ageInDays }: OwnProps) => {
  if (isNumber(ageInDays)) {
    const { years, days } = readableDistanceByDays(ageInDays as number);

    return (
      <>
        {years > 0 && `${years} `}
        <span className={styles.timeUnitText}>{intl.get('date.years', { years })}</span>
        {` ${days} `}
        <span className={styles.timeUnitText}>{intl.get('date.days', { days })}</span>{' '}
      </>
    );
  }
  return <>{TABLE_EMPTY_PLACE_HOLDER}</>;
};

export default AgeCell;
