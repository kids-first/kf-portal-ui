import React from 'react';
import PropTypes from 'prop-types';
import { compose, withHandlers, withPropsOnChange, withState } from 'recompose';
import { withRouter } from 'react-router';

import { trackPageView } from 'services/analyticsTracking';
import Column from 'uikit/Column';

import { Divider, Steps } from 'antd';

const { Step } = Steps;

const WizardProgress = ({ index, steps }) => {
  return (
    <div style={{ width: '100%' }}>
      <Steps current={index}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <Divider />
    </div>
  );
};

const Wizard = compose(
  withRouter,
  withState('index', 'setIndex', 0),
  withState('nextDisabled', 'setNextDisabled', false),
  withState('customStepMessage', 'setCustomStepMessage', null),
  withHandlers({
    nextStep: ({ index, setIndex, steps }) => event =>
      setIndex(index + 1 >= steps.length ? index : index + 1),
    prevStep: ({ index, setIndex, steps }) => event => setIndex(index - 1 < 0 ? index : index - 1),
  }),
  withPropsOnChange(['index'], ({ index, setIndex, steps, location }) => {
    trackPageView(`${location.pathname}#${steps[index].title.replace(/\s/g, '')}`);
    return {
      currentStep: steps[index] || { title: 'no step', Component: '--' },
    };
  }),
)(
  ({
    steps,
    index,
    nextStep,
    prevStep,
    currentStep,
    setIndex,
    nextDisabled,
    setNextDisabled,
    customStepMessage,
    setCustomStepMessage,
    HeaderComponent,
    getContentClassName = () => '',
  }) => {
    const disableNextStep = setNextDisabled;
    const prevDisabled = index - 1 < 0 || !steps[index - 1].canGoBack;
    return (
      <Column className="wizard-container">
        <Column className={getContentClassName({ index })}>
          {HeaderComponent && <HeaderComponent />}
          <div className="wizard-progress-container">
            <WizardProgress setIndex={setIndex} index={index} steps={steps} />
          </div>
          {currentStep.render
            ? currentStep.render({
                disableNextStep,
                customStepMessage,
                setCustomStepMessage,
                nextStep,
                prevStep,
                nextDisabled,
                prevDisabled,
              })
            : currentStep.Component}
        </Column>
      </Column>
    );
  },
);

Wizard.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      canGoBack: PropTypes.bool.isRequired,
      Component: PropTypes.any,
      render: PropTypes.func,
      renderButtons: PropTypes.func,
    }),
  ),
  index: PropTypes.number.isRequired,
  setIndex: PropTypes.func.isRequired,
  currentStep: PropTypes.any.isRequired,
  nextStep: PropTypes.func.isRequired,
  prevStep: PropTypes.func.isRequired,
  nextDisabled: PropTypes.bool.isRequired,
  setNextDisabled: PropTypes.func.isRequired,
  customStepMessage: PropTypes.string.isRequired,
  setCustomStepMessage: PropTypes.func.isRequired,
  HeaderComponent: PropTypes.func.isRequired,
  getContentClassName: PropTypes.func.isRequired,
};

export default Wizard;
