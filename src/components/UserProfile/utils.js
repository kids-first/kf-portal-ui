import { get } from 'lodash';
import { css } from 'emotion';
import { ROLES } from 'common/constants';
import React from 'react';
import { SocialIcon } from 'react-social-icons';
import { kfFacebook, kfGithub, kfTwitter } from 'common/injectGlobals';
import orchidIcon from 'assets/icon-findemeon-orchid.png';
import WebsiteIcon from 'icons/WebsiteIcon';
import GoogleScholarIcon from 'icons/GoogleScholarIcon';
import LinkedInIcon from 'icons/LinkedInIcon';

export const SOCIAL_ITEMS = {
  website: {
    icon: (
      <WebsiteIcon
        height={28}
        width={28}
        css={`
          margin: 5px 10px 0 0;
        `}
      />
    ),
    name: 'Website URL:',
    placeholder: 'e.g. kidsfirstdrc.org',
    type: 'text',
    service: 'Website',
  },
  googleScholarId: {
    icon: (
      <GoogleScholarIcon
        height={28}
        width={28}
        css={`
          margin: 5px 10px 0 0;
        `}
      />
    ),
    name: 'Google Scholar URL:',
    placeholder: 'e.g. scholar.google.com/citations?user=CsD2_4MAAAAJ',
    type: 'text',
    service: 'Google Scholar',
  },
  linkedin: {
    icon: (
      <LinkedInIcon
        height={28}
        width={28}
        css={`
          margin: 5px 10px 0 0;
        `}
      />
    ),
    name: 'LinkedIn URL:',
    placeholder: 'e.g. linkedin.com/in/acresnick',
    type: 'text',
    service: 'LinkedIn',
  },
  facebook: {
    icon: <SocialIcon url={kfFacebook} style={{ width: 28, height: 28, margin: '5px 10px 0 0' }} />,
    name: 'Facebook URL:',
    placeholder: 'e.g. facebook.com/kidsfirstDRC',
    type: 'text',
    service: 'Facebook',
  },
  twitter: {
    icon: <SocialIcon url={kfTwitter} style={{ width: 28, height: 28, margin: '5px 10px 0 0' }} />,
    name: 'Twitter handle/username:',
    placeholder: 'e.g. @kidsfirstDRC',
    type: 'text',
    href: v => `https://twitter.com/${v}`,
    linkText: v => `@${v}`,
    service: 'Twitter',
  },
  github: {
    icon: <SocialIcon url={kfGithub} style={{ width: 28, height: 28, margin: '5px 10px 0 0' }} />,
    name: 'Github username:',
    placeholder: 'e.g. kids-first',
    type: 'text',
    href: v => `https://github.com/${v}`,
    service: 'Github',
  },
  orchid: {
    icon: (
      <img
        alt="ORCHID"
        src={orchidIcon}
        height={28}
        css={`
          margin: 5px 10px 0 0;
        `}
      />
    ),
    name: 'ORCID ID:',
    placeholder: 'e.g. 0000-0003-0436-4189',
    type: 'text',
    href: v => `https://orcid.org/${v}`,
    service: 'Orchid',
  },
};
export const userProfileBackground = (
  profile,
  { showBanner = true, gradientDirection = 'right' } = {},
) => {
  const role = ROLES.find(x => x.type === get(profile, 'roles[0]', '')) || {};
  const banner = get(role, 'banner', '');
  const profileColors = get(role, 'profileColors', {});
  return css`
    background-position-x: right;
    background-repeat: no-repeat;
    background-image: ${showBanner ? `url(${banner}), ` : ``}
      linear-gradient(
        to ${gradientDirection},
        ${profileColors.gradientDark} 33%,
        ${profileColors.gradientMid} 66%,
        ${profileColors.gradientLight}
      );
  `;
};
