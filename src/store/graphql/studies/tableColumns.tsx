import { Link } from 'react-router-dom';
import { Button } from 'antd';
import React from 'react';
import { Sqon } from '../../sqon';
import { termToSqon } from 'common/sqonUtils';

const addToSqons = (value: string, sqons: Sqon[]): Sqon[] => [
  ...sqons,
  { content: [termToSqon({ field: 'study.code', value: value })], op: 'and' },
];

//FIXME fix class names
export const studiesColumns = (sqons: Sqon[], onLinkClick: (sqons: Sqon[]) => void) =>
  [
    {
      title: 'Code',
      name: 'code',
      width: 130,
      // eslint-disable-next-line react/display-name
      render: (code: string) => (
        <Link
          className={'classNames'}
          to={'/explore'}
          href={'#top'}
          onClick={() => {
            // console.log(record.code, 'RRR');
            onLinkClick(addToSqons(code, sqons));
            const toTop = document.getElementById('main-page-container');
            toTop?.scrollTo(0, 0);
          }}
        >
          <Button className={'count-button'} type="text">
            <div className={'save-sets-participants-count'}>{code}</div>
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
