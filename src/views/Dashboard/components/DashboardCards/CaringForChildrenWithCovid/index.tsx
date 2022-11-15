import intl from 'react-intl-universal';
import { InfoCircleOutlined } from '@ant-design/icons';
import ExternalLink from '@ferlab/ui/core/components/ExternalLink';
import GridCard from '@ferlab/ui/core/view/v2/GridCard';
import { Space, Tooltip, Typography } from 'antd';

import FHIR_ICON from 'components/assets/FHIR.png';

import CardHeader from '../../CardHeader';
import { DashboardCardProps } from '..';

import styles from './index.module.scss';

const { Text } = Typography;

type TFHIR = {
  id: string;
  title: string;
  text: string;
  url: string;
  popoverText?: string;
};

const FHIR: TFHIR[] = [
  {
    id: 'kfApi',
    title: intl.get('screen.dashboard.cards.fhirDataResource.kfApi.title'),
    text: intl.get('screen.dashboard.cards.fhirDataResource.kfApi.description'),
    url: 'https://kf-api-fhir-service.kidsfirstdrc.org/metadata',
  },
  {
    id: 'caringApi',
    title: intl.getHTML('screen.dashboard.cards.fhirDataResource.caringApi.title'),
    text: intl.get('screen.dashboard.cards.fhirDataResource.caringApi.description'),
    url: 'https://kf-api-fhir-service.kidsfirstdrc.org/Patient?_total=accurate&_has:ResearchSubject:individual:study=ResearchStudy/4873',
    popoverText: intl.get('screen.dashboard.cards.fhirDataResource.caringApi.popoverText'),
  },
];

const CaringForChildrenWithCovid = ({ id, key, className = '' }: DashboardCardProps) => (
  <GridCard
    theme="shade"
    wrapperClassName={className}
    title={
      <CardHeader
        id={id}
        key={key}
        title={intl.get('screen.dashboard.cards.fhirDataResource.title')}
        infoPopover={{
          title: intl.get('screen.dashboard.cards.fhirDataResource.infoPopover.title'),
          content: (
            <Space direction="vertical" className={styles.content} size={0}>
              <Text>
                {intl.getHTML('screen.dashboard.cards.fhirDataResource.infoPopover.content')}{' '}
              </Text>
            </Space>
          ),
        }}
        withHandle
      />
    }
    content={
      <div className={styles.wrapper}>
        <img className={styles.icon} src={FHIR_ICON} alt="fhir icon" width={105} height={64} />
        <Space direction="vertical" align="center">
          {FHIR.map(({ id, url, title, text, popoverText }) => (
            <div key={id} className={styles.listItem}>
              <ExternalLink className={styles.externalLink} href={url} hasIcon={true}>
                {title}
              </ExternalLink>
              <p className={styles.text}>
                {text}
                {popoverText && (
                  <Tooltip title={popoverText}>
                    <InfoCircleOutlined className={styles.tooltipsText} />
                  </Tooltip>
                )}
              </p>
            </div>
          ))}
        </Space>
      </div>
    }
  />
);

export default CaringForChildrenWithCovid;
