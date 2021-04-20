import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Tooltip } from 'antd';

import { Sqon } from '../../sqon';
import { addToSqons } from 'common/sqonUtils';
import { StudiesResult } from './models';
import { DB_GA_P, generateUrlForDbGap } from 'common/constants';

import './tableColumn.scss';

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
      title: (
        <Tooltip title="Sequencing reads">
          <span>Seq</span>
        </Tooltip>
      ),
      name: 'seq',
    },
    {
      title: (
        <Tooltip title="Simple Nucleotide Variations">
          <span>Snv</span>
        </Tooltip>
      ),
      name: 'snv',
    },
    {
      title: (
        <Tooltip title="Copy number variations">
          <span>Cnv</span>
        </Tooltip>
      ),
      name: 'cnv',
    },
    {
      title: (
        <Tooltip title="Transcriptome profiling">
          <span>Exp</span>
        </Tooltip>
      ),
      name: 'exp',
    },
    {
      title: (
        <Tooltip title="Structural variations">
          <span>Sv</span>
        </Tooltip>
      ),
      name: 'sv',
    },
    {
      title: (
        <Tooltip title="Pathology">
          <span>Pat</span>
        </Tooltip>
      ),
      name: 'pat',
    },
    {
      title: (
        <Tooltip title="Radiology">
          <span>Rad</span>
        </Tooltip>
      ),
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
