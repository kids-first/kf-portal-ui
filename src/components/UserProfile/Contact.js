import React from 'react';
import { compose } from 'recompose';
import { EditButton, H2, H3 } from './ui';
import BasicInfoForm from 'components/forms/BasicInfoForm';
import { injectState } from 'freactal';
import { Box, ExternalLink } from 'uikit/Core';
import styled from 'react-emotion';
import { withTheme } from 'emotion-theming';
import EnvelopeIcon from '../../icons/EnvelopeIcon';
import MapMarkerIcon from '../../icons/MapMarkerIcon';

const Section = styled(Box)`
  ${({ theme }) => theme.column};
  margin-bottom: 5px;
`;

const EmailLink = styled(ExternalLink)`
  text-decoration: underline;
  width: auto;
`;

const Contact = compose(injectState, withTheme)(({ effects: { setModal }, api }, ...props) => (
  <Box {...props}>
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
      <H3>
        <MapMarkerIcon height={'17px'} />
        Children’s Hospital of Philadelphia
      </H3>
      <span>3401 Civic Center Blvd </span>
      <span>Philadelphia, PA, USA</span>
      <span> 19104</span>
    </Section>
    <Section>
      <EmailLink bare primary bold href="mailto:simonscientist@chop.edu">
        <EnvelopeIcon height={'10px'} />
        simonscientist@chop.edu
      </EmailLink>
    </Section>
    <Section>555-555-5555</Section>
  </Box>
));

export default Contact;
