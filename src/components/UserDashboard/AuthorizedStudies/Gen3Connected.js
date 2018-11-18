import React, { Fragment } from 'react';
import { compose, lifecycle, withState } from 'recompose';

import { getUser as getGen3User, getStudyIds } from 'services/gen3';
import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';

import LoadingSpinner from 'uikit/LoadingSpinner';
import Row from 'uikit/Row';
import Column from 'uikit/Column';

import { Span } from 'uikit/Core';
import { PromptMessageContainer } from 'uikit/PromptMessage';

import { withApi } from 'services/api';

import Gen3ProjectList from './Gen3ProjectList';

const enhance = compose(
  injectState,
  withTheme,
  withState('gen3Key', 'setGen3Key', undefined),
  withState('userDetails', 'setUserDetails', {}),
  withState('loading', 'setLoading', false),
  withApi,
  lifecycle({
    async componentDidMount() {
      const { setUserDetails, api, setLoading } = this.props;
      setLoading(true);
      let userDetails = await getGen3User(api);
      setLoading(false);
      setUserDetails(userDetails);
    },
  }),
);

const Gen3Connected = ({
  state,
  effects,
  theme,
  userDetails,
  setUserDetails,
  loading,
  ...props
}) => (
  <div>
    {loading ? (
      <LoadingSpinner />
    ) : (
      <Column>
        {userDetails.projects && Object.keys(userDetails.projects).length ? (
          <Fragment>
            <Row my={10}>
              <Span className="title" fontWeight={'bold'}>
                You have access to controlled datasets from the following studies:
              </Span>
            </Row>
            <Column pl={15}>
              <Gen3ProjectList projectIds={getStudyIds(userDetails)} />
            </Column>
          </Fragment>
        ) : (
          <Row>
            <PromptMessageContainer warning mb={0} width={'100%'}>
              <Span className="title" fontWeight={'bold'}>
                You do not have access to any study
              </Span>
            </PromptMessageContainer>
          </Row>
        )}
      </Column>
    )}
  </div>
);

export default enhance(Gen3Connected);
