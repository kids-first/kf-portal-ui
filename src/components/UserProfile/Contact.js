import React from 'react';
import { compose } from 'recompose';
import { EditButton, H2, H3 } from './ui';
import BasicInfoForm from 'components/forms/BasicInfoForm';
import { injectState } from 'freactal';
import { Box, ExternalLink } from 'uikit/Core';
import styled from 'react-emotion';
import { withTheme } from 'emotion-theming';
import MapMarker from 'react-icons/lib/fa/map-marker';
import Envelope from 'react-icons/lib/fa/envelope';

const Section = styled(Box)`
  ${({ theme }) => theme.column};
  margin-bottom: 5px;
`;

const EmailLink = styled(ExternalLink)`
  text-decoration: underline;
`;

const MapMarkerIcon = styled(MapMarker)`
  color: #a42c90;
`;

const EnvelopeIcon = styled(Envelope)`
  color: #a42c90;
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
        <MapMarkerIcon size={16} />
        Children’s Hospital of Philadelphia
      </H3>
      <span>3401 Civic Center Blvd </span>
      <span>Philadelphia, PA, USA</span>
      <span> 19104</span>
    </Section>
    <Section>
      <EmailLink bare primary bold href="mailto:simonscientist@chop.edu">
        <EnvelopeIcon size={16} />
        simonscientist@chop.edu
      </EmailLink>
    </Section>
    <Section>555-555-5555</Section>
  </Box>
));

export default Contact;
