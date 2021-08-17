import React from 'react';
import { compose } from 'recompose';

import useFenceStudies from 'hooks/useFenceStudies';
import RightChevron from 'icons/DoubleChevronRightIcon';
import StackIcon from 'icons/StackIcon';
import { withApi } from 'services/api';
import { withHistory } from 'services/history';
import Column from 'uikit/Column';
import { Span } from 'uikit/Core';
import ExternalLink from 'uikit/ExternalLink';
import { PromptMessageContainer } from 'uikit/PromptMessage';
import Row from 'uikit/Row';
import { Spinner } from 'uikit/Spinner';

import './FenceAuthorizedStudies.css';

const sqonForStudy = (studyId) => ({
  op: 'and',
  content: [
    {
      op: 'in',
      content: {
        field: 'participants.study.external_id',
        value: [studyId],
      },
    },
  ],
});

const FenceAuthorizedStudies = compose(
  withApi,
  withHistory,
)(({ onCloseModalCb, api, fence, history }) => {
  const { fenceAuthStudies, loadingStudiesForFences } = useFenceStudies(api);

  const isLoadingStudies = loadingStudiesForFences.includes(fence);
  if (isLoadingStudies) {
    return <Spinner />;
  }
  return (
    <div className={'fenceAuthorizedStudiesContainer'}>
      <Column>
        {fenceAuthStudies.length ? (
          <>
            <Row style={{ margin: '10px 0' }}>
              <Span className="title" fontWeight={'bold'}>
                {' '}
                You have access to controlled datasets from the following studies:
              </Span>
            </Row>
            <Column pl={15}>
              {fenceAuthStudies.map(({ id, studyShortName }) => (
                <Row className={'itemRowContainer'} key={id}>
                  <Column justifyContent="center" p={15}>
                    <StackIcon width={20} />
                  </Column>
                  <Column flex={1} justifyContent="center" pr={10}>
                    <Span>
                      <strong>{studyShortName}</strong> ({`${id}`})
                    </Span>
                  </Column>
                  <Column justifyContent="center">
                    <ExternalLink hasExternalIcon={false}>
                      <Span
                        onClick={() => {
                          history.push(
                            `/search/file?sqon=${encodeURI(JSON.stringify(sqonForStudy(id)))}`,
                          );
                          onCloseModalCb();
                        }}
                      >
                        {'View data files'} <RightChevron width={10} fill={'#90278e'} />
                      </Span>
                    </ExternalLink>
                  </Column>
                </Row>
              ))}
            </Column>
          </>
        ) : (
          <Row>
            <PromptMessageContainer warning mb={0} width={'100%'}>
              <Span className="title" fontWeight={'bold'}>
                {"You don't have access to any study-controlled datasets."}
              </Span>
            </PromptMessageContainer>
          </Row>
        )}
      </Column>
    </div>
  );
});

export default FenceAuthorizedStudies;
