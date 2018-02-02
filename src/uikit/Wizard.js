// @flow
import React from 'react';
import { injectState } from 'freactal';
import { compose, withState, withPropsOnChange, withHandlers } from 'recompose';
import { css } from 'react-emotion';
import { withTheme } from 'emotion-theming';

const WizardProgress = compose(withTheme)(({ index, steps, setIndex, theme }) => (
  <div>
    <div className={theme.row}>
      {steps
        .map((step, i) => ({
          ...step,
          status: i === index ? 'active' : (i === steps.length - 1 && 'last') || 'inactive',
        }))
        .map(({ title, status }, i) => (
          <div
            onClick={() => i < index && (steps[i] || { canGoBack: false }).canGoBack && setIndex(i)}
            key={title}
            className={css`
              padding: 0 ${i === 0 || i === steps.length - 1 ? '70px' : '140px'} 0 0;
              border-top: 6px solid ${i <= index ? theme.active : theme.inactive};
            `}
          >
            <div
              className={css`
                color: white;
                position: relative;
                top: -12px;
                left: ${i === 0 ? '-1px' : '71px'};
                padding: 4px 7px;
                border-radius: 10px;
                font-size: 10px;
                font-weight: bold;
                display: inline-block;
                background-color: ${i <= index ? theme.active : theme.inactive};
              `}
            >
              {i}
            </div>
          </div>
        ))}
    </div>

    <div
      className={css`
        ${theme.row} margin-left: -70px;
      `}
    >
      {steps.map(({ title }, i) => (
        <div
          key={title}
          className={css`
            width: 160px;
            text-align: center;
          `}
        >
          {title}
        </div>
      ))}
    </div>
  </div>
));

export default compose(
  injectState,
  withTheme,
  withState('index', 'setIndex', 0),
  withState('nextDisabled', 'setNextDisabled', false),
  withHandlers({
    nextStep: ({ index, setIndex, steps }) => event =>
      setIndex(index + 1 >= steps.length ? index : index + 1),
    prevStep: ({ index, setIndex, steps }) => event => setIndex(index - 1 < 0 ? index : index - 1),
  }),
  withPropsOnChange(['index'], ({ index, setIndex, steps }) => ({
    currentStep: steps[index] || { title: 'no step', Component: '--' },
  })),
)(
  ({
    steps,
    state,
    index,
    nextStep,
    prevStep,
    currentStep,
    setIndex,
    nextDisabled,
    setNextDisabled,
    theme,
  }: {
    steps: Array<{
      title: string,
      Component?: any,
      render?: Function,
      canGoBack: boolean,
      renderNext?: Function,
      displayButtons: boolean,
    }>,
    state: string,
    index: number,
    setIndex: Function,
    currentStep: any,
    nextStep: Function,
    prevStep: Function,
    setIndex: Function,
    nextDisabled: boolean,
    setNextDisabled: Function,
    displayButtons: boolean,
  }) => (
    <div>
      <div
        className={css`
          display: flex;
          justify-content: center;
        `}
      >
        <WizardProgress setIndex={setIndex} index={index} steps={steps} />
      </div>
      {currentStep.render
        ? currentStep.render({ nextStep, prevStep, disableNextStep: setNextDisabled })
        : currentStep.Component}
      {currentStep.renderButtons &&
        currentStep.renderButtons({
          nextStep,
          prevStep,
          nextDisabled,
          prevDisabled: index - 1 < 0 || !steps[index - 1].canGoBack,
        })}
    </div>
  ),
);
