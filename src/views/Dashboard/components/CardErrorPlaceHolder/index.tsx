import { Typography, Result } from 'antd';
import ExternalLink from '@ferlab/ui/core/components/ExternalLink';
import intl from 'react-intl-universal';
import {SUPPORT_EMAIL} from "store/report/thunks";

interface OwnProps {
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
}

const { Text } = Typography;

const CardErrorPlaceholder = ({ title, subTitle }: OwnProps) => (
  <Result
    status="error"
    title={title || intl.get('screen.dashboard.cards.error.title')}
    subTitle={
      subTitle || (
        <Text>
          {intl.get('screen.dashboard.cards.error.subtitle')}{' '}
          <ExternalLink href={`mailto:${SUPPORT_EMAIL}`}>
            <Text>{intl.get('screen.dashboard.cards.error.contactSupport')}</Text>
          </ExternalLink>
          .
        </Text>
      )
    }
  />
);

export default CardErrorPlaceholder;
