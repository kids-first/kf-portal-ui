import intl from 'react-intl-universal';
import { TABLE_EMPTY_PLACE_HOLDER } from '@ferlab/ui/core/common/constants';
import CanonicalIcon from '@ferlab/ui/core/components/Icons/CanonicalIcon';
import ManePlusIcon from '@ferlab/ui/core/components/Icons/ManePlusIcon';
import ManeSelectIcon from '@ferlab/ui/core/components/Icons/ManeSelectIcon';
import { Space, Tooltip } from 'antd';
import { IConsequenceEntity } from 'graphql/variants/models';

import style from './index.module.scss';

interface OwnProps {
  consequence: IConsequenceEntity;
}

const ManeCell = ({ consequence }: OwnProps) => {
  const { mane_select, canonical, mane_plus } = consequence;
  const haveResult = mane_select || canonical || mane_plus;
  return haveResult ? (
    <Space size={4} className={style.maneIcons}>
      {canonical && (
        <Tooltip title={intl.get('screen.variants.table.canonical')}>
          <div>
            <CanonicalIcon className={style.canonicalIcon} height={16} width={16} />
          </div>
        </Tooltip>
      )}
      {mane_select && (
        <Tooltip title={intl.get('screen.variants.table.maneSelect')}>
          <div>
            <ManeSelectIcon className={style.canonicalIcon} height={16} width={16} />
          </div>
        </Tooltip>
      )}
      {mane_plus && (
        <Tooltip title={intl.get('screen.variants.table.manePlus')}>
          <div>
            <ManePlusIcon className={style.canonicalIcon} height={16} width={16} />
          </div>
        </Tooltip>
      )}
    </Space>
  ) : (
    <>{TABLE_EMPTY_PLACE_HOLDER}</>
  );
};
export default ManeCell;
