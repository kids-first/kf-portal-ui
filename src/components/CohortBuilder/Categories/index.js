import React from 'react';
import { connect } from 'react-redux';
import { FolderOpenFilled } from '@ant-design/icons';
import PropTypes from 'prop-types';

import { isFeatureEnabled } from 'common/featuresToggles';
import ActionCategory from 'components/CohortBuilder/Categories//ActionCategory';
import { CATEGORY_FIELDS } from 'components/CohortBuilder/Categories//categories';
import Category from 'components/CohortBuilder/Categories//Category';
import ModalSetsToQuery from 'components/CohortBuilder/Categories//ModalSetsToQuery';
import SearchAll from 'components/CohortBuilder/SearchAll';
import SearchByIdModal from 'components/CohortBuilder/SearchById/SearchByIdModal';
import { SQONdiff } from 'components/Utils';
import BiospecimenIcon from 'icons/BiospecimenIcon';
import ClinicalIcon from 'icons/ClinicalIcon';
import DemographicIcon from 'icons/DemographicIcon';
import FileIcon from 'icons/FileIcon';
import StudyIcon from 'icons/StudyIcon';
import UploadIcon from 'icons/UploadIcon';
import { TRACKING_EVENTS, trackUserInteraction } from 'services/analyticsTracking';
import { openModal } from 'store/actions/modal';
import { selectModalId } from 'store/selectors/modal';
import { selectSets } from 'store/selectors/saveSetsSelectors';
import theme from 'theme/defaultTheme';
import Row from 'uikit/Row';

import '../CohortBuilder.css';

const ADD_SET_TO_QUERY_MODAL_ID = 'ADD_SET_TO_QUERY_MODAL_ID';
const SEARCH_MODAL_ID = 'SEARCH_MODAL_ID';

const CATEGORY_FIELDS_TREE_BROWSER = isFeatureEnabled('mondoDiagnosis')
  ? ['diagnoses.mondo.name', 'observed_phenotype.name']
  : ['observed_phenotype.name'];

const mapStateToProps = (state) => ({
  openModalId: selectModalId(state),
  sets: selectSets(state),
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
    const { sqon, sets } = this.props;

    return (
      <Row className="cb-categories-content">
        <ModalSetsToQuery sqon={sqon} />
        <SearchByIdModal />
        <SearchAll
          title={'Search all filters'}
          sqon={sqon}
          sets={sets}
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
          sets={sets}
          onSqonUpdate={this.handleSqonUpdate}
          fields={CATEGORY_FIELDS.study}
          color={theme.studyRed}
          anchorId={'anchor-study'}
        >
          <StudyIcon fill={theme.studyRed} width="14px" height="17px" />
        </Category>
        <Category
          title="Demographic"
          sqon={sqon}
          sets={sets}
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
          sets={sets}
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
          sets={sets}
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
          sets={sets}
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
  sets: PropTypes.array.isRequired,
};

export default connector(Categories);
