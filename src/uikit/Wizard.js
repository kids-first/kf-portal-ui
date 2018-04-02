// @flow
import React from 'react';
import { injectState } from 'freactal';
import { compose, withState, withPropsOnChange, withHandlers } from 'recompose';
import { css } from 'react-emotion';
import { withTheme } from 'emotion-theming';

const BAR_STEP_WIDTH = 320;
const WizardProgress = compose(withTheme)(({ index, steps, setIndex, theme }) => (
  <div css={theme.row}>
    {steps
      .map((step, i) => ({
        ...step,
        status: i === index ? 'active' : (i === steps.length - 1 && 'last') || 'inactive',
      }))
      .map(({ title, status }, i) => (
        <div>
          <div
            onClick={() => i < index && (steps[i] || { canGoBack: false }).canGoBack && setIndex(i)}
            key={title}
            className={css`
              padding: 0
                ${i === 0 || i === steps.length - 1
                  ? `${BAR_STEP_WIDTH / 2}px`
                  : `${BAR_STEP_WIDTH}px`}
                0 0;
              border-top: 6px solid ${i <= index ? theme.active : theme.inactive};
            `}
          >
            <div
              className={css`
                color: white;
                position: relative;
                top: -12px;
                left: ${i === 0 ? '-1px' : `${BAR_STEP_WIDTH / 2 + 1}px`};
                padding: 4px 8px;
                border-radius: 10px;
                font-size: 10px;
                font-weight: bold;
                display: inline-block;
                background-color: ${i <= index ? theme.active : theme.inactive};
              `}
            >
              {i + 1}
            </div>
          </div>
          <div
            className={css`
              position: relative;
              top: 0;
              left: ${i === 0 ? '-20px' : `${BAR_STEP_WIDTH / 2 - 20}px`};
              font-size: 10px;
              font-weight: bold;
              display: inline-block;
              font-family: Montserrat;
              font-size: 14px;
              font-weight: 600;
              line-height: 2.14;
              letter-spacing: 0.2px;
              text-align: center;
              color: ${i <= index ? theme.greyScale1 : theme.inactive};
            `}
          >
            {title}
          </div>
        </div>
      ))}
  </div>
));

export default compose(
  injectState,
  withTheme,
  withState('index', 'setIndex', 0),
  withState('nextDisabled', 'setNextDisabled', false),
  withState('customStepMessage', 'setCustomStepMessage', null),
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
    customStepMessage,
    setCustomStepMessage,
  }: {
    steps: Array<{
      title: string,
      canGoBack: boolean,
      Component?: any,
      render?: Function,
      renderButtons?: Function,
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
    customStepMessage: string,
    setCustomStepMessage: Function,
  }) => (
    <div>
      <div
        className={css`
          display: flex;
          justify-content: center;
          border-bottom: 1px solid ${theme.greyScale4};
        `}
      >
        <WizardProgress setIndex={setIndex} index={index} steps={steps} />
      </div>
      {currentStep.render
        ? currentStep.render({
            disableNextStep: setNextDisabled,
            customStepMessage,
            setCustomStepMessage,
            nextStep,
            prevStep,
            nextDisabled,
            prevDisabled: index - 1 < 0 || !steps[index - 1].canGoBack,
          })
        : currentStep.Component}
    </div>
  ),
);
