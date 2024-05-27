import { useState } from 'react';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { ApiOutlined, RocketOutlined } from '@ant-design/icons';
import ExternalLink from '@ferlab/ui/core/components/ExternalLink';
import PopoverContentLink from '@ferlab/ui/core/components/PopoverContentLink';
import { IFenceService } from '@ferlab/ui/core/components/Widgets/AuthorizedStudies';
import FencesAuthentificationModal from '@ferlab/ui/core/components/Widgets/AuthorizedStudies/FencesAuthentificationModal';
import GridCard from '@ferlab/ui/core/view/v2/GridCard';
import { Alert, Button, Space, Typography } from 'antd';
import CardHeader from 'views/Dashboard/components/CardHeader';
import { DashboardCardProps } from 'views/Dashboard/components/DashboardCards';

import { FENCE_NAMES } from 'common/fenceTypes';
import logo from 'components/assets/jupyterLab.png';
import KidsFirstLoginIcon from 'components/Icons/KidsFirstLoginIcon';
import NciIcon from 'components/Icons/NciIcon';
import { useAtLeastOneFenceConnected, useFenceAuthentification } from 'store/fences';
import { fenceDisconnection, fenceOpenAuhentificationTab } from 'store/fences/thunks';
import { useNotebook } from 'store/notebook';
import { getNotebookClusterManifest } from 'store/notebook/thunks';

import { trackVariantWorkbench } from '../../../../../services/analytics';

import styles from './index.module.scss';
const { Text } = Typography;

const Notebook = ({ id, key, className = '' }: DashboardCardProps) => {
  const dispatch = useDispatch();
  const gen3 = useFenceAuthentification(FENCE_NAMES.gen3);
  const dcf = useFenceAuthentification(FENCE_NAMES.dcf);
  const services: IFenceService[] = [
    {
      fence: FENCE_NAMES.gen3,
      name: 'Kids First Framework Services',
      icon: <KidsFirstLoginIcon width={45} height={45} />,
      onConnectToFence: () => {
        dispatch(fenceOpenAuhentificationTab(FENCE_NAMES.gen3));
      },
      onDisconnectFromFence: () => {
        dispatch(fenceDisconnection(FENCE_NAMES.gen3));
      },
    },
    {
      fence: FENCE_NAMES.dcf,
      name: 'NCI CRDC Framework Services',
      icon: <NciIcon width={45} height={45} />,
      onConnectToFence: () => {
        dispatch(fenceOpenAuhentificationTab(FENCE_NAMES.dcf));
      },
      onDisconnectFromFence: () => {
        dispatch(fenceDisconnection(FENCE_NAMES.dcf));
      },
    },
  ];
  const [isFenceModalAuthentificationOpen, setIsFenceModalAuthentificationOpen] =
    useState<boolean>(false);
  const { isLoading, error } = useNotebook();
  const onCloseFenceAuthentificationModal = () => {
    setIsFenceModalAuthentificationOpen(false);
    if (hasAtLeastOneAuthentificatedFence) {
      handleGetManifest();
    }
  };

  const hasAtLeastOneAuthentificatedFence = useAtLeastOneFenceConnected();

  const isProcessing = isLoading && !error;

  const handleGetManifest = () => {
    dispatch(getNotebookClusterManifest());
  };

  return (
    <>
      <FencesAuthentificationModal
        open={isFenceModalAuthentificationOpen}
        onCancel={onCloseFenceAuthentificationModal}
        onOk={onCloseFenceAuthentificationModal}
        fences={[gen3, dcf]}
        services={services}
        dictionary={{
          title: intl.get('screen.dashboard.cards.authorizedStudies.modal.title'),
          close: intl.get('global.close'),
          description: intl.get('screen.dashboard.cards.authorizedStudies.modal.description'),
          error: intl.get('screen.dashboard.cards.authorizedStudies.modal.error'),
        }}
      />
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
                      className={styles.tooltipLinkRight}
                      externalHref="https://docs.cavatica.org/docs/about-data-cruncher"
                      title={intl.get('screen.dashboard.cards.notebook.dataStudio')}
                    />
                    {intl.get('screen.dashboard.cards.notebook.tooltip.part2')}
                  </Text>
                  <Text>{intl.get('screen.dashboard.cards.notebook.tooltip.part3')}</Text>
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
              </Text>
              {!hasAtLeastOneAuthentificatedFence && (
                <Button
                  type="primary"
                  size="small"
                  icon={<ApiOutlined />}
                  onClick={() => {
                    trackVariantWorkbench('Connect');
                    setIsFenceModalAuthentificationOpen(true);
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
