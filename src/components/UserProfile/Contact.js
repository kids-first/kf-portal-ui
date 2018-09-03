import React from 'react';
import { compose } from 'recompose';
import { EditButton, H2, H3 } from './ui';
import BasicInfoForm from 'components/forms/BasicInfoForm';
import { injectState } from 'freactal';
import { Box, ExternalLink } from 'uikit/Core';
import styled from 'react-emotion';
import EnvelopeIcon from 'icons/EnvelopeIcon';
import MapMarkerIcon from 'icons/MapMarkerIcon';
import PhoneIcon from 'icons/PhoneIcon';
import Row from 'uikit/Row';
import { Section } from 'uikit/Core';
import { withApi } from 'services/api';
import { formatPhoneNumber, formatAddressLine } from 'common/displayFormatters';

const EmailLink = styled(ExternalLink)`
  text-decoration: underline;
  width: auto;
`;

const ContactItem = styled(Section)`
  line-height: 1.83;
`;

const Address = styled('div')`
  text-transform: capitalize;
`;

const Contact = compose(injectState, withApi)(({ effects: { setModal }, api, profile, mt }) => {
  const {
    addressLine1,
    addressLine2,
    institution,
    city,
    country,
    state,
    email,
    phone,
    zip,
  } = profile;

  return (
    <Box mt={mt}>
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

      {(addressLine1 || addressLine2 || institution || city || country || state) && (
        <Row alignItems="flex-start" mb={'20px'}>
          <MapMarkerIcon height={'17px'} style={{ position: 'relative', top: '4px' }} />
          <ContactItem ml={'7px'}>
            <Address>
              {institution && <H3>{institution}</H3>}
              <div>{formatAddressLine([addressLine1, addressLine2])}</div>
              <div>{formatAddressLine([city, state, country])}</div>
            </Address>
            {zip && <div>{zip.toUpperCase()}</div>}
          </ContactItem>
        </Row>
      )}

      {email && (
        <Row alignItems="center" mb={'20px'}>
          <EnvelopeIcon height={'10px'} />
          <ContactItem ml={'7px'}>
            <EmailLink bare primary bold href="mailto:simonscientist@chop.edu">
              {email}
            </EmailLink>
          </ContactItem>
        </Row>
      )}

      {phone && (
        <Row alignItems="center" mb={'20px'}>
          <PhoneIcon height={'12px'} />
          <ContactItem ml={'7px'}>{formatPhoneNumber(phone)}</ContactItem>
        </Row>
      )}
    </Box>
  );
});

export default Contact;
