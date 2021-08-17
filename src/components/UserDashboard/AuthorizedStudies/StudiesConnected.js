import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';

import { kfWebRoot } from 'common/injectGlobals';
import { TRACKING_EVENTS, trackUserInteraction } from 'services/analyticsTracking';
import { createAcceptedFilesByUserStudySqon, createStudyIdSqon } from 'services/fileAccessControl';
import { withHistory } from 'services/history';
import Column from 'uikit/Column';
import { Box, Link } from 'uikit/Core';

import Info from '../Info';
import { PromptMessageContainer, PromptMessageContent, PromptMessageHeading } from '../styles';

import Study from './Study';

import { studiesList } from '../UserDashboard.module.css';

const groupStudiesById = (fenceAuthStudies) =>
  fenceAuthStudies.reduce((obj, study) => {
    obj[study.id] = study;
    return obj;
  }, {});

const StudiesConnected = compose(withHistory)(({ user, fenceAuthStudies, history }) => {
  const hasAuthorizedStudies = fenceAuthStudies && fenceAuthStudies.length > 0;
  if (hasAuthorizedStudies) {
    const studiesById = groupStudiesById(fenceAuthStudies);

    const onStudyTotalClick = (studyId) => () => {
      trackUserInteraction({
        category: TRACKING_EVENTS.categories.user.dashboard.widgets.authorizedStudies,
        action: `Studies Total: ${TRACKING_EVENTS.actions.click}`,
        label: `studyId: ${studyId}`,
      });
      history.push(`/search/file?sqon=${encodeURI(JSON.stringify(createStudyIdSqon(studyId)))}`);
    };

    const onStudyAuthorizedClick = (studyId, eventOrigin) => {
      trackUserInteraction({
        category: TRACKING_EVENTS.categories.user.dashboard.widgets.authorizedStudies,
        action: `${eventOrigin}: ${TRACKING_EVENTS.actions.click}`,
        label: `studyId: ${studyId}`,
      });
      const consentCodes = studiesById[studyId].acl;
      history.push(
        `/search/file?sqon=${encodeURI(
          JSON.stringify(createAcceptedFilesByUserStudySqon(consentCodes)({ studyId })),
        )}`,
      );
    };
    return (
      <Column scrollY className={studiesList}>
        {fenceAuthStudies.map((study) => (
          <Study
            key={study.id}
            studyId={study.id}
            name={study.studyShortName}
            consentCodes={study.acl}
            authorized={study.authorizedFiles}
            total={study.totalFiles}
            onStudyTotalClick={onStudyTotalClick(study.id)}
            onStudyAuthorizedClick={onStudyAuthorizedClick}
          />
        ))}
      </Column>
    );
  }

  return (
    <Column>
      <Box mt={20}>
        <Column>
          <PromptMessageContainer info mb={'8px'}>
            <PromptMessageHeading mb={10}>
              {'You are connected to a data repository partner,' +
                " but you don't have access to controlled data\n" +
                '      yet.'}
            </PromptMessageHeading>
            <PromptMessageContent>
              Start applying from our{' '}
              <Link
                className="color-primary"
                to={{
                  pathname: `/user/${user._id}`,
                  hash: '#settings',
                }}
              >
                studies and access page.
              </Link>
            </PromptMessageContent>
          </PromptMessageContainer>
          <Info
            link={{
              url: `${kfWebRoot}/support/studies-and-access/#applying-for-data-access`,
              text: 'applying for data access.',
            }}
          />
        </Column>{' '}
      </Box>
    </Column>
  );
});

StudiesConnected.propTypes = {
  fenceAuthStudies: PropTypes.array,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};

export default StudiesConnected;
