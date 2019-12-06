import React from 'react';
import { injectState } from 'freactal';
import OpenIcon from 'react-icons/lib/fa/folder-open';

import Tooltip from 'uikit/Tooltip';
import { WhiteButton } from 'uikit/Button';
import { styleComponent } from 'components/Utils';

import './LoadShareSaveDeleteQuery.css';

const ItemRow = styleComponent('div', 'query-item-row');

export default injectState(
  class extends React.Component {
    state = { loaded: false, error: null, open: false, studies: [] };

    open = async id => {
      let { handleOpen } = this.props;
      try {
        this.setState({ open: false });
        handleOpen(id);
      } catch (error) {
        this.setState({ error: true });
      }
    };

    render() {
      const { disabled, studies, selection } = this.props;
      return (
        <WhiteButton
          disabled={disabled}
          onClick={
            disabled
              ? () => {}
              : () => {
                  this.setState({ open: true });
                }
          }
        >
          <Tooltip
            position="bottom"
            open={this.state.open}
            onRequestClose={() => {
              this.setState({ open: false });
            }}
            interactive
            html={
              <div style={{ width: '200px' }}>
                <React.Fragment>
                  {studies.map(({ virtualStudyId, name }) => {
                    if (!selection || selection.virtualStudyId !== virtualStudyId) {
                      return (
                        <ItemRow
                          onClick={() => {
                            return this.open(virtualStudyId);
                          }}
                          key={`vitual-study-listitem_${virtualStudyId}`}
                        >
                          {name}
                        </ItemRow>
                      );
                    }
                    return null;
                  })}
                </React.Fragment>
              </div>
            }
          >
            <OpenIcon style={{ marginTop: '-2px' }} />
            &nbsp;open
          </Tooltip>
        </WhiteButton>
      );
    }
  },
);
