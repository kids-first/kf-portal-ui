import intl from 'react-intl-universal';

import CollapseLikeFacet from 'components/uiKit/FilterList/CollapsePlaceHolderFacet';

import { useDispatch } from 'react-redux';
import { TTitleFormatter } from 'views/DataExploration/utils/OntologyTree';
import { remoteSliceActions } from 'store/remote/slice';
import { RemoteComponentList } from 'store/remote/types';

type Props = {
  type: RemoteComponentList;
  field: string;
  titleFormatter?: TTitleFormatter;
};

const TreeFacet = ({ type, field, titleFormatter }: Props) => {
  const dispatch = useDispatch();

  return (
    <CollapseLikeFacet
      key={field}
      title={intl.get(`facets.${field}.name`)}
      onClick={() =>
        dispatch(
          remoteSliceActions.openRemoteComponent({
            id: type,
            props: { visible: true },
          }),
        )
      }
    />
  );
};

export default TreeFacet;
