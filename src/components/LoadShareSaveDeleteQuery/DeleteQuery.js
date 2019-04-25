import React from 'react';
import { injectState } from 'freactal';
import DeleteIcon from 'react-icons/lib/fa/trash';
import { Trans } from 'react-i18next';
import { trackUserInteraction, TRACKING_EVENTS } from '../../services/analyticsTracking';
import { WhiteButton } from 'uikit/Button';
import styled from 'react-emotion';

const trackQueryDelete = channel => {
  trackUserInteraction({
    category: TRACKING_EVENTS.categories.fileRepo.dataTable,
    action: TRACKING_EVENTS.actions.query.delete,
    label: channel,
  });
};

let AlignedDeleteIcon = styled(DeleteIcon)`
  margin-top: -2px;
`;

export default injectState(
  class extends React.Component {
    state = { error: null };

    delete = async selectedVirtualStudy => {
      try {
        trackQueryDelete(selectedVirtualStudy);
      } catch (error) {
        console.error(error);
        this.setState({ error: true });
      }
    };

    render() {
      const { disabled } = this.props;
      return (
        <WhiteButton
          disabled={disabled}
          onClick={
            disabled
              ? () => {}
              : () => {
                  this.props.handleDelete(this.delete);
                }
          }
        >
          <AlignedDeleteIcon />
          &nbsp;<Trans>delete</Trans>
        </WhiteButton>
      );
    }
  },
);
