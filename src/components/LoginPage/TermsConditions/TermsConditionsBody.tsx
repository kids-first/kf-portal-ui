import React, { FunctionComponent } from 'react';
import { Typography } from 'antd';

import './index.css';

const { Paragraph } = Typography;

const TermsConditionsBody: FunctionComponent = () => (
  <div className={'content-body-wrapper terms-and-conditions'}>
    <Paragraph>
      As a user of the Services you agree that you are 13 years of age or older and furthermore
      agree to the Terms and Conditions of Services defined herein and where applicable the terms
      defined by the{' '}
      <a href="https://osp.od.nih.gov/wp-content/uploads/Genomic_Data_User_Code_of_Conduct.pdf">
        NIH Genomic Data User Code of Conduct
      </a>
      . These terms include, but are not limited to:
    </Paragraph>
    <Paragraph>
      <ol>
        <li>
          You will request controlled-access datasets solely in connection with the research project
          described in an approved Data Access Request for each dataset;
        </li>
        <li>
          You will make no attempt to identify or contact individual participants or groups from
          whom data were collected, or generate information that could allow participants’
          identities to be readily ascertained;
        </li>
        <li>
          You will not distribute controlled-access datasets to any entity or individual beyond
          those specified in an approved Data Access Request;
        </li>
        <li>
          You will adhere to computer security practices in compliance with{' '}
          <a
            href={
              // eslint-disable-next-line max-len
              'https://osp.od.nih.gov/wp-content/uploads/NIH_Best_Practices_for_Controlled-Access_Data_Subject_to_the_NIH_GDS_Policy.pdf'
            }
          >
            NIH Security Best Practices for Controlled-Access Data{' '}
          </a>{' '}
          such that only authorized individuals possess access to data files;
        </li>
        <li>
          You acknowledge Intellectual Property Policies should they exist as specified in a
          dataset’s associated Data Use Certification; and,
        </li>
        <li>
          You will report any inadvertent data release in accordance with the terms in the Data Use
          Certification, breach of data security, or other data management incidents contrary to the
          terms of data access.
        </li>
      </ol>
    </Paragraph>
    <Paragraph>
      DRC terms and conditions may be changed at any time via a public posting of revisions to the
      Services. As a user, you agree to review the{' '}
      <a href={'https://kidsfirstdrc.org/policies/'} target="_blank" rel="noreferrer">
        Terms & Conditions and Privacy Policies
      </a>{' '}
      each time you use the Services so that you are aware of any modifications made to these
      policies. By accessing or using the Services, you agree with and to be bound by all of the
      terms and conditions and policies as posted on the Services at the time of your access or use,
      including the Privacy Policies then in effect.
    </Paragraph>
    <Paragraph>
      For documents and/or data available from the Services, the DRC does not warrant or assume any
      legal liability or responsibility for the accuracy, completeness, or usefulness of any
      information, apparatus, product, or process. No specific medical advice is provided by any
      Services, and the Kids First DRC urges users of Services to consult with a qualified physician
      for diagnosis and for answers to personal questions.
    </Paragraph>
    <Paragraph>
      For more information about the NIH Genomic Data Sharing Policy and applying for
      Controlled-Access Data through dbGaP visit:
    </Paragraph>
    <Paragraph>
      <dl>
        <dd>
          -NIH Genomic Data Sharing Policy:
          <a href={'https://grants.nih.gov/grants/guide/notice-files/NOT-OD-14-124.html'}>
            https://grants.nih.gov/grants/guide/notice-files/NOT-OD-14-124.html
          </a>
        </dd>
        <dd>
          -dbGaP Request Procedures to Access Individual-Level Data:
          <a href={'https://dbgap.ncbi.nlm.nih.gov/aa/dbgap_request_process.pdf'}>
            https://dbgap.ncbi.nlm.nih.gov/aa/dbgap_request_process.pdf
          </a>
        </dd>
      </dl>
    </Paragraph>
    <Paragraph>
      If you have any questions about these terms, conditions or the practices of this site or any
      of the other Services, please contact us at{' '}
      <a href={'mailto:support@kidsfirstdrc.org'}>support@kidsfirstdrc.org</a>.
    </Paragraph>
  </div>
);

export default TermsConditionsBody;
