import React, { Fragment } from 'react';
import { compose, withState, withHandlers } from 'recompose';
import styled from 'react-emotion';
import { withFormik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { SocialIcon } from 'react-social-icons';
import { withTheme } from 'emotion-theming';

import { kfFacebook, kfTwitter, kfGithub } from 'common/injectGlobals';
import { EditButton, StyledSection, ClickToAdd, InterestsCard, CardHeader } from './ui';

import orchidIcon from 'assets/icon-findemeon-orchid.png';
import { Flex } from 'uikit/Core';
import ExternalLink from 'uikit/ExternalLink';
import WebsiteIcon from 'icons/WebsiteIcon';
import GoogleScholarIcon from 'icons/GoogleScholarIcon';
import LinkedInIcon from 'icons/LinkedInIcon';
import ErrorIcon from 'icons/ErrorIcon';
import Tooltip from 'uikit/Tooltip';
import Row from 'uikit/Row';
import Column from 'uikit/Column';
import { H4 } from 'uikit/Headings';

import { TRACKING_EVENTS, trackProfileInteraction } from 'services/analyticsTracking';
import { WhiteButton, TealActionButton } from '../../uikit/Button';

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
  margin-left: 40px;
`;

const ClearIcon = styled(ErrorIcon)`
  position: absolute;
  top: 8px;
  right: 0;
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
    name: 'Website URL:',
    placeholder: 'e.g. kidsfirstdrc.org',
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
    name: 'Google Scholar URL:',
    placeholder: 'e.g. scholar.google.com/citations?user=CsD2_4MAAAAJ',
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
    name: 'LinkedIn URL:',
    placeholder: 'e.g. linkedin.com/in/acresnick',
    type: 'text',
  },
  facebook: {
    icon: <SocialIcon url={kfFacebook} style={{ width: 28, height: 28, margin: '5px 10px 0 0' }} />,
    name: 'Facebook URL:',
    placeholder: 'e.g. facebook.com/kidsfirstDRC',
    type: 'text',
  },
  twitter: {
    icon: <SocialIcon url={kfTwitter} style={{ width: 28, height: 28, margin: '5px 10px 0 0' }} />,
    name: 'Twitter handle/username:',
    placeholder: 'e.g. @kidsfirstDRC',
    type: 'text',
    href: v => `https://twitter.com/${v}`,
    linkText: v => `@${v}`,
  },
  github: {
    icon: <SocialIcon url={kfGithub} style={{ width: 28, height: 28, margin: '5px 10px 0 0' }} />,
    name: 'Github username:',
    placeholder: 'e.g. kids-first',
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
    name: 'ORCID iD:',
    placeholder: 'e.g. 0000-0003-0436-4189',
    type: 'text',
    href: v => `https://orcid.org/${v}`,
  },
};

const ActionButtons = ({ handleReset, handleIsEditing, handleSubmit, errors, ...rest }) => (
  <Flex {...rest} justifyContent="flex-end">
    <WhiteButton
      mx="10px"
      onClick={() => {
        handleReset();
        handleIsEditing({ value: false });
      }}
    >
      Cancel
    </WhiteButton>
    <Tooltip
      position="bottom"
      html="Please fix errors before saving"
      open={!!Object.keys(errors || {}).length}
    >
      <TealActionButton
        disabled={!!Object.keys(errors || {}).length}
        onClick={async e => {
          handleSubmit(e);
          handleIsEditing({ value: false, type: TRACKING_EVENTS.actions.save });
        }}
      >
        Save
      </TealActionButton>
    </Tooltip>
  </Flex>
);

export default compose(
  withTheme,
  withState('isEditing', 'setIsEditing', false),
  withState('currentField', 'setCurrentField', null),
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
    handleSetCurrentField: ({ setCurrentField, values, handleChange }) => (e, field) => {
      handleChange(e);
      setCurrentField(field);
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
    setFieldValue,
    handleSetCurrentField,
    currentField,
    setCurrentField,
  }) => (
    <InterestsCard p={3}>
      <Fragment>
        <Form>
          <CardHeader>
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
          </CardHeader>

          <StyledSection>
            {canEdit &&
              !isEditing &&
              !Object.values(values).filter(Boolean).length && (
                <Fragment>
                  <H4 mt="29px">
                    Add links to your personal channels such as Google Scholar, ORCHID, GitHub,
                    LinkedIn, Twitter and Facebook.
                  </H4>
                  <ClickToAdd onClick={() => setIsEditing(true)}>click to add</ClickToAdd>
                </Fragment>
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
                      <Column pb="5px">
                        <StyledLabel>{config.name}</StyledLabel>
                        <Row position="relative">
                          {config.icon}
                          <ClearIcon
                            fill="#6a6262"
                            width="35px"
                            height="18px"
                            display={
                              currentField === field && values[field] !== '' ? 'block' : 'none'
                            }
                            onClick={() => setFieldValue(field, '')}
                          />
                          <Tooltip
                            position="left"
                            style={{ flex: '1 1 auto' }}
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
                              onClick={e => handleSetCurrentField(e, field)}
                              onChange={e => handleSetCurrentField(e, field)}
                            />
                          </Tooltip>
                        </Row>
                      </Column>
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
      </Fragment>
    </InterestsCard>
  ),
);
