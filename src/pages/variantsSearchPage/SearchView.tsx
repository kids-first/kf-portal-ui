import React, { FunctionComponent } from 'react';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import style from './SearchView.module.scss';
import VariantTable from './VariantTable';
import Empty, { SIZE } from 'components/UI/Empty';
import Suggester from './Suggester';
import { RootState } from 'store/rootState';
import { selectChosenSuggestion } from 'store/selectors/genomicSuggester';
import { connect, ConnectedProps } from 'react-redux';

const mapState = (state: RootState) => ({
  selectedSuggestion: selectChosenSuggestion(state),
});

const connector = connect(mapState);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux;

const SearchView: FunctionComponent<Props> = (props) => {
  const { selectedSuggestion } = props;
  return (
    <StackLayout vertical className={style.searchViewContainer} center>
      <StackLayout vertical className={style.autoCompleteContainer} fitContent>
        <Suggester />
      </StackLayout>
      {selectedSuggestion ? (
        <VariantTable selectedSuggestion={selectedSuggestion} />
      ) : (
        <StackLayout vertical center className={style.initialSearchContainer}>
          <Empty size={SIZE.DEFAULT} description={'Use the search variant tool above'} />
        </StackLayout>
      )}
    </StackLayout>
  );
};

export default connector(SearchView);
