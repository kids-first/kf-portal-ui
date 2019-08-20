import React from 'react';
import PropTypes, { oneOfType } from 'prop-types';
import { connect } from 'react-redux';
import ReactModal from 'react-modal';
import autobind from 'auto-bind-es5';

import { getAppElement } from '../../services/globalDomNodes.js';
// TODO : import those styles
import { ModalContent } from './ui';

import { closeModal } from '../../store/actionCreators/ui/modalComponent';
import { store } from '../../store';

import './globalModal.scss';

class GlobalModal extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  // TODO clean those
  static propTypes = {
    component: PropTypes.node,
    onCancel: PropTypes.func,
    cancelLabel: PropTypes.string,
    cancelDisabled: oneOfType([PropTypes.bool, PropTypes.func]),
    onConfirm: PropTypes.func,
    confirmLabel: PropTypes.string,
    confirmDisabled: oneOfType([PropTypes.bool, PropTypes.func]),
    className: PropTypes.string,
  };

  handleClose() {
    store.dispatch(closeModal());
  }

  render() {
    const { component = null, className = '', ...rest } = this.props;

    return (
      <ReactModal
        isOpen={!!component}
        className={`global-modal ${className}`}
        overlayClassName="global-modal-overlay"
        appElement={getAppElement()}
        {...rest}
      >
        <ModalContent className="container">{component}</ModalContent>
      </ReactModal>
    );
  }
}

const mapStateToProps = ({ ui: { modalComponent } }) => modalComponent;

export default connect(mapStateToProps)(GlobalModal);
// export { ModalActionButton } from './ui';
// export { ModalSubHeader } from './ui';
