import React from 'react';
import styled from 'react-emotion';
import { withTheme } from 'emotion-theming';
import {compose} from 'recompose';
import Search from './Search';
import Category from './Category';
import Row from 'uikit/Row';

const Container = styled(Row)`
  height: 72px;
  width: 100%;
  border-left: 1px solid #d4d6dd;
  border-bottom: 1px solid #d4d6dd;
  background-color: white;
`;

const Categories = ({theme}) => 
  <Container>
    <Search />
    <Category title="Quick Filters" color={theme.filterPurple} />
    <Category title="Study" color={theme.studyRed} />
    <Category title="Demographic" color={theme.demographicPurple} />
    <Category title="Clinical" color={theme.clinicalBlue} />
    <Category title="Biospecimens" color={theme.biospecimenOrange} />
    <Category title="Available Data" color={theme.dataBlue} />
    <Category title="Upload IDs" color={theme.uploadYellow} />
  </Container>

export default compose(withTheme)(Categories);
