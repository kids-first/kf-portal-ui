import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Tooltip } from 'antd';

import { DB_GA_P, generateUrlForDbGap } from 'common/constants';
import { addToSqons } from 'common/sqonUtils';

import { Sqon } from '../../sqon';

import { StudiesResult } from './models';

import './tableColumn.scss';

export const studiesColumns = (sqons: Sqon[], onLinkClick: (sqons: Sqon[]) => void) =>
  [
    {
      title: 'Code',
      name: 'code',
      width: 130,
      summary: false,
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
      summary: false,
      width: 400,
    },
    {
      title: 'Program',
      name: 'program',
      summary: false,
      width: 150,
    },
    {
      title: 'Domain',
      name: 'domain',
      summary: false,
      width: 150,
      // eslint-disable-next-line react/display-name
      render: (domain: string[]) => domain.join(', '),
    },
    {
      title: 'dbGap',
      name: 'external_id',
      summary: false,
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
      summary: true,
    },
    {
      title: 'Available participants per Data Category',
      children: [
        {
          title: 'Families',
          dataIndex: 'family_count',
          name: 'family_count',
          summary: true,
        },
        {
          title: (
            <Tooltip title="Sequencing reads">
              <span>Seq</span>
            </Tooltip>
          ),
          dataIndex: 'seq',
          name: 'seq',
          summary: true,
        },
        {
          title: (
            <Tooltip title="Simple Nucleotide Variations">
              <span>Snv</span>
            </Tooltip>
          ),
          dataIndex: 'snv',
          name: 'snv',
          summary: true,
        },
        {
          title: (
            <Tooltip title="Copy number variations">
              <span>Cnv</span>
            </Tooltip>
          ),
          dataIndex: 'cnv',
          name: 'cnv',
          summary: true,
        },
        {
          title: (
            <Tooltip title="Transcriptome profiling">
              <span>Exp</span>
            </Tooltip>
          ),
          dataIndex: 'exp',
          name: 'exp',
          summary: true,
        },
        {
          title: (
            <Tooltip title="Structural variations">
              <span>Sv</span>
            </Tooltip>
          ),
          dataIndex: 'sv',
          name: 'sv',
          summary: true,
        },
        {
          title: (
            <Tooltip title="Pathology">
              <span>Pat</span>
            </Tooltip>
          ),
          dataIndex: 'pat',
          name: 'pat',
          summary: true,
        },
        {
          title: (
            <Tooltip title="Radiology">
              <span>Rad</span>
            </Tooltip>
          ),
          dataIndex: 'rad',
          name: 'rad',
          summary: true,
        },
        {
          title: 'Other',
          dataIndex: 'other',
          name: 'other',
          summary: true,
        },
        {
          title: 'Files',
          dataIndex: 'file_count',
          name: 'file_count',
          summary: true,
        },
      ],
    },
  ].map((c) => ({ ...c, key: c.name, dataIndex: c.name }));
