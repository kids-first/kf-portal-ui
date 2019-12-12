import React from 'react';
import PropTypes from 'prop-types';
import { compose, withState, withPropsOnChange, withHandlers } from 'recompose';
import { withRouter } from 'react-router';
import cx from 'classnames';

import { trackPageView } from 'services/analyticsTracking';
import Column from 'uikit/Column';

import './Wizard.css';

const WizardProgress = ({ index, steps, setIndex }) => {
  return (
    <div className="wizard-progress-content">
      {steps
        .map((step, i) => ({
          ...step,
          first: i === 0,
          last: i === steps.length - 1,
          past: i < index,
          current: i === index,
          future: i > index,
          other: i !== index,
        }))
        .map(({ title, inactive, first, last, past, current, future, other }, i) => (
          <div
            className={`wizard-step ${cx({ inactive, first, last, past, current, future, other })}`}
            key={i}
          >
            <div
              onClick={() => past && (steps[i] || { canGoBack: false }).canGoBack && setIndex(i)}
              key={title}
              className="progress-bar"
            >
              <div className="progress-bar-step">{i + 1}</div>
            </div>
            <div className="progress-bar-step-title">{title}</div>
          </div>
        ))}
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
