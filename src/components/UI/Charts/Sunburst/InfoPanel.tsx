/* eslint-disable react/prop-types */
import React, { FunctionComponent } from 'react';
import './sunburst.css';
import { Phenotype } from 'store/sunburstTypes';
import { RootState } from 'store/rootState';
import { connect, ConnectedProps } from 'react-redux';
import { addTermToActiveIndex } from 'store/actionCreators/virtualStudies';
import { ThunkDispatch } from 'redux-thunk';
import { AddTermToActiveIndex, Term } from 'store/virtualStudiesTypes';

type OwnProps = {
  data: Pick<Phenotype, 'title' | 'results' | 'exactTagCount'>;
};

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = OwnProps & PropsFromRedux;

const mapDispatch = (dispatch: ThunkDispatch<RootState, null, AddTermToActiveIndex>) => ({
  onClickAddTermToActiveIndex: (term: Term) => dispatch(addTermToActiveIndex(term)),
});

const connector = connect(null, mapDispatch);

const splitTitle = (title: string) => {
  const [rawTitle, rawCode] = title.split('(HP:');
  return {
    title: rawTitle.trim(),
    hpCode: `HP:${rawCode.replace(')', '').trim()}`,
  };
};

const InfoPanel: FunctionComponent<Props> = ({ data, onClickAddTermToActiveIndex }) => {
  const { title, results, exactTagCount } = data;

  const titleCode = splitTitle(title);

  return (
    <div className={'info-panel-grid-container'}>
      <div className={'term-grid'}>
        <div className={'term-grid-item'}>
          <span className={'main-term-title'}>{titleCode.title}</span>
          <span className={'hp'}>{` ${titleCode.hpCode}`}</span>
        </div>
        <div className={'term-grid-item count-text'}>
          {`${results} participants (including descendant terms on this path)`}
        </div>
        <div className={'term-grid-item count-text'}>
          {`${exactTagCount} participants with this exact term`}
        </div>
        <a
          onClick={() =>
            onClickAddTermToActiveIndex({ field: 'observed_phenotype.name', value: title })
          }
          type="text"
          className={'add-to-query'}
        >
          Add term to active query
        </a>
      </div>
      <div className={'tree-grid'}>
        <div className={'tree-title'}>Current Path</div>
        <div className={'tree'}>tree to come</div>
      </div>
    </div>
  );
};
const Connected = connector(InfoPanel);

export default Connected;
