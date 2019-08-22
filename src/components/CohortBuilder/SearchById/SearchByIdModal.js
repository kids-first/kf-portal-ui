import React from 'react';
import autobind from 'auto-bind-es5';
import { uniq } from 'lodash';
import CloseIcon from 'react-icons/lib/md/close';

import { searchByIds } from 'services/arranger/searchByIds';
import Row from 'uikit/Column';
import { WhiteButton, TealActionButton } from 'uikit/Button';
import { parseInputFiles } from 'common/parseInputFiles';
import { ModalTitle } from '../../Modal/ui';
import { closeModal } from '../../../store/actionCreators/ui/modalComponent';

import './styles.scss';

export default class SearchByIdModal extends React.Component {
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
        const inputIds = uniq(
          contents
            .reduce(
              (ids, fileContent) => ids.concat(fileContent.split(/,\s*/)),
              this.state.inputIds,
            )
            .filter(id => !!id),
        );
        const inputIdsText = inputIds.join(', ');
        this.setState({ inputIdsText, inputIds });
      })
      .catch(console.err);
  }

  handleInputIdsChange(evt) {
    const inputIdsText = evt.currentTarget.value;
    const inputIds = inputIdsText.split(/,\s*/).filter(id => !!id);
    this.setState({ inputIdsText, inputIds });
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

  handleClose() {
    this.setState({ loading: false });
    closeModal();
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
    const { inputIdsText } = this.state;

    return (
      <React.Fragment>
        <section className="sbi-description">
          <p>Type or copy-and-paste a list of comma delimited identifiers</p>
        </section>
        <section className="sbi-id-input">
          <textarea
            placeholder="e.g. PT_X25FNZ4D, CDH1363, BS_E28336C7, 4-28F, GF_9R86WD1Z"
            value={inputIdsText}
            onChange={this.handleInputIdsChange}
          />
        </section>
        <section className="sbi-description">
          <p>Or choose file to upload</p>
        </section>
        <section className="sbi-upload">
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
        <section>{JSON.stringify(this.state.results)}</section>
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
