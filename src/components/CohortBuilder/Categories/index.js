import React from 'react';
import styled from 'react-emotion';
<<<<<<< HEAD
<<<<<<< HEAD
import { withTheme } from 'emotion-theming';
import {compose} from 'recompose';
=======
>>>>>>> add icons
=======
import { withTheme } from 'emotion-theming';
import { compose } from 'recompose';
>>>>>>> use existing icon and add theme
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
  border-left: 1px solid ${({theme}) => theme.greyScale8};
  border-bottom: 1px solid ${({theme}) => theme.greyScale8};
  background-color: white;
`;


const Categories = ({ theme }) => (
  <Container>
    <Search />
    <Category title="Quick Filters" color={theme.filterPurple} />
    <Category title="Study" color={theme.studyRed} />
    <Category title="Demographic" color={theme.demographicPurple} />
    <Category title="Clinical" color={theme.clinicalBlue} />
    <Category title="Biospecimens" color={theme.biospecimenOrange} />
    <Category title="Available Data" color={theme.dataBlue} />
    <Category title="Upload IDs" color={theme.uploadYellow} />
    <Category title="Quick Filters" color="">
      <QuickFilterIcon fill="#404c9a" />
    </Category>
    <Category title="Study" color={''}>
      <StudyIcon fill="#dd1f2a" />
    </Category>
    <Category title="Demographic" color={''} />
    <Category title="Clinical" color={''}>
      <ClinicalIcon fill="#0caceb" />
    </Category>
    <Category title="Biospecimens" color={''}>
      <BiospecimenIcon fill="#f79122" />
    </Category>
    <Category title="Available Data" color={''}>
      <FileIcon width={11} height={14} fill="#009bba" />
    </Category>
    <Category title="Upload IDs" color={''}>
      <UploadIcon fill="#edb500" />
    </Category>
  </Container>

export default compose(withTheme)(Categories);
