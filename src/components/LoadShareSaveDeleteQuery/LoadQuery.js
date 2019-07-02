import React from 'react';
import { injectState } from 'freactal';
import OpenIcon from 'react-icons/lib/fa/folder-open';
import Tooltip from 'uikit/Tooltip';
import { Trans } from 'react-i18next';
import { WhiteButton } from 'uikit/Button';
import styled from 'react-emotion';

const ItemRow = styled('div')`
  padding: 2px 10px;
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.greyScale6};
  }
`;

const AlignedLoadIcon = styled(OpenIcon)`
  margin-top: -2px;
`;

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
              <div
                css={`
                  width: 200px;
                `}
              >
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
            <AlignedLoadIcon />
            &nbsp;<Trans>open</Trans>
          </Tooltip>
        </WhiteButton>
      );
    }
  },
);
