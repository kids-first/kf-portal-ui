import React from 'react';
import { connect } from 'react-redux';
import autobind from 'auto-bind-es5';
import { uniq } from 'lodash';
import CloseIcon from 'react-icons/lib/md/close';

import { searchByIds } from 'services/arranger/searchByIds';
import Row from 'uikit/Column';
import { WhiteButton, TealActionButton } from 'uikit/Button';
import { parseInputFiles } from 'common/parseInputFiles';
import { ModalTitle } from '../../Modal/ui';
import { closeModal } from '../../../store/actionCreators/ui/modalComponent';
import SearchResults from './SearchResults';

import './styles.scss';

class SearchByIdModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      inputIdsText: '',
      inputIds: [],
      results: null,
    };
    this.fileInpuRef = React.createRef();
    autobind(this);
  }

  componentWillUnmount() {
    this.setState({ loading: false });
  }

  handleFilesUpload(evt) {
    parseInputFiles(evt.currentTarget.files)
      .then(contents => {
        const inputIds = contents
          .reduce((ids, fileContent) => ids.concat(fileContent.split(/,\s*/)), this.state.inputIds)
          .filter(id => !!id);
        this.setInputIds(inputIds);
      })
      .catch(console.err);
  }

  handleInputIdsChange(evt) {
    const inputIdsText = evt.currentTarget.value;
    this.setInputText(inputIdsText);
  }

  async handleViewResultsClick() {
    if (this.state.loading === true) return;
    this.setState({ loading: true });
    searchByIds(this.state.inputIds)
      .then(results => {
        this.setState({ loading: false, results });
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  }

  setInputText(inputIdsText) {
    const inputIds = uniq(inputIdsText.split(/,\s*/).filter(id => !!id));
    this.setState({ inputIdsText, inputIds });
  }

  setInputIds(inputIds) {
    const uniqueInputIds = uniq(inputIds);
    const inputIdsText = uniqueInputIds.join(', ');
    this.setState({ inputIdsText, inputIds: uniqueInputIds });
  }

  handleClose() {
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
          css="cursor:pointer; width:22px; height:22px;"
          fill="black"
          onClick={this.handleClose}
        />
      </React.Fragment>
    );
  }

  renderBody() {
    const { inputIdsText, inputIds, results } = this.state;

    return (
      <React.Fragment>
        <section className="sbi-description">
          <p>Type or copy-and-paste a list of comma delimited identifiers</p>
          <WhiteButton key="cancel" onClick={this.handleClear} className="clear">
            Clear
          </WhiteButton>
        </section>
        <section className="sbi-id-input">
          <textarea
            placeholder="e.g. PT_X25FNZ4D, CDH1363, BS_E28336C7, 4-28F, GF_9R86WD1Z"
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
        {results === null ? null : (
          <section className="sbi-results">
            <SearchResults query={inputIds} results={results.participants} />
          </section>
        )}
      </React.Fragment>
    );
  }

  renderFooter() {
    const { loading } = this.state;
    return (
      <React.Fragment>
        <WhiteButton key="cancel" onClick={this.handleClose}>
          Cancel
        </WhiteButton>
        <TealActionButton
          key="confirm"
          disabled={loading === true}
          onClick={this.handleViewResultsClick}
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

export default connect(
  null,
  { closeModal },
)(SearchByIdModal);
