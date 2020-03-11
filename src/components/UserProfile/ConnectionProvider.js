import React from 'react';
import { injectState } from 'freactal';
import PropTypes from 'prop-types';
import { CheckCircleTwoTone } from '@ant-design/icons';
import { Card, Typography } from 'antd';
import { compose, setPropTypes } from 'recompose';
import FBIcon from 'react-icons/lib/fa/facebook';
import OrcidIcon from 'icons/OrcidIcon';

import { FACEBOOK, GOOGLE, ORCID } from 'common/constants';
import gicon from 'assets/google-icon.png';
import './style.css';
import capitalize from 'lodash/capitalize';

const { Text } = Typography;

const KNOWN_PROVIDERS = [GOOGLE, FACEBOOK, ORCID];

const icons = {
  [GOOGLE]: <img src={gicon} style={{ width: 18, height: 18 }} alt={'google'} />,
  [FACEBOOK]: <FBIcon color="#428bca" size={20} />,
  [ORCID]: <OrcidIcon size={20} />,
};

const isConnectedWithKnownProvider = provider => KNOWN_PROVIDERS.includes(provider);

const ConnectionProvider = props => {
  const {
    userEmail,
    state: { loginProvider },
  } = props;

  if (!isConnectedWithKnownProvider(loginProvider)) {
    return null;
  }
  return (
    <Card className={'card'}>
      <React.Fragment>
        <CheckCircleTwoTone twoToneColor="#52c41a" />
        <Text> {`You are connected with ${capitalize(loginProvider)}`} </Text>
        {icons[loginProvider]}
        <Text> {` using this email address : ${userEmail}`} </Text>
      </React.Fragment>
    </Card>
  );
};

const Enhanced = compose(
  injectState,
  setPropTypes({
    state: PropTypes.shape({
      loginProvider: PropTypes.string,
    }).isRequired,
    userEmail: PropTypes.string.isRequired,
  }),
)(ConnectionProvider);

export default Enhanced;
