import React, { Fragment } from 'react';
import { compose, withState, withHandlers } from 'recompose';
import styled from 'react-emotion';
import { withFormik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { SocialIcon } from 'react-social-icons';
import { withTheme } from 'emotion-theming';

import { kfFacebook, kfTwitter, kfGithub } from 'common/injectGlobals';
import { EditButton, H2, H4, SaveButton, StyledSection, ClickToAdd, InterestsCard } from './ui';

import orchidIcon from 'assets/icon-findemeon-orchid.png';
import { Flex } from 'uikit/Core';
import { HollowButton } from 'uikit/Button';
import ExternalLink from 'uikit/ExternalLink';
import WebsiteIcon from 'icons/WebsiteIcon';
import GoogleScholarIcon from 'icons/GoogleScholarIcon';
import LinkedInIcon from 'icons/LinkedInIcon';
import Tooltip from 'uikit/Tooltip';
import Row from 'uikit/Row';
import Column from 'uikit/Column';

import { TRACKING_EVENTS, trackProfileInteraction } from 'services/analyticsTracking';

const StyledField = styled(Field)`
  ${({ theme }) => theme.input};
`;

const StyledLabel = styled('label')`
  font-family: ${({ theme }) => theme.fonts.details};
  font-size: 13px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: 2;
  letter-spacing: normal;
  text-align: left;
  color: ${({ theme }) => theme.greyScale1};
`;

const transformURL = value => {
  return value.length && value.indexOf('http://') !== 0 && value.indexOf('https://') !== 0
    ? `https://${value}`
    : value;
};

const SocialLinksSchema = Yup.object().shape({
  website: Yup.string()
    .trim()
    .transform(transformURL)
    .url('Invalid url'),
  googleScholarId: Yup.string()
    .trim()
    .transform(transformURL)
    .url('Invalid url'),
  linkedin: Yup.string()
    .trim()
    .transform(transformURL)
    .url('Invalid url'),
  facebook: Yup.string()
    .trim()
    .transform(transformURL)
    .url('Invalid url'),
  twitter: Yup.string()
    .trim()
    .transform(v => (v.length && v.indexOf('@') === 0 ? v.slice(1) : v)),
  github: Yup.string().trim(),
  orchid: Yup.string().trim(),
});

const socialItems = {
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
    name: 'Website URL',
    placeholder: 'eg. kidsfirstdrc.org',
    type: 'text',
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
    name: 'Google Scholar Id URL',
    placeholder: 'eg. e.g. scholar.google.com/citations?user=CsD2_4MAAAAJ',
    type: 'text',
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
    name: 'LinkedIn URL',
    placeholder: 'e.g. linkedin.com/in/acresnick',
    type: 'text',
  },
  facebook: {
    icon: <SocialIcon url={kfFacebook} style={{ width: 28, height: 28, margin: '5px 10px 0 0' }} />,
    name: 'Facebook URL',
    placeholder: 'e.g. facebook.com/kidsfirstDRC',
    type: 'text',
  },
  twitter: {
    icon: <SocialIcon url={kfTwitter} style={{ width: 28, height: 28, margin: '5px 10px 0 0' }} />,
    name: 'Twitter handle/username',
    placeholder: 'e.g. @simonSci',
    type: 'text',
    href: v => `https://twitter.com/${v}`,
    linkText: v => `@${v}`,
  },
  github: {
    icon: <SocialIcon url={kfGithub} style={{ width: 28, height: 28, margin: '5px 10px 0 0' }} />,
    name: 'Github username',
    placeholder: 'e.g. simonscientist',
    type: 'text',
    href: v => `https://github.com/${v}`,
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
    name: 'ORCHID ID',
    placeholder: 'e.g. 0000-0003-0436-4189',
    type: 'text',
    href: v => `https://orcid.org/${v}`,
  },
};

const ActionButtons = ({ handleReset, handleIsEditing, handleSubmit, errors, ...rest }) => (
  <Flex {...rest} justifyContent="flex-end">
    <HollowButton
      onClick={() => {
        handleReset();
        handleIsEditing({ value: false });
      }}
    >
      Cancel
    </HollowButton>
    <Tooltip
      position="bottom"
      html="Please fix errors before saving"
      open={!!Object.keys(errors || {}).length}
    >
      <SaveButton
        disabled={!!Object.keys(errors || {}).length}
        onClick={async e => {
          handleSubmit(e);
          handleIsEditing({ value: false, type: TRACKING_EVENTS.actions.save });
        }}
      >
        Save
      </SaveButton>
    </Tooltip>
  </Flex>
);

export default compose(
  withTheme,
  withState('isEditing', 'setIsEditing', false),
  withFormik({
    enableReinitialize: true,
    mapPropsToValues: ({ profile }) => {
      return Object.entries(profile).reduce(
        (acc, [key, value]) => ({
          ...acc,
          ...(Object.keys(socialItems).includes(key) ? { [key]: value ? value : '' } : {}),
        }),
        {},
      );
    },
    validate: (values, props) => {
      try {
        SocialLinksSchema.validateSync(values, { abortEarly: false });
      } catch (error) {
        return error.inner.reduce((acc, inner) => ({ ...acc, [inner.path]: inner.message }), {});
      }
    },
    handleSubmit: async (
      values: any,
      { props: { submit, errors }, setSubmitting, setErrors }: any,
    ) => {
      if (!errors) {
        const castValues = SocialLinksSchema.cast(values);
        submit(castValues);
      }
    },
  }),
  withHandlers({
    handleIsEditing: ({ setIsEditing }) => ({ type, value }) => {
      setIsEditing(value);
      trackProfileInteraction({ action: 'Find Me On', value, type });
    },
  }),
)(
  ({
    profile,
    canEdit,
    submit,
    isEditing,
    handleIsEditing,
    setIsEditing,
    errors,
    touched,
    values,
    handleReset,
    submitForm,
    handleSubmit,
    theme,
  }) => (
    <InterestsCard p={3}>
      <Fragment>
        <Form>
          <H2>
            Find me on
            {canEdit &&
              (!isEditing ? (
                <EditButton
                  onClick={() => {
                    handleIsEditing({ value: !isEditing });
                  }}
                />
              ) : (
                <ActionButtons {...{ handleIsEditing, handleReset, handleSubmit, errors }} />
              ))}
          </H2>
          <StyledSection>
            {canEdit &&
              !isEditing &&
              !Object.values(values).filter(Boolean).length && (
                <H4>
                  Add links to your personal channels such as Google Scholar, ORCHID, GitHub,
                  LinkedIn, Twitter and Facebook.
                </H4>
              )}
            <ul
              css={`
                list-style-type: none;
                padding: 0;
                margin: 0;
              `}
            >
              {Object.entries(socialItems)
                .filter(([field]) => isEditing || values[field])
                .map(([field, config]) => (
                  <li
                    key={field}
                    css={`
                      display: flex;
                      flex-direction: ${isEditing ? 'column' : 'row'};
                      padding: 5px 0 5px 0;
                      ${!isEditing && `border-bottom: ${theme.greyScale4} 1px solid;`};
                    `}
                  >
                    {isEditing ? (
                      <Row
                        css={`
                          align-items: center;
                          padding-bottom: 5px;
                        `}
                      >
                        {config.icon}
                        <Column>
                          <StyledLabel>{config.name}</StyledLabel>
                          <Tooltip
                            position="left"
                            html={(errors || {})[field]}
                            open={Object.keys(errors || {}).includes(field)}
                          >
                            <StyledField
                              css={
                                Object.keys(errors || {}).includes(field)
                                  ? `
                            border-color: red;
                          `
                                  : ''
                              }
                              id={field}
                              name={field}
                              placeholder={config.placeholder}
                              type={config.type}
                              value={values[field]}
                            />
                          </Tooltip>
                        </Column>
                      </Row>
                    ) : (
                      <Fragment>
                        {config.icon}
                        <ExternalLink
                          href={config.href ? config.href(values[field]) : values[field]}
                        >
                          {config.linkText ? config.linkText(values[field]) : values[field]}
                        </ExternalLink>
                      </Fragment>
                    )}
                  </li>
                ))}
              {isEditing ? (
                <ActionButtons
                  {...{ handleIsEditing, handleReset, handleSubmit, errors }}
                  mt={'20px'}
                />
              ) : null}
            </ul>
          </StyledSection>
        </Form>
        {canEdit &&
          !isEditing &&
          !Object.values(values).filter(Boolean).length && (
            <ClickToAdd onClick={() => setIsEditing(true)}>click to add</ClickToAdd>
          )}
      </Fragment>
    </InterestsCard>
  ),
);
