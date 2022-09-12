import { useHistory } from 'react-router-dom';
import ScrollContent from '@ferlab/ui/core/layout/ScrollContent';
import { Space, Typography, Button, Form, Checkbox, Row } from 'antd';

import GridCard from '@ferlab/ui/core/view/v2/GridCard';

import styles from './index.module.scss';
import { STATIC_ROUTES } from 'utils/routes';

const { Title } = Typography;

interface OwnProps {
  isMultiStep?: boolean;
  hidden?: boolean;
  onFinish: (values: any) => void;
}

export const TermsConditionsContent = () => (
  <Space direction="vertical" size={24} className={styles.termsConditionsContent}>
    <div>
      As a user of the Services you agree that you are 13 years of age or older and furthermore
      agree to the Terms and Conditions of Services defined herein and where applicable the terms
      defined by the{' '}
      <a
        href="https://osp.od.nih.gov/wp-content/uploads/Genomic_Data_User_Code_of_Conduct.pdf"
        target="_blank"
        rel="noreferrer"
      >
        NIH Genomic Data User Code of Conduct.
      </a>
      These terms include, but are not limited to:
    </div>
    <ul>
      <li>
        You will request controlled-access datasets solely in connection with the research project
        described in an approved Data Access Request for each dataset;
      </li>
      <li>
        You will make no attempt to identify or contact individual participants or groups from whom
        data were collected, or generate information that could allow participants’ identities to be
        readily ascertained;
      </li>
      <li>
        You will not distribute controlled-access datasets to any entity or individual beyond those
        specified in an approved Data Access Request;
      </li>
      <li>
        You will adhere to computer security practices in compliance with{' '}
        <a
          href="https://sharing.nih.gov/sites/default/files/flmngr/NIH_Best_Practices_for_Controlled-Access_Data_Subject_to_the_NIH_GDS_Policy.pdf"
          target="_blank"
          rel="noreferrer"
        >
          NIH Security Best Practices for Controlled-Access Data
        </a>{' '}
        such that only authorized individuals possess access to data files;
      </li>
      <li>
        You acknowledge Intellectual Property Policies should they exist as specified in a dataset's
        associated Data Use Certification; and,
      </li>
      <li>
        {' '}
        You will report any inadvertent data release in accordance with the terms in the Data Use
        Certification, breach of data security, or other data management incidents contrary to the
        terms of data access.
      </li>
    </ul>
    <div>
      DRC terms and conditions may be changed at any time via a public posting of revisions to the
      Services. As a user, you agree to review the{' '}
      <a href="https://kidsfirstdrc.org/policies/" target="_blank" rel="noreferrer">
        Terms & Conditions and Privacy Policies
      </a>{' '}
      each time you use the Services so that you are aware of any modifications made to these
      policies. By accessing or using the Services, you agree with and to be bound by all of the
      terms and conditions and policies as posted on the Services at the time of your access or use,
      including the Privacy Policies then in effect.
    </div>
    <div>
      For documents and/or data available from the Services, the DRC does not warrant or assume any
      legal liability or responsibility for the accuracy, completeness, or usefulness of any
      information, apparatus, product, or process. No specific medical advice is provided by any
      Services, and the Kids First DRC urges users of Services to consult with a qualified physician
      for diagnosis and for answers to personal questions.
    </div>
    <div>
      For more information about the NIH Genomic Data Sharing Policy and applying for
      Controlled-Access Data through dbGaP visit:
    </div>
    <ul>
      <li>
        NIH Genomic Data Sharing Policy:
        <a href="https://grants.nih.gov/grants/guide/notice-files/NOT-OD-14-124.html">
          https://grants.nih.gov/grants/guide/notice-files/NOT-OD-14-124.html
        </a>{' '}
        dbGaP Request Procedures to Access Individual-Level Data:
        <a href="https://dbgap.ncbi.nlm.nih.gov/aa/dbgap_request_process.pdf">
          https://dbgap.ncbi.nlm.nih.gov/aa/dbgap_request_process.pdf
        </a>
      </li>
    </ul>
    <div>
      If you have any questions about these terms, conditions or the practices of this site or any
      of the other Services, please contact us at
      <a href="mailto:support@kidsfirstdrc.org">support@kidsfirstdrc.org</a>.
    </div>
  </Space>
);

const TermsConditions = ({ isMultiStep = false, hidden = false, onFinish }: OwnProps) => {
  const history = useHistory();
  const [form] = Form.useForm();

  const handleCancel = () => history.push(STATIC_ROUTES.LOGIN);
  const handleSubmit = () => form.submit();
  const inlineStyle = hidden ? { display: 'none' } : {};

  return (
    <Form
      layout="vertical"
      className={styles.mainWrapper}
      form={form}
      onFinish={onFinish}
      style={inlineStyle}
    >
      <Space direction="vertical" size={24} className={styles.termsAndConditionsWrapper}>
        <Title level={3}>KIDS FIRST Portal Registration Process</Title>
        <GridCard
          wrapperClassName={styles.cardWrapper}
          className={styles.card}
          title={
            <div className={styles.termsCardHeader}>
              <Title level={5}>KIDS FIRST Portal Terms & Conditions</Title>
              <span className={styles.lastUpdateDate}>Last Update: 11/22/2021</span>
            </div>
          }
          content={
            <ScrollContent className={styles.termsListWrapper}>
              <TermsConditionsContent />
            </ScrollContent>
          }
        />

        <Form.Item
          name="acceptedTerms"
          rules={[{ required: true, message: 'You must agree with the Terms and Conditions' }]}
        >
          <Checkbox.Group>
            <Checkbox value="acceptedTerms">
              I have read and agree to the KF Portal Terms and Conditions
            </Checkbox>
          </Checkbox.Group>
        </Form.Item>

        <Row justify="end">
          <Space size={16}>
            <Button onClick={handleCancel} size={'large'}>
              Cancel
            </Button>
            <Button type={'primary'} size={'large'} onClick={handleSubmit}>
              {isMultiStep ? 'Next' : 'Accept'}
            </Button>
          </Space>
        </Row>
      </Space>
    </Form>
  );
};

export default TermsConditions;
