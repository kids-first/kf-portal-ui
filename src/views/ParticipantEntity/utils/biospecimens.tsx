import { TABLE_EMPTY_PLACE_HOLDER } from '@ferlab/ui/core/common/constants';
import ExternalLink from '@ferlab/ui/core/components/ExternalLink';
import { ProColumnType } from '@ferlab/ui/core/components/ProTable/types';

import { readableDistanceByDays } from 'utils/dates';

export const getBiospecimensDefaultColumns = (): ProColumnType[] => [
  {
    key: 'sample_id',
    title: 'Sample ID',
    dataIndex: 'sample_id',
    render: (sample_id: string) => sample_id || TABLE_EMPTY_PLACE_HOLDER,
  },
  // @TODO: Add biospecimen ID
  {
    key: '',
    title: 'Biospecimen ID',
    dataIndex: '',
    render: () => TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'sample_type',
    title: 'Sample Type',
    dataIndex: 'sample_type',
    render: (sample_type: string) => sample_type || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'age_at_biospecimen_collection',
    title: 'Age',
    tooltip: 'Age at Biospecimen Collection',
    dataIndex: 'age_at_biospecimen_collection',
    render: (age_at_biospecimen_collection) =>
      age_at_biospecimen_collection
        ? readableDistanceByDays(age_at_biospecimen_collection)
        : TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'anatomy_site',
    title: 'Anatomical Site (NCIT)',
    defaultHidden: true,
    dataIndex: 'anatomy_site',
    render: (anatomy_site) =>
      anatomy_site ? (
        <ExternalLink
          // eslint-disable-next-line max-len
          href={`https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=22.07d&ns=ncit&code=${anatomy_site}`}
        >
          {anatomy_site}
        </ExternalLink>
      ) : (
        TABLE_EMPTY_PLACE_HOLDER
      ),
  },
  {
    key: 'ncit_anatomy_site_id',
    title: 'Anatomical Site (Source Text)',
    defaultHidden: true,
    dataIndex: 'ncit_anatomy_site_id',
    render: (ncit_anatomy_site_id) => ncit_anatomy_site_id || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'ncit_id_tissue_type',
    title: 'Tissue Type (NCIT)',
    dataIndex: 'ncit_id_tissue_type',
    defaultHidden: true,
    render: (ncit_id_tissue_type) => ncit_id_tissue_type || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'tissue_type_source_text',
    title: 'Tissue Type (Source Text)',
    dataIndex: 'tissue_type_source_text',
    defaultHidden: true,
    render: (tissue_type_source_text) =>
      tissue_type_source_text ? (
        <ExternalLink
          href={`https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCIThesaurus&code=${tissue_type_source_text}`}
        >
          {tissue_type_source_text}
        </ExternalLink>
      ) : (
        TABLE_EMPTY_PLACE_HOLDER
      ),
  },
  // @TODO: To add
  {
    key: 'fhir_id',
    title: 'Tumor Descriptor (Source Text)',
    dataIndex: 'fhir_id',
    defaultHidden: true,
    render: () => TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'consent_type',
    title: 'Consent Code (dbGaP)',
    dataIndex: 'consent_type',
    defaultHidden: true,
    render: (consent_type) => consent_type || TABLE_EMPTY_PLACE_HOLDER,
  },
];
