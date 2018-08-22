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
import PhoneIcon from '../../icons/PhoneIcon';
import Row from 'uikit/Row';
import { Section } from '../../uikit/Core';

const EmailLink = styled(ExternalLink)`
  text-decoration: underline;
  width: auto;
`;

const ContactItem = styled(Section)`
  line-height: 1.83;
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

    <Row alignItems="flex-start" mb={'20px'}>
      <MapMarkerIcon height={'17px'} style={{ position: 'relative', top: '4px' }} />
      <ContactItem ml={'7px'}>
        <H3>Children’s Hospital of Philadelphia</H3>
        <div>3401 Civic Center Blvd </div>
        <div>Philadelphia, PA, USA</div>
        <div>19104</div>
      </ContactItem>
    </Row>

    <Row alignItems="center" mb={'20px'}>
      <EnvelopeIcon height={'10px'} />
      <ContactItem ml={'7px'}>
        <EmailLink bare primary bold href="mailto:simonscientist@chop.edu">
          simonscientist@chop.edu
        </EmailLink>
      </ContactItem>
    </Row>

    <Row alignItems="center">
      <PhoneIcon height={'12px'} />
      <ContactItem ml={'7px'}>555-555-5555</ContactItem>
    </Row>
  </Box>
));

export default Contact;
