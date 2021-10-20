import React from 'react';
import { Card, Col, Row, Typography } from 'antd';

import styles from './CaringForChildren.module.scss';

const { Text, Title } = Typography;

const CaringForChildren = () => (
  <Card
    title={
      <span className={'title-dashboard-card'}>
        <span className={styles.italic}>CARING</span> for Children with COVID Resources
      </span>
    }
    className={styles.caringForChildrenCard}
  >
    <Text className={styles.cardDesc}>
      FHIR & Data Resources for NIH’s{' '}
      <a target="_blank" rel="noopener noreferrer" href="https://caring4kidswithcovid.nih.gov">
        <span className={styles.italic}>
          Collaboration to Assess Risk and Identify LoNG-term outcomes for Children with COVID.
        </span>
      </a>
    </Text>
    <div className={styles.linkCards}>
      <Row gutter={[8, 8]} align="stretch">
        <Col xs={12}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            // eslint-disable-next-line max-len
            href="https://kf-api-fhir-service.kidsfirstdrc.org/Patient?_total=accurate&_has:ResearchSubject:individual:study=ResearchStudy/4873"
          >
            <Card className={styles.linkCard}>
              <Title className={styles.linkCardTitle}>
                <span className={styles.italic}>CARING</span> Data FHIR API Endpoint
              </Title>
              <Text className={styles.linkCardDesc}>
                Query the entire <span className={styles.italic}>CARING</span> dataset via FHIR API
                parameters
              </Text>
            </Card>
          </a>
        </Col>
        <Col xs={12}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://kf-api-fhir-service.kidsfirstdrc.org/metadata"
          >
            <Card className={styles.linkCard}>
              <Title className={styles.linkCardTitle}>Kids First FHIR API Endpoint</Title>
              <Text className={styles.linkCardDesc}>
                Query all released Kids First datasets via FHIR API
              </Text>
            </Card>
          </a>
        </Col>
        <Col xs={12}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://kf-api-fhir-service.kidsfirstdrc.org/dashboard"
          >
            <Card className={styles.linkCard}>
              <Title className={styles.linkCardTitle}>Kids First FHIR Data Dashboard</Title>
              <Text className={styles.linkCardDesc}>
                Explore the <span className={styles.italic}>CARING</span> data via dashboard
                interfaces
              </Text>
            </Card>
          </a>
        </Col>
        <Col xs={12}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://kf-api-fhir-service.kidsfirstdrc.org/swagger-ui"
          >
            <Card className={styles.linkCard}>
              <Title className={styles.linkCardTitle}>Kids First FHIR Documentation</Title>
              <Text className={styles.linkCardDesc}>
                Swagger documentation to learn how to interact with the FHIR API
              </Text>
            </Card>
          </a>
        </Col>
      </Row>
    </div>
  </Card>
);

export default CaringForChildren;
