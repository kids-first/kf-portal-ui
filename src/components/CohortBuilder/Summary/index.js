import React from 'react';
import styled from 'react-emotion';
import Pie from './pie';
import { demographicPiesMock } from './pie';
import Card from 'uikit/Card';
import { Col, Row } from 'react-grid-system';

const CardSlot = styled(Card)`
  height: 305px;
`;

const LongCard = styled(Card)`
  height: 100%;
`;

const md = 4;
const lg = 4;

const Summary = () => (
  <Row nogutter>
    <Col sm={12} md={9} lg={9}>
      <Row nogutter>
        <Col sm={12} md={md} lg={lg}>
          <CardSlot title="Overall Survival">
            <Pie data={demographicPiesMock.ethnicity} colors={'purples'} />
          </CardSlot>
        </Col>
        <Col sm={12} md={md} lg={lg}>
          <CardSlot title="Studies">
            <Pie data={demographicPiesMock.ethnicity} colors={'purples'} />
          </CardSlot>
        </Col>
        <Col sm={12} md={md} lg={lg}>
          <CardSlot title="Most Frequent Diagnoses">
            <Pie data={demographicPiesMock.ethnicity} colors={'purples'} />
          </CardSlot>
        </Col>
        <Col sm={12} md={md} lg={lg}>
          <CardSlot>
            <Pie data={demographicPiesMock.ethnicity} colors={'purples'} />
          </CardSlot>
        </Col>
        <Col sm={12} md={md} lg={lg}>
          <CardSlot title="File Breakdown">
            <Pie data={demographicPiesMock.ethnicity} colors={'purples'} />
          </CardSlot>
        </Col>
        <Col sm={12} md={md} lg={lg}>
          <CardSlot title="Age at Diagnosis">
            <Pie data={demographicPiesMock.ethnicity} colors={'purples'} />
          </CardSlot>
        </Col>
      </Row>
    </Col>
    <Col sm={12} md={3} lg={3}>
      <LongCard title="Phenotypes">Long Card</LongCard>
    </Col>
  </Row>
);

export default Summary;
