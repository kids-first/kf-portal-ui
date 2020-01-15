import { get } from 'lodash';
import { ROLES } from 'common/constants';
import React, { Fragment } from 'react';
import { SocialIcon } from 'react-social-icons';
import { kfFacebook, kfGithub, kfTwitter } from 'common/injectGlobals';
import orchidIcon from 'assets/icon-findemeon-orchid.png';
import WebsiteIcon from 'icons/WebsiteIcon';
import GoogleScholarIcon from 'icons/GoogleScholarIcon';
import LinkedInIcon from 'icons/LinkedInIcon';
import { findMeFields } from './constants';
import style from 'components/UserProfile/style';
import { Button, Typography } from 'antd';

const { Text } = Typography;

const addWebProtocolToUrlIfNeeded = value => {
  if (!value || value.startsWith('http://') || value.startsWith('https://')) {
    return value;
  }
  return `https://${value}`;
};

const href = v => addWebProtocolToUrlIfNeeded(v);

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
      href: v => `https://twitter.com/${v}`,
      linkText: v => `@${v}`,
      service: 'Twitter',
    },
    github: {
      icon: <SocialIcon url={kfGithub} style={{ ...commonSize }} />,
      name: 'Github username',
      placeholder: 'e.g. kids-first',
      type: 'text',
      href: v => `https://github.com/${v}`,
      service: 'Github',
    },
    orchid: {
      icon: <img alt="ORCHID" src={orchidIcon} {...commonSize} />,
      name: 'ORCID ID',
      placeholder: 'e.g. 0000-0003-0436-4189',
      type: 'text',
      href: v => `https://orcid.org/${v}`,
      service: 'Orchid',
    },
  };
};
export const userProfileBackground = (
  profile,
  { showBanner = true, gradientDirection = 'right' } = {},
) => {
  const role = ROLES.find(x => x.type === get(profile, 'roles[0]', '')) || {};
  const banner = get(role, 'banner', '');
  const profileColors = get(role, 'profileColors', {});
  return {
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

export const extractFindMeFromProfile = (profile = {}) => {
  return Object.entries(profile).reduce((accFindMe, [profileKey, profileValue]) => {
    if (findMeFields.includes(profileKey) && Boolean(profileValue)) {
      return { ...accFindMe, [profileKey]: profileValue };
    }
    return accFindMe;
  }, {});
};

export const isResearcher = data => {
  return data.roles[0] === 'research';
};

export const isCommunity = data => {
  return data.roles[0] === 'community';
};

export const showInstitution = data => {
  return isResearcher(data) || isCommunity(data);
};

export const makeCommonCardPropsReadOnly = ({
  isProfileUpdating,
  title,
  onClickEditCb,
  canEdit,
}) => {
  return {
    loading: isProfileUpdating,
    title: <Text className={'header-title'}>{title}</Text>,
    className: 'card-container',
    headStyle: style.cardHeadStyle,
    bodyStyle: style.cardBodyStyle,
    extra: canEdit ? (
      <Button
        size={'small'}
        icon="edit"
        shape="round"
        onClick={onClickEditCb}
        style={{ backgroundColor: 'rgb(144, 38, 142)', color: 'white' }}
      >
        EDIT
      </Button>
    ) : null,
  };
};

export const makeCommonCardPropsEditing = ({
  isProfileUpdating,
  title,
  onClickCancelCb,
  disableSaveButton,
}) => {
  return {
    loading: isProfileUpdating,
    title: <Text className={'header-title'}>{title}</Text>,
    className: 'card-container',
    headStyle: style.cardHeadStyle,
    bodyStyle: style.cardBodyStyleWhenEditing,
    extra: (
      <Fragment>
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
          icon="check"
          shape="round"
          style={{
            backgroundColor: Boolean(disableSaveButton) ? 'lightgrey' : 'rgb(144, 38, 142)',
            color: 'white',
          }}
          disabled={Boolean(disableSaveButton)}
          htmlType="submit"
        >
          SAVE
        </Button>
      </Fragment>
    ),
  };
};

export const showWhenHasDataOrCanEdit = (data, canEdit) => {
  return Boolean(data) || canEdit;
};

export const hasFieldInError = fields =>
  Object.entries(fields || {}).some(([, value]) => Array.isArray(value) && value.length > 0);
