import intl from 'react-intl-universal';
import { useParams } from 'react-router-dom';
import EntityPage, { EntityDescriptions } from '@ferlab/ui/core/pages/EntityPage';
import { useFileEntity } from 'graphql/files/actions';

import getDataAccessItems from './utils/getDataAccessItems';
import getDataTypeItems from './utils/getDataTypeItems';
import getExperimentalProcedureItems from './utils/getExperimentalProcedureItems';
import getLinks from './utils/getLinks';
import getSummaryItems from './utils/getSummaryItems';
import BiospecimenTable from './BiospecimenTable';
import SummaryHeader from './SummaryHeader';
import FileEntityTitle from './Title';

export enum SectionId {
  SUMMARY = 'summary',
  DATA_ACCESS = 'data-access',
  DATA_TYPE = 'data-type',
  PARTICIPANT_SAMPLE = 'participant-sample',
  EXPERIMENTAL_PROCEDURE = 'experimental-procedure',
}

export default function FileEntity() {
  const { file_id } = useParams<{ file_id: string }>();

  const { data, loading } = useFileEntity({
    field: 'file_id',
    value: file_id,
  });

  return (
    <EntityPage
      links={getLinks()}
      pageId={'file-entity-page'}
      data={data}
      loading={loading}
      emptyText={intl.get('no.data.available')}
    >
      <FileEntityTitle file={data} loading={loading} />

      <EntityDescriptions
        id={SectionId.SUMMARY}
        loading={loading}
        descriptions={getSummaryItems(data)}
        header={intl.get('entities.file.summary.title')}
        subheader={<SummaryHeader file={data} />}
      />
      <EntityDescriptions
        id={SectionId.DATA_ACCESS}
        loading={loading}
        descriptions={getDataAccessItems(data)}
        title={intl.get('entities.file.data_access.title')}
        header={intl.get('entities.file.data_access.title')}
      />
      <EntityDescriptions
        id={SectionId.DATA_TYPE}
        loading={loading}
        descriptions={getDataTypeItems(data)}
        title={intl.get('entities.file.data_type.title')}
        header={intl.get('entities.file.data_type.title')}
      />

      <BiospecimenTable data={data} loading={loading} />

      <EntityDescriptions
        id={SectionId.EXPERIMENTAL_PROCEDURE}
        loading={loading}
        descriptions={getExperimentalProcedureItems(data)}
        title={intl.get('entities.file.experimental_procedure.title')}
        header={intl.get('entities.file.experimental_procedure.title')}
      />
    </EntityPage>
  );
}
