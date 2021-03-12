/* eslint-disable react/display-name */
import React, { FC } from 'react';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import PageContent from '../../components/Layout/PageContent';
import StudiesFiltersSider from './StudiesFiltersSider';
import StudyPageContainer from './StudyPageContainer';

const Studies: FC = () => (
  <StackLayout horizontal>
    <StudiesFiltersSider />
    <PageContent title="Studies">
      <StudyPageContainer />
    </PageContent>
  </StackLayout>
);

export default Studies;
