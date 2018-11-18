import React, { Fragment } from 'react';
import { compose, lifecycle, withState } from 'recompose';

import { getUser as getGen3User, getStudyIds } from 'services/gen3';
import { css } from 'emotion';
import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';
import { get } from 'lodash';
import Query from '@arranger/components/dist/Query';
import styled from 'react-emotion';

import LoadingSpinner from 'uikit/LoadingSpinner';
import Row from 'uikit/Row';
import Column from 'uikit/Column';
import { toGqlString } from 'services/utils';
import ExternalLink from 'uikit/ExternalLink';
import { Span } from 'uikit/Core';
import { PromptMessageContainer } from 'uikit/PromptMessage';
import RightChevron from 'icons/DoubleChevronRightIcon';
import StackIcon from 'icons/StackIcon';
import { withHistory } from 'services/history';
import { withApi } from 'services/api';
import { arrangerGqlRecompose } from 'services/arranger';
import { arrangerProjectId } from 'common/injectGlobals';

export const styles = css`
  table {
    border-collapse: collapse;
  }
  span.title {
    font-weight: bold;
    padding: 15px;
  }
`;

export const ItemRowContainer = styled(Row)`
  padding-top: 5px;
  padding-bottom: 5px;
  min-height: 50px;
  padding-right: 10%;
  &:not(:last-child) {
    border-bottom: solid 1px ${({ theme }) => theme.borderGrey};
  }
`;

export const Spinner = () => (
  <Row justifyContent={'center'}>
    <LoadingSpinner width={20} height={20} />
  </Row>
);
