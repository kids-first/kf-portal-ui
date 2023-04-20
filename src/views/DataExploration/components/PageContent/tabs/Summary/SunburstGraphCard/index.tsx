import { useEffect, useRef, useState } from 'react';
import intl from 'react-intl-universal';
import Empty from '@ferlab/ui/core/components/Empty';
import GridCard, { GridCardHeader } from '@ferlab/ui/core/view/v2/GridCard';
import { Col, Row } from 'antd';
import useParticipantResolvedSqon from 'graphql/participants/useParticipantResolvedSqon';
import TreePanel from 'views/DataExploration/components/PageContent/tabs/Summary/SunburstGraphCard/TreePanel';
import { DATA_EXPLORATION_QB_ID } from 'views/DataExploration/utils/constant';
import {
  extractMondoTitleAndCode,
  extractPhenotypeTitleAndCode,
} from 'views/DataExploration/utils/helper';
import { lightTreeNodeConstructor, TreeNode } from 'views/DataExploration/utils/OntologyTree';
import {
  generateNavTreeFormKey,
  PhenotypeStore,
  RegexExtractPhenotype,
} from 'views/DataExploration/utils/PhenotypeStore';

import { getCommonColors } from 'common/charts';

import SunburstD3 from './utils/sunburst-d3';

import styles from './index.module.scss';

interface OwnProps {
  id: string;
  className?: string;
  field: string;
}

const width = 335;
const height = 335;

const SunburstGraphCard = ({ id, className = '', field }: OwnProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [treeData, setTreeData] = useState<TreeNode[]>();
  const [currentNode, setCurrentNode] = useState<TreeNode>();
  const phenotypeStore = useRef<PhenotypeStore | undefined>(new PhenotypeStore());
  const sunburstRef = useRef<SVGSVGElement>(null);
  const updateSunburst = useRef<(key: any) => void>();
  const { sqon } = useParticipantResolvedSqon(DATA_EXPLORATION_QB_ID);

  useEffect(() => {
    setIsLoading(true);
    phenotypeStore.current?.fetch({ field, sqon }).then(() => {
      const rootNode = phenotypeStore.current?.getRootNode();
      setCurrentNode(rootNode);
      setTreeData(rootNode ? [lightTreeNodeConstructor(rootNode.key!)] : []);
      setIsLoading(false);

      updateSunburst.current = SunburstD3(
        sunburstRef,
        rootNode,
        {
          depth: 2,
          width: width,
          height: height,
          colors: getCommonColors(),
        },
        getSelectedPhenotype,
        {
          centerTitleFormatter: (data: TreeNode) => data.results,
          centerSubtitleFormatter: (data: TreeNode) => 'Participants with',
          centerDescriptionFormatter: (data: TreeNode) =>
            field === 'observed_phenotype'
              ? `HP:${extractPhenotypeTitleAndCode(data.title!)?.code}`
              : `MONDO:${extractMondoTitleAndCode(data.title!)?.code}`,
          tooltipFormatter: (data: TreeNode) =>
            `<div>
              ${data.title}<br/><br/>
              Participants: <strong>${data.results}</strong>
            </div>`,
        },
        field,
      );
    });

    return () => {
      updateSunburst.current = undefined;
      setIsLoading(false);
    };
    // eslint-disable-next-line
  }, [JSON.stringify(sqon)]);

  const getSelectedPhenotype = (node: TreeNode) => {
    const phenoReversed = (node.key.match(RegexExtractPhenotype) || []).reverse();
    setCurrentNode(node);
    setTreeData(generateNavTreeFormKey(phenoReversed));
  };

  return (
    <GridCard
      wrapperClassName={className}
      theme="shade"
      loadingType="spinner"
      loading={isLoading}
      resizable
      title={
        <GridCardHeader
          id={id}
          title={intl.get(`screen.dataExploration.tabs.summary.${field}.cardTitle`)}
          withHandle
        />
      }
      content={
        !isLoading &&
        (treeData && treeData?.length > 0 ? (
          <Row
            gutter={[24, 24]}
            id={`tooltip-wrapper-${field}`}
            className={styles.sunburstRowWrapper}
          >
            <Col lg={12} xl={10}>
              <svg
                className={styles.sunburstChart}
                width={width}
                height={height}
                viewBox={`0 0 ${width} ${height}`}
                ref={sunburstRef}
              />
            </Col>
            <Col lg={12} xl={14}>
              <TreePanel
                currentNode={currentNode!}
                treeData={treeData!}
                getSelectedPhenotype={getSelectedPhenotype}
                updateSunburst={updateSunburst.current!}
                field={field}
              />
            </Col>
          </Row>
        ) : (
          <Empty
            imageType="grid"
            size="large"
            description={intl.get(`screen.dataExploration.tabs.summary.${field}.empty`)}
          />
        ))
      }
    />
  );
};

export default SunburstGraphCard;
