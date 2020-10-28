/* eslint-disable react/prop-types */
import React, { FunctionComponent } from 'react';
import './sunburst.css';
import { Phenotype } from 'store/sunburstTypes';

type OwnProps = {
  data: Pick<Phenotype, 'title' | 'results' | 'exactTagCount'>;
};

const splitTitle = (title: string) => {
  const [rawTitle, rawCode] = title.split('(HP:');
  return {
    title: rawTitle.trim(),
    hpCode: `HP:${rawCode.replace(')', '').trim()}`,
  };
};

const InfoPanel: FunctionComponent<OwnProps> = ({ data }) => {
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
        <div className={'term-grid-item add-to-query'}>Add term to active query</div>
      </div>
      <div className={'tree-grid'}>
        <div className={'tree-title'}>Current Path</div>
        <div className={'tree'}>tree to come</div>
      </div>
    </div>
  );
};

export default InfoPanel;
