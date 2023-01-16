import intl from 'react-intl-universal';
import { useParams } from 'react-router-dom';
import { IAnchorLink } from '@ferlab/ui/core/components/AnchorMenu';
import EntityPage, { EntityDescriptions, EntityTable } from '@ferlab/ui/core/pages/EntityPage';
import { IBiospecimenEntity } from 'graphql/biospecimens/models';
import { useFileEntity } from 'graphql/files/actions';

import getBiospecimensColumns from './utils/getBiospecimensColumns';
import getDataAccessItems from './utils/getDataAccessItems';
import getDataTypeItems from './utils/getDataTypeItems';
import getExperimentalProcedureItems from './utils/getExperimentalProcedureItems';
import getSummaryItems from './utils/getSummaryItems';
import SummaryHeader from './SummaryHeader';
import FileEntityTitle from './Title';

enum SectionId {
  SUMMARY = 'summary',
  DATA_ACCESS = 'data-access',
  DATA_TYPE = 'data-type',
  PARTICIPANT_SAMPLE = 'participant-sample',
  EXPERIMENTAL_PROCEDURE = 'experimental-procedure',
}

export default function FileEntity() {
  const links: IAnchorLink[] = [
    { href: `#${SectionId.SUMMARY}`, title: intl.get('entities.file.summary.title') },
    { href: `#${SectionId.DATA_ACCESS}`, title: intl.get('entities.file.data_access.title') },
    { href: `#${SectionId.DATA_TYPE}`, title: intl.get('entities.file.data_type.title') },
    {
      href: `#${SectionId.PARTICIPANT_SAMPLE}`,
      title: intl.get('entities.file.participant_sample.title'),
    },
    {
      href: `#${SectionId.EXPERIMENTAL_PROCEDURE}`,
      title: intl.get('entities.file.experimental_procedure.title'),
    },
  ];

  const { file_id } = useParams<{ file_id: string }>();

  const { data, loading } = useFileEntity({
    field: 'file_id',
    value: file_id,
  });

  const biospecimens: IBiospecimenEntity[] =
    data?.biospecimens?.hits?.edges?.map((e) => ({ key: e.node.sample_id, ...e.node })) || [];

  return (
    <EntityPage
      links={links}
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
      <EntityTable
        id={SectionId.PARTICIPANT_SAMPLE}
        loading={loading}
        data={biospecimens}
        title={intl.get('entities.file.participant_sample.title')}
        header={intl.get('entities.file.participant_sample.title')}
        columns={getBiospecimensColumns()}
        headerConfig={{
          enableTableExport: true,
          enableColumnSort: true,
        }}
      />
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
