import FilterList from 'components/uiKit/FilterList';
import { FilterInfo } from 'components/uiKit/FilterList/types';
import { ExtendedMapping } from 'graphql/models';

type OwnProps = {
  extendedMappingData: ExtendedMapping[];
  filterInfo: FilterInfo;
};
export interface ItemProps {
  label: React.ReactElement;
  value: string;
}

const SidebarFacetItemsList = ({ extendedMappingData, filterInfo }: OwnProps) => {
  console.log('extendedMappingData', filterInfo); //TODO: to remove

  return <div></div>;
};

export default SidebarFacetItemsList;
