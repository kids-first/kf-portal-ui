import { useEffect } from 'react';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { ApiOutlined, RocketOutlined } from '@ant-design/icons';
import ExternalLink from '@ferlab/ui/core/components/ExternalLink';
import PopoverContentLink from '@ferlab/ui/core/components/PopoverContentLink';
import GridCard from '@ferlab/ui/core/view/v2/GridCard';
import { Alert, Button, Space, Typography } from 'antd';
import CardHeader from 'views/Dashboard/components/CardHeader';
import { DashboardCardProps } from 'views/Dashboard/components/DashboardCards';

import { FENCE_NAMES } from 'common/fenceTypes';
import logo from 'components/assets/jupyterLab.png';
import { useAtLeastOneFenceConnected, useFenceAuthentification } from 'store/fences';
import { fenceOpenAuhentificationTab } from 'store/fences/thunks';
import { useNotebook } from 'store/notebook';
import { getNotebookClusterManifest } from 'store/notebook/thunks';

import { trackVariantWorkbench } from '../../../../../services/analytics';

import styles from './index.module.css';
const { Text } = Typography;

const Notebook = ({ id, key, className = '' }: DashboardCardProps) => {
  const dispatch = useDispatch();
  const dcf = useFenceAuthentification(FENCE_NAMES.dcf);
  const { isLoading, error } = useNotebook();

  const hasAtLeastOneAuthentificatedFence = useAtLeastOneFenceConnected();

  const isProcessing = isLoading && !error;

  const handleGetManifest = () => {
    dispatch(getNotebookClusterManifest());
  };

  useEffect(() => {
    if (dcf.status && hasAtLeastOneAuthentificatedFence) {
      // No-op for now; user can click Launch after connecting
    }
  }, [dcf.status, hasAtLeastOneAuthentificatedFence]);

  return (
    <>
      <GridCard
        theme="shade"
        wrapperClassName={className}
        title={
          <CardHeader
            id={id}
            key={key}
            title={intl.get('screen.dashboard.cards.notebook.title')}
            infoPopover={{
              title: intl.get('screen.dashboard.cards.notebook.tooltip.title'),
              content: (
                <Space direction="vertical" className={styles.content}>
                  <Text>
                    {intl.get('screen.dashboard.cards.notebook.tooltip.part1')}
                    <PopoverContentLink
                      className={styles.link}
                      externalHref="https://docs.cavatica.org/docs/about-data-cruncher"
                      title={intl.get('screen.dashboard.cards.notebook.dataStudio')}
                    />
                    {intl.get('screen.dashboard.cards.notebook.tooltip.part2')}
                    <PopoverContentLink
                      className={styles.link}
                      externalHref="https://cavatica.sbgenomics.com/u/sevenbridges/kids-first-variant-workbench"
                      title={intl.get('screen.dashboard.cards.notebook.publicProject')}
                    />
                    {intl.get('screen.dashboard.cards.notebook.tooltip.part3')}
                  </Text>
                  <Text>{intl.get('screen.dashboard.cards.notebook.tooltip.part4')}</Text>
                  <Text>
                    {intl.get('screen.dashboard.cards.notebook.tooltip.readMore')}
                    <PopoverContentLink
                      className={styles.tooltipLinkLeft}
                      externalHref="https://kidsfirstdrc.org/help-center/accessing-controlled-data-via-dbgap/"
                      title={intl.get(
                        'screen.dashboard.cards.notebook.tooltip.applyingForDataAccess',
                      )}
                    />
                    .
                  </Text>
                </Space>
              ),
            }}
            withHandle
          />
        }
        content={
          <div className={styles.wrapper}>
            <Space className={styles.textCentered} align="center" direction="vertical" size={16}>
              <div>
                <img src={logo} alt="Appache-Zeppelin-Logo" width={125} />
              </div>
              <Text>
                {intl.get('screen.dashboard.cards.notebook.description.part1')}
                <ExternalLink
                  href="https://docs.cavatica.org/docs/about-data-cruncher"
                  className={styles.link}
                >
                  {intl.get('screen.dashboard.cards.notebook.dataStudio')}
                </ExternalLink>
                {intl.get('screen.dashboard.cards.notebook.description.part2')}
                <ExternalLink
                  href="https://cavatica.sbgenomics.com/u/sevenbridges/kids-first-variant-workbench"
                  className={styles.link}
                >
                  {intl.get('screen.dashboard.cards.notebook.publicProject')}
                </ExternalLink>
                {intl.get('screen.dashboard.cards.notebook.description.part3')}
              </Text>
              {!hasAtLeastOneAuthentificatedFence && (
                <Button
                  type="primary"
                  size="small"
                  icon={<ApiOutlined />}
                  onClick={() => {
                    trackVariantWorkbench('Connect');
                    dispatch(fenceOpenAuhentificationTab(FENCE_NAMES.dcf));
                  }}
                >
                  {intl.get('global.connect')}
                </Button>
              )}

              {hasAtLeastOneAuthentificatedFence && (
                <Button
                  loading={isProcessing}
                  type="primary"
                  size="small"
                  icon={<RocketOutlined width={11} height={14} />}
                  onClick={() => {
                    trackVariantWorkbench('Launch');
                    handleGetManifest();
                  }}
                >
                  {intl.get('screen.dashboard.cards.notebook.launch')}
                </Button>
              )}
            </Space>

            <Space className={styles.message} size={8} direction="vertical">
              {isProcessing && (
                <Text className={styles.message} disabled>
                  {intl.get('screen.dashboard.cards.notebook.wait')}
                </Text>
              )}

              {error && (
                <Alert
                  type="error"
                  message={<>{intl.getHTML('screen.dashboard.cards.notebook.contactSupport')}</>}
                />
              )}
            </Space>
          </div>
        }
      />
    </>
  );
};

export default Notebook;
