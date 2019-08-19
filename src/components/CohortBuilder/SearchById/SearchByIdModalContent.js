import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'auto-bind-es5';
import { uniq } from 'lodash';

import Column from 'uikit/Column';
import { TealActionButton } from 'uikit/Button';
import { parseInputFiles } from 'common/parseInputFiles';

import './styles.scss';

export default class SearchByIdModalContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputIdsText: '',
    };
    this.fileInpuRef = React.createRef();
    autobind(this);
  }

  static propTypes = {
    inputIds: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func.isRequired,
  };

  handleFiles(evt) {
    parseInputFiles(evt.currentTarget.files)
      .then(contents => {
        const inputIds = uniq(
          contents
            .reduce(
              (ids, fileContent) => ids.concat(fileContent.split(/,\s*/)),
              this.props.inputIds,
            )
            .filter(id => !!id),
        );
        const inputIdsText = inputIds.join(', ');
        this.setState({ inputIdsText });
        this.props.onChange(inputIds);
      })
      .catch(console.err);
  }

  handleInputIdsChange(evt) {
    const inputIdsText = evt.currentTarget.value;
    this.setState({ inputIdsText });
    const inputIds = inputIdsText.split(/,\s*/).filter(id => !!id);
    this.props.onChange(inputIds);
  }

  render() {
    return (
      <Column className="search-by-id-modal-content">
        <section className="sbi-description">
          <p>Type or copy-and-paste a list of comma delimited identifiers</p>
        </section>
        <section className="sbi-id-input">
          {/* TODO JB : placeholder text in textarea */}
          <textarea
            placeholder="Eg. BS_4F9171D5, S88-3"
            value={this.state.inputIdsText}
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
            onChange={this.handleFiles}
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
      </Column>
    );
  }
}
