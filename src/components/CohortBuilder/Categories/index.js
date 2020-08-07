import React from 'react';
import autobind from 'auto-bind-es5';

import SearchAll from '../SearchAll';
import Category from './Category';
import ActionCategory from './ActionCategory';
import Row from 'uikit/Row';
import QuickFilterIcon from 'icons/QuickFilterIcon';
import StudyIcon from 'icons/StudyIcon';
import BiospecimenIcon from 'icons/BiospecimenIcon';
import ClinicalIcon from 'icons/ClinicalIcon';
import UploadIcon from 'icons/UploadIcon';
import FileIcon from 'icons/FileIcon';
import DemographicIcon from 'icons/DemographicIcon';
import { SQONdiff } from 'components/Utils';
import { registerModal } from '../../Modal/modalFactory';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';

import { openModal } from '../../../store/actionCreators/ui/modalComponent';
import { store } from '../../../store';
import SearchByIdModal from '../SearchById/SearchByIdModal';
import theme from 'theme/defaultTheme';
import { isFeatureEnabled } from '../../../common/featuresToggles';

import { CATEGORY_FIELDS } from './categories';

import '../CohortBuilder.css';

const CATEGORY_FIELDS_TREE_BROWSER = isFeatureEnabled('mondoDiagnosis')
  ? ['diagnoses.mondo.name', 'observed_phenotype.name']
  : ['observed_phenotype.name'];

export default class Categories extends React.Component {
  constructor(props) {
    super(props);
    this.initialSqon = props.sqon;
    registerModal('SearchByIdModal', SearchByIdModal);
    autobind(this);
  }

  trackCategoryAction(title) {
    const { sqon } = this.props;
    const addedSQON = SQONdiff(sqon, this.initialSqon);

    const { categories, actions } = TRACKING_EVENTS;
    trackUserInteraction({
      category: `${categories.cohortBuilder.filters._cohortBuilderFilters} - ${title}`,
      action: `${actions.apply} Selected Filters`,
      label: JSON.stringify({ added_sqon: addedSQON, result_sqon: sqon }),
    });

    this.initialSqon = sqon;
  }

  handleSqonUpdate(title, ...args) {
    this.trackCategoryAction(title);
    this.props.onSqonUpdate(...args);
  }

  handleUploadIdsClick() {
    store.dispatch(openModal('SearchByIdModal', {}, 'search-by-id-modal'));
  }

  render() {
    const { sqon } = this.props;

    return (
      <Row className="cb-categories-content">
        <SearchAll
          title={'Search all filters'}
          sqon={sqon}
          onSqonUpdate={this.handleSqonUpdate}
          fields={CATEGORY_FIELDS.searchAll}
          color={theme.filterViolet}
        />
        <Category
          title="Quick Filters"
          sqon={sqon}
          onSqonUpdate={this.handleSqonUpdate}
          fields={CATEGORY_FIELDS.quickSearch}
          color={theme.filterPurple}
          anchorId={'anchor-quick-filters'}
        >
          <QuickFilterIcon fill={theme.filterPurple} />
        </Category>
        <Category
          title="Study"
          sqon={sqon}
          onSqonUpdate={this.handleSqonUpdate}
          fields={CATEGORY_FIELDS.study}
          color={theme.studyRed}
          anchorId={'anchor-study'}
        >
          <StudyIcon fill={theme.studyRed} />
        </Category>
        <Category
          title="Demographic"
          sqon={sqon}
          onSqonUpdate={this.handleSqonUpdate}
          fields={CATEGORY_FIELDS.demographic}
          color={theme.demographicPurple}
          anchorId={'anchor-demographic'}
        >
          <DemographicIcon fill={theme.demographicPurple} width="14px" height="17px" />
        </Category>
        <Category
          title="Clinical"
          sqon={sqon}
          onSqonUpdate={this.handleSqonUpdate}
          fields={CATEGORY_FIELDS.clinical}
          color={theme.clinicalBlue}
          anchorId={'anchor-clinical'}
          fieldsTreeBrowser={CATEGORY_FIELDS_TREE_BROWSER}
        >
          <ClinicalIcon width="18px" height="17px" fill={theme.clinicalBlue} />
        </Category>
        <Category
          title="Biospecimens"
          sqon={sqon}
          onSqonUpdate={this.handleSqonUpdate}
          fields={CATEGORY_FIELDS.biospecimen}
          color={theme.biospecimenOrange}
          anchorId={'anchor-biospecimens'}
        >
          <BiospecimenIcon fill={theme.biospecimenOrange} />
        </Category>
        <Category
          title="Available Data"
          sqon={sqon}
          onSqonUpdate={this.handleSqonUpdate}
          fields={CATEGORY_FIELDS.availableData}
          color={theme.dataBlue}
          anchorId={'anchor-available-data'}
        >
          <FileIcon width="11px" height="14px" fill={theme.dataBlue} />
        </Category>
        <ActionCategory
          title="Upload IDs"
          color={theme.uploadYellow}
          onClick={this.handleUploadIdsClick}
        >
          <UploadIcon fill={theme.uploadYellow} width="13px" height="16px" />
        </ActionCategory>
      </Row>
    );
  }
}
