import React from 'react';
import FBIcon from 'react-icons/lib/fa/facebook';
import { CheckCircleTwoTone } from '@ant-design/icons';
import { Card, Typography } from 'antd';
import keycloak from 'keycloak';

import gicon from 'assets/google-icon.png';
import { FACEBOOK, GOOGLE, ORCID, RAS } from 'common/constants';
import OrcidIcon from 'icons/OrcidIcon';

import './style.css';

const { Text } = Typography;

const KNOWN_PROVIDERS = [GOOGLE, FACEBOOK, ORCID, RAS];

const icons = {
  [GOOGLE]: <img src={gicon} style={{ width: 18, height: 18 }} alt={'google'} />,
  [FACEBOOK]: <FBIcon color="#428bca" size={20} />,
  [ORCID]: <OrcidIcon size={20} />,
  [RAS]: <span />, // No logo for RAS
};

const providerLabel = {
  [GOOGLE]: 'Google',
  [FACEBOOK]: 'Facebook',
  [ORCID]: 'Orcid',
  [RAS]: 'NIH Researcher Auth Service',
};

const isConnectedWithKnownProvider = (provider) => KNOWN_PROVIDERS.includes(provider);

const ConnectionProvider = () => {
  const provider = keycloak.tokenParsed['identity_provider'];
  const providerIdentity = keycloak.tokenParsed['identity_provider_identity'];
  if (!isConnectedWithKnownProvider(provider)) {
    return null;
  }
  return (
    <Card className={'card'}>
      <>
        <CheckCircleTwoTone twoToneColor="#52c41a" />
        <Text> {`You are connected with ${providerLabel[provider]}`} </Text>
        {icons[provider]}
        <Text> {` using this account : ${providerIdentity}`} </Text>
      </>
    </Card>
  );
};

export default ConnectionProvider;
