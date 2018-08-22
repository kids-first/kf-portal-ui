import React from 'react';
import { compose } from 'recompose';
import { EditButton, H2 } from './ui';
import BasicInfoForm from 'components/forms/BasicInfoForm';
import { injectState } from 'freactal';
import { Box } from 'uikit/Core';
import styled from 'react-emotion';

const Section = styled(Box)`
  margin-bottom: 5px;
`;

const Contact = compose(injectState)(({ effects: { setModal }, api }) => (
  <React.Fragment>
    <H2>
      Contact Information
      <EditButton
        onClick={() => {
          setModal({
            title: 'Edit Basic Information',
            component: <BasicInfoForm {...{ api }} />,
          });
        }}
      />
    </H2>
    <Section>
      <h4>Children’s Hospital of Philadelphia</h4>
      <span>3401 Civic Center Blvd Philadelphia</span>
      <span>PA,</span>
      <span>USA 19104</span>
    </Section>
    <Section> simonscientist@chop.edu</Section>
    <Section> 555-555-5555</Section>
  </React.Fragment>
));

export default Contact;
