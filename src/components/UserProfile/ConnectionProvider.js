import React from 'react';
import FBIcon from 'react-icons/lib/fa/facebook';
import { CheckCircleTwoTone } from '@ant-design/icons';
import { Card, Typography } from 'antd';
import capitalize from 'lodash/capitalize';
import PropTypes from 'prop-types';

import gicon from 'assets/google-icon.png';
import { FACEBOOK, GOOGLE, ORCID } from 'common/constants';
import OrcidIcon from 'icons/OrcidIcon';

import useUser from '../../hooks/useUser';

import './style.css';

const { Text } = Typography;

const KNOWN_PROVIDERS = [GOOGLE, FACEBOOK, ORCID];

const icons = {
  [GOOGLE]: <img src={gicon} style={{ width: 18, height: 18 }} alt={'google'} />,
  [FACEBOOK]: <FBIcon color="#428bca" size={20} />,
  [ORCID]: <OrcidIcon size={20} />,
};

const isConnectedWithKnownProvider = (provider) => KNOWN_PROVIDERS.includes(provider);

const ConnectionProvider = (props) => {
  const { userEmail } = props;

  const { loginProvider } = useUser();
  if (!isConnectedWithKnownProvider(loginProvider)) {
    return null;
  }
  return (
    <Card className={'card'}>
      <>
        <CheckCircleTwoTone twoToneColor="#52c41a" />
        <Text> {`You are connected with ${capitalize(loginProvider)}`} </Text>
        {icons[loginProvider]}
        <Text> {` using this email address : ${userEmail}`} </Text>
      </>
    </Card>
  );
};

ConnectionProvider.propTypes = {
  userEmail: PropTypes.string.isRequired,
};

export default ConnectionProvider;
