import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactModal from 'react-modal';
import autobind from 'auto-bind-es5';

import { getAppElement } from '../../services/globalDomNodes.js';
// TODO JB : import those styles
import { ModalContent } from './ui';

import { closeModal } from '../../store/actionCreators/ui/modalComponent';
import { store } from '../../store';
import { getModal } from './modalFactory';

import './globalModal.scss';

class GlobalModal extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  static propTypes = {
    modalName: PropTypes.string,
    className: PropTypes.string,
    modalProps: PropTypes.object,
  };

  handleClose() {
    store.dispatch(closeModal());
  }

  render() {
    const { modalName, modalProps = {}, className = '' } = this.props;
    const ModalComponent = getModal(modalName);

    return (
      <ReactModal
        isOpen={!!modalName}
        className={`global-modal ${className}`}
        overlayClassName="global-modal-overlay"
        appElement={getAppElement()}
      >
        <ModalContent className="container">
          {ModalComponent ? <ModalComponent {...modalProps} /> : null}
        </ModalContent>
      </ReactModal>
    );
  }
}

const mapStateToProps = ({ ui: { modalComponent } }) => modalComponent;

export default connect(mapStateToProps)(GlobalModal);
