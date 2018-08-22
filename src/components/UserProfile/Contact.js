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

    <Row mb={'20px'}>
      <MapMarkerIcon height={'17px'} style={{ marginRight: '7px' }} />
      <Box mr={'7px'}>
        <H3>Children’s Hospital of Philadelphia</H3>
        <div>3401 Civic Center Blvd </div>
        <div>Philadelphia, PA, USA</div>
        <div>19104</div>
      </Box>
    </Row>

    <Row alignItems="center" mb={'20px'}>
      <Box mr={'7px'}>
        <EnvelopeIcon height={'10px'} style={{ marginRight: '7px' }} />
        <EmailLink bare primary bold href="mailto:simonscientist@chop.edu">
          simonscientist@chop.edu
        </EmailLink>
      </Box>
    </Row>

    <Row alignItems="center">
      <Box mr={'7px'}>
        <PhoneIcon height={'12px'} style={{ marginRight: '7px' }} />
        555-555-5555
      </Box>
    </Row>
  </Box>
));

export default Contact;
