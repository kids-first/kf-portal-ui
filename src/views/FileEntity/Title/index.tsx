import React from 'react';
import intl from 'react-intl-universal';
import { FileTextOutlined, LockOutlined, UnlockFilled, WarningOutlined } from '@ant-design/icons';
import PopoverContentLink from '@ferlab/ui/core/components/PopoverContentLink';
import { FENCE_AUTHENTIFICATION_STATUS } from '@ferlab/ui/core/components/Widgets/AuthorizedStudies';
import { PASSPORT_AUTHENTIFICATION_STATUS } from '@ferlab/ui/core/components/Widgets/Cavatica/type';
import { generateQuery, generateValueFilter } from '@ferlab/ui/core/data/sqon/utils';
import { EntityTitle } from '@ferlab/ui/core/pages/EntityPage';
import { Button, Popover, Space } from 'antd';
import { INDEXES } from 'graphql/constants';
import { FileAccessType, IFileEntity } from 'graphql/files/models';
import { DATA_FILES_SAVED_SETS_FIELD } from 'views/DataExploration/utils/constant';

import { FENCE_NAMES } from 'common/fenceTypes';
import CavaticaAnalyzeButton from 'components/Cavatica/AnalyzeButton';
import DownloadFileManifestModal from 'components/uiKit/reports/DownloadFileManifestModal';
import { useAllFencesAcl, useFenceAuthentification } from 'store/fences';
import { useCavaticaPassport } from 'store/passport';
import { userHasAccessToFile } from 'utils/dataFiles';

import styles from './index.module.css';

interface OwnProps {
  file?: IFileEntity;
  loading?: boolean;
}

const FileEntityTitle: React.FC<OwnProps> = ({ file, loading }) => {
  const fencesAllAcls = useAllFencesAcl();
  const cavatica = useCavaticaPassport();
  const gen3 = useFenceAuthentification(FENCE_NAMES.gen3);
  const hasFamily = file?.participants?.hits?.edges?.some((e) => e.node.families_id);

  console.log('====Debug==== + The File: ', file);
  const hasAccess = file
    ? userHasAccessToFile(
        file,
        fencesAllAcls,
        cavatica.authentification.status === PASSPORT_AUTHENTIFICATION_STATUS.connected,
        gen3.status === FENCE_AUTHENTIFICATION_STATUS.connected,
      )
    : false;

  console.log('====Debug==== + Has access: ', hasAccess);

  const generateSqonForFile = (): any =>
    generateQuery({
      newFilters: [
        generateValueFilter({
          field: DATA_FILES_SAVED_SETS_FIELD,
          index: INDEXES.FILE,
          value: file ? [file.file_id] : [],
        }),
      ],
    });

  const handleRedirect = (flywheel_url: string | undefined) => {
    window.open(flywheel_url, '_blank');
  };

  const renderTag = () => {
    console.log(
      '====Debug==== + Render Icon + is Controlled: ',
      file?.controlled_access.toLowerCase() === FileAccessType.CONTROLLED.toLowerCase(),
    );
    console.log(
      '====Debug==== + Render Icon + starts with cavatica ga4gh url: ',
      file?.access_urls?.startsWith('drs://cavatica-ga4gh-api.sbgenomics.com/'),
    );
    if (
      file?.controlled_access.toLowerCase() === FileAccessType.CONTROLLED.toLowerCase() &&
      file?.access_urls?.startsWith('drs://cavatica-ga4gh-api.sbgenomics.com/')
    ) {
      console.log('====Debug==== + Render Icon of Warning');
      return (
        <Popover
          placement="bottom"
          overlayStyle={{ maxWidth: '420px' }}
          title={intl.get(
            'screen.dataExploration.tabs.datafiles.undeterminedAuthorization.popoverTitle',
          )}
          content={intl.getHTML(
            'screen.dataExploration.tabs.datafiles.undeterminedAuthorization.popoverContent',
            {
              href: 'https://kidsfirstdrc.org/help-center/accessing-controlled-data-via-dbgap/',
            },
          )}
        >
          <WarningOutlined className={styles.authorizedUndetermined} />
        </Popover>
      );
    } else if (hasAccess) {
      console.log('====Debug==== + Render Icon of Access');
      return (
        <Popover
          placement="bottom"
          overlayClassName={styles.popOverContent}
          title={intl.get('entities.file.fileAuthorization')}
          content={intl.get('entities.file.unlocked')}
        >
          <UnlockFilled className={styles.unlocked} />
        </Popover>
      );
    } else {
      console.log('====Debug==== + Render Icon of No Access');
      return (
        <Popover
          overlayClassName={styles.popOverContent}
          title={intl.get('entities.file.fileAuthorization')}
          content={
            <span>
              {intl.get('entities.file.locked')}
              <PopoverContentLink
                className={styles.contentLink}
                externalHref="https://d3b.notion.site/Applying-for-Access-ffed3a85b29741388b30a1ad0687003f"
                title={intl.get('entities.file.fileReadMore')}
              />
            </span>
          }
        >
          <LockOutlined className={styles.locked} />
        </Popover>
      );
    }
  };

  const title = {
    text: file?.file_id,
    icon: <FileTextOutlined />,
    tag: renderTag(),
    extra: (
      <Space>
        <DownloadFileManifestModal
          key="file-entity-manifest"
          sqon={generateSqonForFile()}
          isDisabled={false}
          hasTooManyFiles={false}
          hasFamily={hasFamily}
        />
        {file?.flywheel_url && (
          <Button onClick={() => handleRedirect(file.flywheel_url)}>
            {intl.get('entities.file.open_flywheel')}
          </Button>
        )}
        {file && (
          <CavaticaAnalyzeButton type="primary" fileIds={[file.file_id]} index={INDEXES.FILE} />
        )}
      </Space>
    ),
  };

  return <EntityTitle {...title} loading={loading} />;
};

export default FileEntityTitle;
