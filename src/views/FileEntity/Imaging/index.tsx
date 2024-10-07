import intl from 'react-intl-universal';
import { EntityDescriptions } from '@ferlab/ui/core/pages/EntityPage';
import { IFileEntity, IImagingData } from 'graphql/files/models';
import { SectionId } from 'views/FileEntity/utils/anchorLinks';

import getImagingItems from '../utils/getImagingItems';

interface OwnProps {
  file?: IFileEntity;
  loading: boolean;
}

const Imaging = ({ file, loading }: OwnProps) => {
  const imagingData: Partial<IImagingData> &
    Pick<IFileEntity, 'imaging_sequence_type' | 'imaging_technique' | 'flywheel_url'> = {
    ...file?.imaging,
    imaging_sequence_type: file?.imaging_sequence_type,
    imaging_technique: file?.imaging_technique,
    flywheel_url: file?.flywheel_url,
  };

  return (
    <EntityDescriptions
      id={SectionId.IMAGING}
      loading={loading}
      descriptions={getImagingItems(imagingData)}
      title={intl.get('entities.file.imaging.title')}
      header={intl.get('entities.file.imaging.title')}
    />
  );
};

export default Imaging;
