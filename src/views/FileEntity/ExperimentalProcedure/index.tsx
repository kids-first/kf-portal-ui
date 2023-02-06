import intl from 'react-intl-universal';
import { EntityDescriptions } from '@ferlab/ui/core/pages/EntityPage';
import { IFileEntity } from 'graphql/files/models';

import getExperimentalProcedureItems from '../utils/getExperimentalProcedureItems';
import { SectionId } from '..';

import ExperimentalProcedureTable from './ExperimentalProcedureTable';

interface OwnProps {
  file?: IFileEntity;
  loading: boolean;
}

const ExperimentalProcedure = ({ file, loading }: OwnProps) => {
  const nbExperiments = file?.sequencing_experiment?.hits?.edges.length || 0;

  if (nbExperiments > 1) {
    return <ExperimentalProcedureTable file={file} loading={loading} />;
  }

  const sequencingExperiment = file?.sequencing_experiment?.hits?.edges[0].node;

  return (
    <EntityDescriptions
      id={SectionId.EXPERIMENTAL_PROCEDURE}
      loading={loading}
      descriptions={getExperimentalProcedureItems(sequencingExperiment)}
      title={intl.get('entities.file.experimental_procedure.title')}
      header={intl.get('entities.file.experimental_procedure.title')}
    />
  );
};

export default ExperimentalProcedure;
