import intl from 'react-intl-universal';
import { useParams } from 'react-router';
import { Button, Result } from 'antd';
import { ExceptionStatusType } from 'antd/lib/result';

import { STATIC_ROUTES } from 'utils/routes';

import styles from './index.module.css';

const getResultProps = (
  status: ExceptionStatusType,
): {
  status: ExceptionStatusType;
  title: string;
  subTitle: string;
} => {
  switch (status.toString()) {
    case '403':
      return {
        status: '403',
        title: '403',
        subTitle: intl.get('global.errors.403'),
      };
    case '404':
      return {
        status: '404',
        title: '404',
        subTitle: intl.get('global.errors.404'),
      };
    default:
      return {
        status: '500',
        title: '500',
        subTitle: intl.get('global.errors.500'),
      };
  }
};

const ErrorPage = () => {
  const { status } = useParams();

  return (
    <Result
      className={styles.errorPage}
      {...getResultProps((status as ExceptionStatusType) || '500')}
      extra={
        <Button type="primary" onClick={() => (window.location.href = STATIC_ROUTES.HOME)}>
          {intl.get('global.errors.backHome')}
        </Button>
      }
    />
  );
};

export default ErrorPage;
