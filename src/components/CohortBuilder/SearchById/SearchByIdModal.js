import React from 'react';
import { connect } from 'react-redux';
import { Button, Modal } from 'antd';
import autobind from 'auto-bind-es5';
import debounce from 'lodash/debounce';
import flatMap from 'lodash/flatMap';
import uniq from 'lodash/uniq';
import PropTypes from 'prop-types';

import { parseInputFiles } from 'common/parseInputFiles';
import { setSqonValueAtIndex } from 'common/sqonUtils';
import { searchByIds } from 'services/arranger/searchByIds';
import { setSqons } from 'store/actionCreators/virtualStudies';
import { closeModal } from 'store/actions/modal';
import { selectModalId } from 'store/selectors/modal';
import Row from 'uikit/Column';

import LoadingOnClick from '../../LoadingOnClick';

import SearchResults from './SearchResults';

import './styles.scss';

const SEARCH_MODAL_ID = 'SEARCH_MODAL_ID';

//  Fixme: this modal is kind of a duplicated refactored of UploadIdsModal.
const parseInput = (inputText) => uniq(inputText.split(/,|\s|\t(,|\s|\t)*/).filter((id) => !!id));

function handleViewResults() {
  if (this.state.loading) return;
  this.setState({ loading: true });
  return searchByIds(this.state.inputIds)
    .then((results) => {
      this.setState({ loading: false, results });
    })
    .catch(() => {
      this.setState({ loading: false });
    });
}

const initialState = {
  loading: false,
  inputIdsText: '',
  inputIds: [],
  results: null,
};

class SearchByIdModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initialState,
    };
    this.fileInpuRef = React.createRef();
    this.handleViewResults = debounce(handleViewResults, 500);
    autobind(this);
  }

  static propTypes = {
    setSqons: PropTypes.func,
    closeModal: PropTypes.func,
    virtualStudy: PropTypes.object,
    openModalId: PropTypes.string,
    loading: PropTypes.bool,
  };

  resetState = () => this.setState({ ...initialState });

  handleFilesUpload(evt) {
    parseInputFiles(evt.currentTarget.files)
      .then((contents) => {
        const inputIds = contents
          .reduce((ids, fileContent) => ids.concat(parseInput(fileContent)), this.state.inputIds)
          .filter((id) => !!id);
        this.setInputIds(inputIds);
      })
      .catch(console.error);
  }

  handleInputIdsChange(evt) {
    const inputIdsText = evt.currentTarget.value;
    this.setInputText(inputIdsText);
  }

  handleApplyFilterClick() {
    if (!(this.state.results && this.state.results.participants)) {
      return;
    }

    const { virtualStudy, setSqons, closeModal } = this.props;

    this.setState({ loading: true });
    const participantIds = uniq(flatMap(this.state.results.participants, (r) => r.participantIds));

    const participantsSqon = {
      op: 'in',
      content: {
        field: 'kf_id',
        value: participantIds,
      },
    };

    const modifiedSqons = setSqonValueAtIndex(
      virtualStudy.sqons,
      virtualStudy.activeIndex,
      participantsSqon,
    );

    setSqons(modifiedSqons);
    closeModal(SEARCH_MODAL_ID);
    this.resetState();
  }

  setInputText(inputIdsText) {
    const inputIds = parseInput(inputIdsText);
    this.setState({ inputIdsText, inputIds });
    this.handleViewResults();
  }

  setInputIds(inputIds) {
    const inputIdsText = inputIds.join(', ');
    this.setState({ inputIdsText, inputIds });
    this.handleViewResults();
  }

  handleClose() {
    this.resetState();
    this.props.closeModal(SEARCH_MODAL_ID);
  }

  handleClear() {
    this.setInputText('');
  }

  renderBody() {
    const { inputIdsText, inputIds, results, loading } = this.state;

    return (
      <>
        <div style={{ display: 'flex' }}>
          <p>
            Type or copy-and-paste a list of comma delimited identifiers (participant, biospecimen,
            file, family)
          </p>
          <Button key="clear" type={'secondary'} onClick={this.handleClear}>
            Clear
          </Button>
        </div>
        <textarea
          placeholder="e.g. PT_X25FNZ4D, CDH1363, BS_E28336C7, 4-28F, GF_9R86WD1Z"
          rows="4"
          value={inputIdsText}
          onChange={this.handleInputIdsChange}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
          <span>Or choose file to upload</span>
          <input
            type="file"
            multiple
            accept=".tsv,.csv,text/*"
            style={{ display: 'none' }}
            onChange={this.handleFilesUpload}
            ref={this.fileInpuRef}
          />
          <LoadingOnClick
            key="uploadLoader"
            onClick={() => {
              this.fileInpuRef.current.click();
            }}
            render={({ onClick, loadingOnClick }) => (
              <Button
                className="btn-upload"
                loading={loadingOnClick}
                disabled={loadingOnClick}
                key="upload"
                type="primary"
                onClick={onClick}
              >
                Upload csv
              </Button>
            )}
          />
        </div>
        {results ? (
          <section className="sbi-results">
            <hr />
            <h3>Matching Participants</h3>
            <SearchResults query={inputIds} results={results.participants} loading={loading} />
          </section>
        ) : null}
      </>
    );
  }

  render() {
    const { openModalId, loading } = this.props;
    const { inputIds, results } = this.state;
    return (
      <Modal
        title="Upload a List of Identifiers"
        visible={openModalId === SEARCH_MODAL_ID}
        footer={[
          <Button key="cancel" onClick={this.handleClose}>
            Cancel
          </Button>,
          <LoadingOnClick
            key="applyLoader"
            onClick={this.handleApplyFilterClick}
            render={({ onClick, loadingOnClick }) => (
              <Button
                loading={loading || loadingOnClick}
                disabled={loadingOnClick || inputIds.length === 0 || results === null || loading}
                key="apply"
                type="primary"
                onClick={onClick}
                className={'view-results-btn'}
              >
                View Results
              </Button>
            )}
          />,
        ]}
        onCancel={this.handleClose}
      >
        <Row className="body">{this.renderBody()}</Row>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  virtualStudy: state.currentVirtualStudy,
  openModalId: selectModalId(state),
});

const mapDispatchToProps = (dispatch) => ({
  closeModal: (id) => dispatch(closeModal(id)),
  setSqons: (sqons) => dispatch(setSqons(sqons)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchByIdModal);
