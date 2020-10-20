import React from 'react';
import SearchAll from '../SearchAll';
import Category from './Category';
import ActionCategory from './ActionCategory';
import Row from 'uikit/Row';
import StudyIcon from 'icons/StudyIcon';
import BiospecimenIcon from 'icons/BiospecimenIcon';
import ClinicalIcon from 'icons/ClinicalIcon';
import UploadIcon from 'icons/UploadIcon';
import FileIcon from 'icons/FileIcon';
import DemographicIcon from 'icons/DemographicIcon';
import { SQONdiff } from 'components/Utils';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';
import SearchByIdModal from '../SearchById/SearchByIdModal';
import theme from 'theme/defaultTheme';
import { isFeatureEnabled } from 'common/featuresToggles';

import { CATEGORY_FIELDS } from './categories';

import '../CohortBuilder.css';
import { FolderOpenFilled } from '@ant-design/icons';
import { selectModalId } from 'store/selectors/modal';
import { openModal } from 'store/actions/modal';
import { connect } from 'react-redux';
import ModalSetsToQuery from './ModalSetsToQuery';
import PropTypes from 'prop-types';

const ADD_SET_TO_QUERY_MODAL_ID = 'ADD_SET_TO_QUERY_MODAL_ID';
const SEARCH_MODAL_ID = 'SEARCH_MODAL_ID';

const CATEGORY_FIELDS_TREE_BROWSER = isFeatureEnabled('mondoDiagnosis')
  ? ['diagnoses.mondo.name', 'observed_phenotype.name']
  : ['observed_phenotype.name'];

const mapStateToProps = (state) => ({
  openModalId: selectModalId(state),
});

const mapDispatchToProps = (dispatch) => ({
  openModal: (id) => dispatch(openModal(id)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

class Categories extends React.Component {
  constructor(props) {
    super(props);
    this.initialSqon = props.sqon;
  }

  trackCategoryAction = (title) => {
    const { sqon } = this.props;
    const addedSQON = SQONdiff(sqon, this.initialSqon);
    const { categories, actions } = TRACKING_EVENTS;
    trackUserInteraction({
      category: `${categories.cohortBuilder.filters._cohortBuilderFilters} - ${title}`,
      action: `${actions.apply} Selected Filters`,
      label: JSON.stringify({ added_sqon: addedSQON, result_sqon: sqon }),
    });

    this.initialSqon = sqon;
  };

  handleSqonUpdate = (title, ...args) => {
    this.trackCategoryAction(title);
    this.props.onSqonUpdate(...args);
  };

  handleUploadIdsClick = () => this.props.openModal(SEARCH_MODAL_ID);

  onOpenAddSetToQuery = () => this.props.openModal(ADD_SET_TO_QUERY_MODAL_ID);

  render() {
    const { sqon } = this.props;

    return (
      <Row className="cb-categories-content">
        <ModalSetsToQuery sqon={sqon} />
        <SearchByIdModal />
        <SearchAll
          title={'Search all filters'}
          sqon={sqon}
          onSqonUpdate={this.handleSqonUpdate}
          fields={CATEGORY_FIELDS.searchAll}
          color={theme.filterViolet}
        />
        <ActionCategory title="My sets" color={theme.primary} onClick={this.onOpenAddSetToQuery}>
          <FolderOpenFilled style={{ fontSize: 18, color: theme.primary }} />
        </ActionCategory>
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

Categories.propTypes = {
  sqon: PropTypes.object,
  onSqonUpdate: PropTypes.func,
  openModal: PropTypes.func,
};

export default connector(Categories);
