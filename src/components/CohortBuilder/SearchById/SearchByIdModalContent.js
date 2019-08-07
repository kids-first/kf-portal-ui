import React from 'react';

import Column from 'uikit/Column';

import './styles.scss';

export default class SearchByIdModalContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Column className="search-by-id-modal-content">
        <section className="sbi-description">
          <p>Type or copy-and-paste a list of comma delimited identifiers</p>
        </section>
        <section className="sbi-id-input">
          <textarea placeholder="Eg. BS_4F9171D5, S88-3" />
        </section>
        <p>Or choose file to upload</p>
        <div class="css-k008qs">
          <input
            type="file"
            className="ADD CSS"
            aria-label="File upload"
            accept=".tsv,.csv,text/*"
            multiple=""
          />
          <button type="submit" className="ADD CSS">
            Upload csv
          </button>
        </div>
      </Column>
    );
  }
}
