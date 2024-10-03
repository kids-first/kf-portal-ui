import intl from 'react-intl-universal';
import { useParams } from 'react-router-dom';
import EntityPage, { EntityDescriptions } from '@ferlab/ui/core/pages/EntityPage';
import { useFileEntity } from 'graphql/files/actions';
import BiospecimenTable from 'views/FileEntity/BiospecimenTable';
import ExperimentalProcedure from 'views/FileEntity/ExperimentalProcedure';
import SummaryHeader from 'views/FileEntity/SummaryHeader';
import FileEntityTitle from 'views/FileEntity/Title';
import { getLinks, SectionId } from 'views/FileEntity/utils/anchorLinks';
import getDataAccessItems from 'views/FileEntity/utils/getDataAccessItems';
import getDataTypeItems from 'views/FileEntity/utils/getDataTypeItems';
import getSummaryItems from 'views/FileEntity/utils/getSummaryItems';

import Imaging from './Imaging';

const FileEntity = () => {
  const { file_id } = useParams<{ file_id: string }>();

  const { file, loading } = useFileEntity({
    field: 'file_id',
    value: file_id ?? '',
  });

  const showImagingTable = !loading && file?.data_category === 'Imaging';

  return (
    <EntityPage
      links={getLinks(showImagingTable)}
      pageId={'file-entity-page'}
      data={file}
      loading={loading}
      emptyText={intl.get('no.data.available')}
    >
      <FileEntityTitle file={file} loading={loading} />

      <EntityDescriptions
        id={SectionId.SUMMARY}
        loading={loading}
        descriptions={getSummaryItems(file)}
        header={intl.get('entities.file.summary.title')}
        subheader={<SummaryHeader file={file} />}
      />
      <EntityDescriptions
        id={SectionId.DATA_ACCESS}
        loading={loading}
        descriptions={getDataAccessItems(file)}
        title={intl.get('entities.file.data_access.title')}
        header={intl.get('entities.file.data_access.title')}
      />
      <EntityDescriptions
        id={SectionId.DATA_TYPE}
        loading={loading}
        descriptions={getDataTypeItems(file)}
        title={intl.get('entities.file.data_type.title')}
        header={intl.get('entities.file.data_type.title')}
      />

      <BiospecimenTable file={file} loading={loading} />
      {showImagingTable ? (
        <Imaging file={file} loading={loading} />
      ) : (
        <ExperimentalProcedure file={file} loading={loading} />
      )}
    </EntityPage>
  );
};

export default FileEntity;
