import React from 'react';
import styled from 'react-emotion';
import { withTheme } from 'emotion-theming';
import { compose } from 'recompose';
import Search from './Search';
import Category from './Category';
import Row from 'uikit/Row';
import QuickFilterIcon from 'icons/QuickFilterIcon';
import StudyIcon from 'icons/StudyIcon';
import BiospecimenIcon from 'icons/BiospecimenIcon';
import ClinicalIcon from 'icons/ClinicalIcon';
import UploadIcon from 'icons/UploadIcon';
import FileIcon from 'icons/FileIcon';

const Container = styled(Row)`
  height: 72px;
  width: 100%;
  border-left: 1px solid ${({ theme }) => theme.greyScale8};
  border-bottom: 1px solid ${({ theme }) => theme.greyScale8};
  background-color: white;
`;

const Categories = ({ theme }) => (
  <Container>
    <Search />
    <Category title="Quick Filters" color={theme.filterPurple}>
      <QuickFilterIcon fill={theme.filterPurple} />
    </Category>
    <Category title="Study" color={theme.studyRed}>
      <StudyIcon fill={theme.studyRed} />
    </Category>
    <Category title="Demographic" color={theme.demographicPurple} />
    <Category title="Clinical" color={theme.clinicalBlue}>
      <ClinicalIcon fill={theme.clinicalBlue} />
    </Category>
    <Category title="Biospecimens" color={theme.biospecimenOrange}>
      <BiospecimenIcon fill={theme.biospecimenOrange} />
    </Category>
    <Category title="Available Data" color={theme.dataBlue}>
      <FileIcon width={11} height={14} fill={theme.dataBlue} />
    </Category>
    <Category title="Upload IDs" color={theme.uploadYellow}>
      <UploadIcon fill={theme.uploadYellow} />
    </Category>
  </Container>
);

export default compose(withTheme)(Categories);
