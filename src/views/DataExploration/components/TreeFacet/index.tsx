import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';

import CollapseLikeFacet from 'components/uiKit/FilterList/CollapsePlaceHolderFacet';
import { RemoteComponentList } from 'store/remote/types';

import { remoteSliceActions } from '../../../../store/remote/slice';

type Props = {
  type: RemoteComponentList;
  field: string;
};

const TreeFacet = ({ type, field }: Props) => {
  const dispatch = useDispatch();

  return (
    <CollapseLikeFacet
      key={field}
      title={intl.get(`facets.${field}.name`)}
      onClick={() => {
        dispatch(
          remoteSliceActions.openRemoteComponent({
            id: type,
            props: {
              visible: true,
            },
          }),
        );
      }}
    />
  );
};

export default TreeFacet;
