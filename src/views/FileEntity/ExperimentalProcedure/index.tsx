import intl from 'react-intl-universal';
import { EntityDescriptions } from '@ferlab/ui/core/pages/EntityPage';
import { IFileEntity } from 'graphql/files/models';
import { SectionId } from 'views/FileEntity';
import ExperimentalProcedureTable from 'views/FileEntity/ExperimentalProcedure/ExperimentalProcedureTable';
import getExperimentalProcedureItems from 'views/FileEntity/utils/getExperimentalProcedureItems';

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
