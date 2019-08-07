import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CloseIcon from 'react-icons/lib/md/close';
import ReactModal from 'react-modal';
import autobind from 'auto-bind-es5';

import { getAppElement } from '../../services/globalDomNodes.js';
import {
  // ModalFooterContainer, ModalFooterContent, Modal,
  ModalContent,
  ModalTitle,
} from './ui';

import { closeModal } from '../../store/actionCreators/ui/modalComponent';
import { store } from '../../store';

import './globalModal.scss';

const ModalHeader = ({ title, onClose, className = '' }) => (
  <div className={className}>
    <ModalTitle>{title}</ModalTitle>
    <CloseIcon
      css="cursor:pointer; width:22px; height:22px; margin-top:-10px; margin-right:-10px;"
      fill="black"
      onClick={onClose}
    />
  </div>
);

class GlobalModal extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  static propTypes = {
    title: PropTypes.string,
    component: PropTypes.node,
    classNames: PropTypes.shape({
      modal: PropTypes.string,
      overlay: PropTypes.string,
      content: PropTypes.string,
      header: PropTypes.string,
    }),
  };

  handleClose() {
    store.dispatch(closeModal());
  }

  render() {
    const {
      title = '',
      component = null,
      className = '',
      classNames = null,
      isFooterShown = true,
      ...rest
    } = this.props;

    return (
      <ReactModal
        isOpen={!!component}
        className={`global-modal ${className}} ${isFooterShown ? 'footer' : ''}`}
        overlayClassName={`global-modal-overlay ${classNames ? classNames.overlay : ''}`}
        appElement={getAppElement()}
        {...rest}
      >
        {!!title ? (
          <ModalHeader
            title={title}
            onClose={this.handleClose}
            className={`header ${(classNames && classNames.header) || ''}`}
          />
        ) : null}
        <ModalContent className={`content ${classNames ? classNames.content : ''}`}>
          {component}
        </ModalContent>
      </ReactModal>
    );
  }
}

const mapStateToProps = ({ ui: { modalComponent } }) => modalComponent;

export default connect(mapStateToProps)(GlobalModal);
export { ModalActionButton } from './ui';
export { ModalSubHeader } from './ui';
