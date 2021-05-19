import React from 'react';
import { SocialIcon } from 'react-social-icons';
import { CheckOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Typography } from 'antd';
import get from 'lodash/get';

import orchidIcon from 'assets/icon-findemeon-orchid.png';
import { ROLES } from 'common/constants';
import { kfFacebook, kfGithub, kfTwitter } from 'common/injectGlobals';
import style from 'components/UserProfile/style';
import GoogleScholarIcon from 'icons/GoogleScholarIcon';
import LinkedInIcon from 'icons/LinkedInIcon';
import WebsiteIcon from 'icons/WebsiteIcon';

import { findMeFields } from './constants';

const { Text } = Typography;

const addWebProtocolToUrlIfNeeded = (value) => {
  if (!value || value.startsWith('http://') || value.startsWith('https://')) {
    return value;
  }
  return `https://${value}`;
};

const href = addWebProtocolToUrlIfNeeded;

export const socialItems = (width = 32, height = 32) => {
  const commonSize = { height, width };
  return {
    website: {
      icon: <WebsiteIcon {...commonSize} />,
      name: 'Website URL',
      placeholder: 'e.g. kidsfirstdrc.org',
      type: 'text',
      service: 'Website',
      href,
    },
    googleScholarId: {
      icon: <GoogleScholarIcon {...commonSize} />,
      name: 'Google Scholar URL',
      placeholder: 'e.g. scholar.google.com/citations?user=CsD2_4MAAAAJ',
      type: 'text',
      service: 'Google Scholar',
      href,
    },
    linkedin: {
      icon: <LinkedInIcon {...commonSize} />,
      name: 'LinkedIn URL',
      placeholder: 'e.g. linkedin.com/in/acresnick',
      type: 'text',
      service: 'LinkedIn',
      href,
    },
    facebook: {
      icon: <SocialIcon url={kfFacebook} style={{ ...commonSize }} />,
      name: 'Facebook URL',
      placeholder: 'e.g. facebook.com/kidsfirstDRC',
      type: 'text',
      service: 'Facebook',
      href,
    },
    twitter: {
      icon: <SocialIcon url={kfTwitter} style={{ ...commonSize }} />,
      name: 'Twitter handle/username',
      placeholder: 'e.g. @kidsfirstDRC',
      type: 'text',
      href: (v) => `https://twitter.com/${v}`,
      linkText: (v) => `@${v}`,
      service: 'Twitter',
    },
    github: {
      icon: <SocialIcon url={kfGithub} style={{ ...commonSize }} />,
      name: 'Github username',
      placeholder: 'e.g. kids-first',
      type: 'text',
      href: (v) => `https://github.com/${v}`,
      service: 'Github',
    },
    orchid: {
      icon: <img alt="ORCHID" src={orchidIcon} {...commonSize} />,
      name: 'ORCID ID',
      placeholder: 'e.g. 0000-0003-0436-4189',
      type: 'text',
      href: (v) => `https://orcid.org/${v}`,
      service: 'Orchid',
    },
  };
};
export const userProfileBackground = (
  profile,
  { showBanner = true, gradientDirection = 'right' } = {},
) => {
  const role = ROLES.find((x) => x.type === get(profile, 'roles[0]', '')) || {};
  const banner = get(role, 'banner', '');
  const profileColors = get(role, 'profileColors', {});
  return {
    position: 'relative',
    backgroundPositionX: 'right',
    backgroundRepeat: 'no-repeat',
    backgroundImage: ` ${showBanner ? `url(${banner}), ` : ``}
      linear-gradient(
        to ${gradientDirection},
        ${profileColors.gradientDark} 33%,
        ${profileColors.gradientMid} 66%,
        ${profileColors.gradientLight}
      )`,
  };
};

export const extractFindMeFromProfile = (profile = {}) =>
  Object.entries(profile).reduce((accFindMe, [profileKey, profileValue]) => {
    if (findMeFields.includes(profileKey) && Boolean(profileValue)) {
      return { ...accFindMe, [profileKey]: profileValue };
    }
    return accFindMe;
  }, {});

export const extractRoleFromProfile = (profile) => profile?.roles[0] || '';

export const isResearcher = (role) => role === 'research';

export const isCommunity = (role) => role === 'community';

export const showInstitution = (role) => isResearcher(role) || isCommunity(role);

export const makeCommonCardPropsReadOnly = ({
  isProfileUpdating,
  title,
  onClickEditCb,
  canEdit,
}) => ({
  loading: isProfileUpdating,
  title: <Text className={'header-title'}>{title}</Text>,
  className: 'card-container',
  headStyle: style.cardHeadStyle,
  bodyStyle: style.cardBodyStyle,
  extra: canEdit ? (
    <Button
      size={'small'}
      icon={<EditOutlined />}
      shape="round"
      onClick={onClickEditCb}
      style={{ backgroundColor: 'rgb(144, 38, 142)', color: 'white' }}
    >
      EDIT
    </Button>
  ) : null,
});

export const makeCommonCardPropsEditing = ({
  isProfileUpdating,
  title,
  onClickCancelCb,
  disableSaveButton,
}) => ({
  loading: isProfileUpdating,
  title: <Text className={'header-title'}>{title}</Text>,
  className: 'card-container',
  headStyle: style.cardHeadStyle,
  bodyStyle: style.cardBodyStyleWhenEditing,
  extra: (
    <>
      <Button
        size={'small'}
        className={'extra-button'}
        shape="round"
        onClick={onClickCancelCb}
        style={{ color: 'rgb(144, 38, 142)' }}
      >
        CANCEL
      </Button>
      <Button
        size={'small'}
        className={'extra-button'}
        icon={<CheckOutlined />}
        shape="round"
        style={{
          backgroundColor: disableSaveButton ? 'lightgrey' : 'rgb(144, 38, 142)',
          color: 'white',
        }}
        disabled={Boolean(disableSaveButton)}
        htmlType="submit"
      >
        SAVE
      </Button>
    </>
  ),
});

export const showWhenHasDataOrCanEdit = (data, canEdit) => Boolean(data) || canEdit;

//When persona throws an AccessError, show details to user.
export const getMsgFromAccessError = (rawError, defaultMsgIfNotFound = '') =>
  rawError?.response?.data?.message || defaultMsgIfNotFound;
