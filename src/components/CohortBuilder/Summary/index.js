import React from 'react';
import styled from 'react-emotion';
import { compose } from 'recompose';

import Pie from 'chartkit/components/Pie';
import { demographicPiesMock } from './mock';
import Card from 'uikit/Card';
import { CardWrapper } from 'uikit/Card/styles';
import { Col, Row } from 'react-grid-system';
import { withTheme } from 'emotion-theming';

const CardSlot = styled(Card)`
  height: 305px;
`;

const CardSlotPies = styled(CardWrapper)`
  height: 305px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px 10px;
`;

const LongCard = styled(Card)`
  height: 100%;
`;

const md = 4;
const lg = 4;

const enhance = compose(withTheme);

const Summary = ({ theme }) => (
  <Row nogutter>
    <Col sm={12} md={9} lg={9}>
      <Row nogutter>
        <Col sm={12} md={md} lg={lg}>
          <CardSlot title="Overall Survival" />
        </Col>
        <Col sm={12} md={md} lg={lg}>
          <CardSlot title="Studies" />
        </Col>
        <Col sm={12} md={md} lg={lg}>
          <CardSlot title="Most Frequent Diagnoses" />
        </Col>
        <Col sm={12} md={md} lg={lg}>
          <CardSlotPies>
            <Pie
              style={{ height: '42%', width: '50%', marginBottom: '10px', marginTop: '5px' }}
              title={'Gender'}
              data={demographicPiesMock.gender}
              colors={[theme.chartColors.orange, '#FFFFFF']}
            />
            <Pie
              style={{ height: '42%', width: '50%', marginBottom: '10px', marginTop: '5px' }}
              title={'Ethnicity'}
              data={demographicPiesMock.ethnicity}
              colors={[theme.chartColors.darkblue, '#FFFFFF']}
            />
            <Pie
              style={{ height: '42%', width: '50%' }}
              title={'Race'}
              data={demographicPiesMock.race}
              colors={[theme.chartColors.purple, '#FFFFFF']}
            />
            <Pie
              style={{ height: '42%', width: '50%' }}
              title={'Family Composition'}
              data={demographicPiesMock.familyComposition}
              colors={[theme.chartColors.lightblue, '#FFFFFF']}
            />
          </CardSlotPies>
        </Col>
        <Col sm={12} md={md} lg={lg}>
          <CardSlot title="File Breakdown" />
        </Col>
        <Col sm={12} md={md} lg={lg}>
          <CardSlot title="Age at Diagnosis" />
        </Col>
      </Row>
    </Col>
    <Col sm={12} md={3} lg={3}>
      <LongCard title="Phenotypes">Long Card</LongCard>
    </Col>
  </Row>
);

export default enhance(Summary);
