import { Button, Card, Col, Row, Space } from 'antd';

import style from './index.module.scss';
import GeneBanner from '../VariantBanner/GeneBanner';
import { toNodes } from 'graphql/utils/helpers';

const VariantSummary = () => {
  return (
    <Card className={style.card}>
      <Space className={style.space} direction="vertical" size={'middle'}>
        <div className={style.bannerWrapper}>
          <div>
            <div>title</div>
            <div>value value value</div>
          </div>
          <div>
            <div>title</div>
            <div>value value value</div>
          </div>
          <div>
            <div>title</div>
            <div>value value value</div>
          </div>
          <div>
            <div>title</div>
            <div>value value value</div>
          </div>
          <div>
            <div>title</div>
            <div>value value value</div>
          </div>
        </div>

        <div className={style.infoWrapper}>
          <div>
            <span>title title title title</span>
          </div>
          <div>
            <span>title</span>
          </div>
          <div>
            <span>title</span>
          </div>
          <div>
            <span>title</span>
          </div>
          <div>
            <span>title</span>
          </div>
        </div>

        <div className={style.detailsWrapper}>
          <div className={style.score}>functional score</div>
          <div className={style.geneSplice}>
            <div>gene constraints</div>
            <div>splice altering</div>
          </div>
          <div className={style.omim}>OMIM</div>
        </div>
      </Space>
    </Card>
  );
};

export default VariantSummary;
