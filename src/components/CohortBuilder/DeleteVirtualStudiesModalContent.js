import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import autobind from 'auto-bind-es5';
import { injectState } from 'freactal';

import { ModalFooter } from 'components/Modal/index.js';
import { ModalContentSection } from './common';
import PromptMessage from 'uikit/PromptMessage';
import { deleteVirtualStudy } from '../../store/actionCreators/virtualStudies';

class DeleteVirtualStudiesModalContent extends React.Component {
  constructor(props) {
    super(props);
    this.deleting = false;
    autobind(this);
  }

  state = {
    errorMessage: null,
  };

  componentWillMount() {
    this.deleting = false;
  }

  findSelectedStudy() {
    const { virtualStudies, activeVirtualStudyId } = this.props;
    return virtualStudies.filter(study => study.virtualStudyId === activeVirtualStudyId)[0];
  }

  deleteStudy() {
    const { activeVirtualStudyId, loggedInUser } = this.props;

    return this.props.deleteVirtualStudy({
      loggedInUser,
      virtualStudyId: activeVirtualStudyId,
    });
  }

  submitHandler() {
    // prevent the user from bash clicking
    if (this.deleting) return;
    this.deleting = true;

    this.setState({ errorMessage: null });

    return this.deleteStudy()
      .then(() => {
        this.setState({ errorMessage: null });
        this.props.effects.unsetModal();
      })
      .catch(err => {
        this.deleting = false;
        this.setState({ errorMessage: err.message });
      });
  }

  render() {
    const study = this.findSelectedStudy();
    const { errorMessage } = this.state;

    return (
      <React.Fragment>
        {errorMessage && <PromptMessage heading={'Error'} content={errorMessage} error />}
        <ModalContentSection>
          Are you sure you want to delete "{study && study.name}"?
          <br />
          <br />
          This action cannot be undone.
        </ModalContentSection>
        <ModalFooter
          handleSubmit={this.submitHandler}
          submitText={'Delete'}
          submitDisabled={this.deleting}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  loggedInUser: state.user.loggedInUser,
  activeVirtualStudyId: state.currentVirtualStudy.virtualStudyId,
  virtualStudies: state.virtualStudies.studies,
});

const mapDispatchToProps = {
  deleteVirtualStudy,
};

export default compose(
  injectState,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(DeleteVirtualStudiesModalContent);
