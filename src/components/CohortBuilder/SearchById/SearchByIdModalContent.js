import React from 'react';
import autobind from 'auto-bind-es5';

import Column from 'uikit/Column';
import parseInputFiles from 'common/parseInputFiles';

import './styles.scss';

export default class SearchByIdModalContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputIds: '',
    };
    this.fileInpuRef = React.createRef();
    autobind(this);
  }

  handleFiles(evt) {
    parseInputFiles(evt.currentTarget.files).then(contents => {
      const inputIds = contents.reduce((ids, c) => ids + c, '');

      this.setState({ inputIds });
    });

    // const reader = new FileReader();

    // reader.onload = e => {
    //   // The file's text will be printed here
    //   console.log('onload', e.target.result);
    //   reader.removeEventListener('abort', reader.onabort);
    //   reader.removeEventListener('onload', reader.onload);
    // };
    // reader.onabort = e => {
    //   // The file's text will be printed here
    //   console.log('onabort', e);
    //   reader.removeEventListener('abort', reader.onabort);
    //   reader.removeEventListener('onload', reader.onload);
    // };

    // const fileObj = evt.currentTarget.files.item(0);
    // reader.readAsText(fileObj, 'utf-8');
  }

  handleInputIdsChange(evt) {
    this.setState({ inputIds: evt.currentTarget.value });
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
            value={this.state.inputIds}
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
          <button
            className="btn-upload"
            onClick={() => {
              this.fileInpuRef.current.click();
            }}
          >
            Upload csv
          </button>
        </section>
      </Column>
    );
  }
}
