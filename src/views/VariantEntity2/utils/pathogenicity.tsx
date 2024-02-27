import intl from 'react-intl-universal';
import { TABLE_EMPTY_PLACE_HOLDER } from '@ferlab/ui/core/common/constants';
import ColorTag, { ColorTagType } from '@ferlab/ui/core/components/ColorTag';
import ExternalLink from '@ferlab/ui/core/components/ExternalLink';
import { ProColumnType } from '@ferlab/ui/core/components/ProTable/types';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import {
  CosmicConditionCell,
  DddConditionCell,
  HpoConditionCell,
  OmimConditionCell,
  OrphanetConditionCell,
} from '@ferlab/ui/core/pages/EntityPage';
import {
  ClinicalGenesTableSource,
  Conditions,
  CosmicConditions,
  DddConditions,
  HpoConditions,
  IGeneRecord,
  Inheritance,
  OmimConditions,
  OmimGene,
  OmimInheritance,
  OrphanetConditions,
  OrphanetInheritance,
  SingleValuedInheritance,
} from '@ferlab/ui/core/pages/EntityPage/type';
import { addUnderscoreAndLowercase } from '@ferlab/ui/core/utils/stringUtils';
import { Space, Tag, Tooltip, Typography } from 'antd';
import { ClinvarColorMap } from 'views/Variants/components/PageContent/VariantsTable/utils';

import style from '../index.module.scss';

const renderInterpretation = (interpretation: string) => {
  const clinVarSigKey: string = addUnderscoreAndLowercase(interpretation);
  return (
    <Tag color={ClinvarColorMap[clinVarSigKey]}>
      <Typography.Text className={style.clinVar}>
        {intl.get(`screen.variants.summary.clinVarLabel.${clinVarSigKey}`)}
      </Typography.Text>
    </Tag>
  );
};

export const getClinvarColumns = (): ProColumnType[] => [
  {
    key: 'interpretation',
    dataIndex: 'interpretation',
    width: '50%',
    title: intl.get('screen.variants.pathogenicity.interpretation'),
    render: (text: string) => renderInterpretation(text),
  },
  {
    key: 'condition',
    dataIndex: 'condition',
    title: intl.get('screen.variants.pathogenicity.condition'),
    width: '50%',
    render: (text: string, record: any) => {
      const tagMap: { [key: string]: React.ReactNode } = {
        germline: (
          <Tooltip title={intl.get('screen.variants.pathogenicity.germline')}>
            <div>
              <ColorTag type={ColorTagType.Other}>
                {intl.get('screen.variants.pathogenicity.germlineAbvr')}
              </ColorTag>
            </div>
          </Tooltip>
        ),
        somatic: (
          <Tooltip title={intl.get('screen.variants.pathogenicity.somatic')}>
            <div>
              <ColorTag type={ColorTagType.Other}>
                {intl.get('screen.variants.pathogenicity.somaticAbvr')}
              </ColorTag>
            </div>
          </Tooltip>
        ),
      };

      return (
        <Space direction="horizontal">
          <Typography.Text>{text}</Typography.Text>
          {tagMap[record.inheritance] || null}
        </Space>
      );
    },
  },
];

export const getGenePhenotypeColumns = (): ProColumnType[] => [
  {
    key: 'source',
    dataIndex: 'source',
    title: intl.get('screen.variants.pathogenicity.source'),
  },
  {
    key: 'gene',
    dataIndex: 'gene',
    title: intl.get('screen.variants.pathogenicity.gene'),
    render: (text: Conditions, record: IGeneRecord) => {
      const { source } = record;
      if (source === ClinicalGenesTableSource.omim) {
        const [geneName, omimId] = record.gene as OmimGene;
        return (
          <>
            {`${geneName} (MIM:`}
            <ExternalLink href={`https://www.omim.org/entry/${omimId}`}>{omimId}</ExternalLink>)
          </>
        );
      }
      return record.gene;
    },
  },
  {
    key: 'conditions',
    dataIndex: 'conditions',
    render: (text: Conditions, record: IGeneRecord) => {
      switch (record.source) {
        case ClinicalGenesTableSource.omim:
          return <OmimConditionCell conditions={record.conditions as OmimConditions} />;
        case ClinicalGenesTableSource.orphanet:
          return <OrphanetConditionCell conditions={record.conditions as OrphanetConditions} />;
        case ClinicalGenesTableSource.hpo:
          return <HpoConditionCell conditions={record.conditions as HpoConditions} />;
        case ClinicalGenesTableSource.ddd:
          return <DddConditionCell conditions={record.conditions as DddConditions} />;
        default:
          return <CosmicConditionCell conditions={record.conditions as CosmicConditions} />;
      }
    },
    title: intl.get('screen.variants.pathogenicity.condition'),
    width: '33%',
  },
  {
    key: 'inheritance',
    dataIndex: 'inheritance',
    render: (text: Inheritance, record: IGeneRecord) => {
      const { source } = record;
      if (source === ClinicalGenesTableSource.orphanet) {
        const orphanetInheritance = (record.inheritance || []) as OrphanetInheritance;
        return (
          <>
            {orphanetInheritance.map((inheritance: string[], index: number) => (
              <StackLayout key={index}>
                <Typography.Text>
                  {inheritance ? inheritance.join(', ') : TABLE_EMPTY_PLACE_HOLDER}
                </Typography.Text>
              </StackLayout>
            ))}
          </>
        );
      } else if (source === ClinicalGenesTableSource.omim) {
        const omimInheritance = record.inheritance as OmimInheritance;
        return (
          <>
            {omimInheritance.map((inheritance: string[], index: number) => (
              <StackLayout key={index}>
                <Typography.Text>
                  {inheritance ? inheritance.join(', ') : TABLE_EMPTY_PLACE_HOLDER}
                </Typography.Text>
              </StackLayout>
            ))}
          </>
        );
      }
      const inheritance = record.inheritance as SingleValuedInheritance;
      return inheritance || TABLE_EMPTY_PLACE_HOLDER;
    },
    title: intl.get('screen.variants.pathogenicity.inheritance'),
    width: '33%',
  },
];
