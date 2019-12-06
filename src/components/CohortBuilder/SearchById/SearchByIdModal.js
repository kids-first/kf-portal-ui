import React from 'react';
import { connect } from 'react-redux';
import autobind from 'auto-bind-es5';
import uniq from 'lodash/uniq';
import flatMap from 'lodash/flatMap';
import debounce from 'lodash/debounce';
import CloseIcon from 'react-icons/lib/md/close';

import { searchByIds } from 'services/arranger/searchByIds';
import Row from 'uikit/Column';
import { WhiteButton, TealActionButton } from 'uikit/Button';
import { H3 } from 'uikit/Headings';
import { parseInputFiles } from 'common/parseInputFiles';
import { setSqonValueAtIndex } from 'common/sqonUtils';
import { ModalTitle } from 'components/Modal/ui';
import { closeModal } from 'store/actionCreators/ui/modalComponent';
import { setSqons } from 'store/actionCreators/virtualStudies';
import SearchResults from './SearchResults';

import './styles.scss';

const parseInput = inputText => uniq(inputText.split(/,|\s|\t(,|\s|\t)*/).filter(id => !!id));

function handleViewResults() {
  if (this.state.loading || !this.opened) return;
  this.setState({ loading: true });
  return searchByIds(this.state.inputIds)
    .then(results => {
      this.setState({ loading: false, results });
    })
    .catch(() => {
      this.setState({ loading: false });
    });
}

class SearchByIdModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      inputIdsText: '',
      inputIds: [],
      results: null,
    };
    this.opened = true;
    this.fileInpuRef = React.createRef();
    this.handleViewResults = debounce(handleViewResults, 500);
    autobind(this);
  }

  componentDidMount() {
    this.opened = true;
  }

  componentWillUnmount() {
    this.setState({ loading: false });
    this.opened = false;
  }

  handleFilesUpload(evt) {
    parseInputFiles(evt.currentTarget.files)
      .then(contents => {
        const inputIds = contents
          .reduce((ids, fileContent) => ids.concat(parseInput(fileContent)), this.state.inputIds)
          .filter(id => !!id);
        this.setInputIds(inputIds);
      })
      .catch(console.err);
  }

  handleInputIdsChange(evt) {
    const inputIdsText = evt.currentTarget.value;
    this.setInputText(inputIdsText);
  }

  handleApplyFilterClick() {
    if (this.state.loading || !this.opened) return;
    if (!(this.state.results && this.state.results.participants)) return;

    const { virtualStudy, setSqons, closeModal } = this.props;

    this.setState({ loading: true });
    const participantIds = uniq(flatMap(this.state.results.participants, r => r.participantIds));

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
    closeModal();
    this.setState({ loading: false });
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
    this.opened = false;
    this.setState({ loading: false });
    this.props.closeModal();
  }

  handleClear() {
    this.setInputText('');
  }

  renderHeader() {
    return (
      <React.Fragment>
        <ModalTitle>Upload a List of Identifiers</ModalTitle>
        <CloseIcon
          style={{ cursor: 'pointer', width: '22px', height: '22px' }}
          fill="black"
          onClick={this.handleClose}
        />
      </React.Fragment>
    );
  }

  renderBody() {
    const { inputIdsText, inputIds, results, loading } = this.state;

    return (
      <React.Fragment>
        <section className="sbi-description">
          <p>
            Type or copy-and-paste a list of comma delimited identifiers (participant, biospecimen,
            file, family)
          </p>
          <WhiteButton key="cancel" onClick={this.handleClear} className="clear">
            Clear
          </WhiteButton>
        </section>
        <section className="sbi-id-input">
          <textarea
            placeholder="e.g. PT_X25FNZ4D, CDH1363, BS_E28336C7, 4-28F, GF_9R86WD1Z"
            rows="4"
            value={inputIdsText}
            onChange={this.handleInputIdsChange}
          />
        </section>
        <section className="sbi-description">
          <span>Or choose file to upload</span>
          <input
            type="file"
            multiple
            accept=".tsv,.csv,text/*"
            style={{ display: 'none' }}
            onChange={this.handleFilesUpload}
            ref={this.fileInpuRef}
          />
          <TealActionButton
            className="btn-upload"
            onClick={() => {
              this.fileInpuRef.current.click();
            }}
          >
            Upload csv
          </TealActionButton>
        </section>
        {!!results ? (
          <section className="sbi-results">
            <hr />
            <H3>Matching Participants</H3>
            <SearchResults query={inputIds} results={results.participants} loading={loading} />
          </section>
        ) : null}
      </React.Fragment>
    );
  }

  renderFooter() {
    const { loading, inputIds, results } = this.state;
    return (
      <React.Fragment>
        <WhiteButton key="cancel" onClick={this.handleClose}>
          Cancel
        </WhiteButton>
        <TealActionButton
          key="apply"
          disabled={loading || inputIds.length === 0 || results === null}
          onClick={this.handleApplyFilterClick}
        >
          View Results
        </TealActionButton>
      </React.Fragment>
    );
  }

  render() {
    return (
      <React.Fragment>
        <Row className="header">{this.renderHeader()}</Row>
        <Row className="body">{this.renderBody()}</Row>
        <Row className="footer">{this.renderFooter()}</Row>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  virtualStudy: state.currentVirtualStudy,
});

const mapDispatchToProps = { closeModal, setSqons };

export default connect(mapStateToProps, mapDispatchToProps)(SearchByIdModal);
