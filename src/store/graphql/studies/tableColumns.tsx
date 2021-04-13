import { Link } from 'react-router-dom';
import { Button } from 'antd';
import React from 'react';
import { Sqon } from '../../sqon';
import { addToSqons } from 'common/sqonUtils';
import './tableColumn.scss';
import { StudiesResult } from './models';
import { DB_GA_P, generateUrlForDbGap } from 'common/constants';

export const studiesColumns = (sqons: Sqon[], onLinkClick: (sqons: Sqon[]) => void) =>
  [
    {
      title: 'Code',
      name: 'code',
      width: 130,
      // eslint-disable-next-line react/display-name
      render: (code: string) => (
        <Link
          to={'/explore'}
          href={'#top'}
          onClick={() => {
            onLinkClick(
              addToSqons({ fieldsWValues: [{ field: 'study.code', value: code }], sqons }),
            );
            const toTop = document.getElementById('main-page-container');
            toTop?.scrollTo(0, 0);
          }}
        >
          <Button type="link">
            <div className={'story-table-code'}>{code}</div>
          </Button>
        </Link>
      ),
    },
    {
      title: 'Name',
      name: 'name',
      width: 400,
    },
    {
      title: 'Program',
      name: 'program',
      width: 150,
    },
    {
      title: 'Domain',
      name: 'domain',
      width: 150,
      // eslint-disable-next-line react/display-name
      render: (domain: string[]) => domain.join(', '),
    },
    {
      title: 'dbGap',
      name: 'external_id',
      // eslint-disable-next-line react/display-name
      render: (external_id: string, record: StudiesResult) =>
        record.data_access_authority === DB_GA_P ? (
          <a target="_blank" rel="noopener noreferrer" href={generateUrlForDbGap(external_id)}>
            {external_id}
          </a>
        ) : (
          ''
        ),
    },
    {
      title: 'Participants',
      name: 'participant_count',
    },
    {
      title: 'Families',
      name: 'family_count',
    },
    {
      title: 'Seq',
      name: 'seq',
    },
    {
      title: 'Snv',
      name: 'snv',
    },
    {
      title: 'Cnv',
      name: 'cnv',
    },
    {
      title: 'Exp',
      name: 'exp',
    },
    {
      title: 'Sv',
      name: 'sv',
    },
    {
      title: 'Pat',
      name: 'pat',
    },
    {
      title: 'Rad',
      name: 'rad',
    },
    {
      title: 'Other',
      name: 'other',
    },
    {
      title: 'Files',
      name: 'file_count',
    },
  ].map((c) => ({ ...c, key: c.name, dataIndex: c.name }));
