import React from 'react';
import PropTypes, { oneOfType } from 'prop-types';
import { connect } from 'react-redux';
import CloseIcon from 'react-icons/lib/md/close';
import ReactModal from 'react-modal';
import autobind from 'auto-bind-es5';
import { noop } from 'lodash';

import { getAppElement } from '../../services/globalDomNodes.js';
// TODO : import those styles
import { ModalContent, ModalTitle } from './ui';
import { WhiteButton, TealActionButton } from 'uikit/Button';

import { closeModal } from '../../store/actionCreators/ui/modalComponent';
import { store } from '../../store';

import './globalModal.scss';

const HeaderContainer = ({ title, onClose = noop, className = '' }) => (
  <div className={className}>
    <ModalTitle>{title}</ModalTitle>
    <CloseIcon
      css="cursor:pointer; width:22px; height:22px; margin-top:-10px; margin-right:-10px;"
      fill="black"
      onClick={onClose}
    />
  </div>
);

const FooterContainer = ({ className = '', children = null }) => (
  <div className={`footer ${className}`}>{children}</div>
);

class GlobalModal extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  static propTypes = {
    component: PropTypes.node,
    header: PropTypes.string,
    footer: oneOfType([PropTypes.string, PropTypes.bool]),
    onCancel: PropTypes.func,
    cancelLabel: PropTypes.string,
    cancelDisabled: oneOfType([PropTypes.bool, PropTypes.func]),
    onConfirm: PropTypes.func,
    confirmLabel: PropTypes.string,
    confirmDisabled: oneOfType([PropTypes.bool, PropTypes.func]),
    classNames: PropTypes.shape({
      modal: PropTypes.string,
      overlay: PropTypes.string,
      content: PropTypes.string,
      header: PropTypes.string,
    }),
  };

  renderHeader() {
    const { header = null, classNames = {}, onCancel = this.handleClose } = this.props;

    if (typeof header === 'string') {
      return (
        <HeaderContainer
          title={header}
          onClose={onCancel ? () => onCancel(this.handleClose) : null}
          className={`header ${(classNames && classNames.header) || ''}`}
        />
      );
    }

    return null;
  }

  renderFooter() {
    const {
      footer,
      onCancel = this.handleClose,
      cancelLabel = 'Cancel',
      cancelDisabled = false,
      onConfirm = this.handleClose,
      confirmLabel = 'Confirm',
      confirmDisabled = false,
      classNames = {},
    } = this.props;

    if (footer === false || footer === null) {
      return null;
    }

    const isDisabled = disabled => (typeof disabled === 'function' ? disabled() : disabled);

    const childrens = [];
    if (onCancel) {
      childrens.push(
        <WhiteButton
          key="cancel"
          disabled={isDisabled(cancelDisabled)}
          onClick={onCancel ? () => onCancel(this.handleClose) : noop}
        >
          {cancelLabel}
        </WhiteButton>,
      );
    }

    if (typeof footer === 'string') {
      childrens.push(
        <div key="text" className="footer-text">
          footer
        </div>,
      );
    }

    if (onConfirm) {
      childrens.push(
        <TealActionButton
          key="confirm"
          disabled={isDisabled(confirmDisabled)}
          onClick={onConfirm ? () => onConfirm() : noop}
        >
          {confirmLabel}
        </TealActionButton>,
      );
    }

    if (footer === true || typeof footer === 'string') {
      return <FooterContainer className={classNames.footer}>{childrens}</FooterContainer>;
    }

    return null;
  }

  handleClose() {
    store.dispatch(closeModal());
  }

  render() {
    const { component = null, className = '', classNames = null, ...rest } = this.props;
    const modalHeader = this.renderHeader();
    const modalFooter = this.renderFooter();

    return (
      <ReactModal
        isOpen={!!component}
        className={`global-modal ${className}} ${!!modalFooter ? 'footer' : ''}`}
        overlayClassName={`global-modal-overlay ${classNames ? classNames.overlay : ''}`}
        appElement={getAppElement()}
        {...rest}
      >
        {modalHeader}
        <ModalContent className={`content ${classNames ? classNames.content : ''}`}>
          {component}
        </ModalContent>
        {modalFooter}
      </ReactModal>
    );
  }
}

const mapStateToProps = ({ ui: { modalComponent } }) => modalComponent;

export default connect(mapStateToProps)(GlobalModal);
export { ModalActionButton } from './ui';
export { ModalSubHeader } from './ui';
