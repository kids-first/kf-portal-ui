import React, { FunctionComponent } from 'react';
import { Spin } from 'antd';
import QueriesResolver, {
  Queries,
  QueriesResolverFaCCType,
} from '../CohortBuilder/QueriesResolver';
import { Tags } from './statsConstants';
import { WarningTwoTone } from '@ant-design/icons';
import './FileRepo.scss';

interface Props {
  api: Function;
  /* helps to debug in the network console */
  tag: Tags;
  queries: Queries;
  label: string;
  icon: React.ReactElement;
}

const Stat: FunctionComponent<Props> = ({ api, tag, queries, label, icon }) => (
  <QueriesResolver name={`GQL_${tag}`} api={api} queries={queries}>
    {({ isLoading, data: count, error }: QueriesResolverFaCCType) => {
      const content = error ? <WarningTwoTone twoToneColor={'red'} /> : count;
      return (
        <div className={'stat-container'}>
          {icon}
          <div className={'stat-content-container'}>{isLoading ? <Spin /> : content}</div>
          <div>{label}</div>
        </div>
      );
    }}
  </QueriesResolver>
);

export default Stat;
