import React from 'react';
import { isEqual, keys, mapValues } from 'lodash';
import Spinner from 'react-spinkit';
import { css } from 'emotion';

import Select, { SelectOptionDropdown, DropDownOption } from '../uikit/Select';
import PillInputWithButton from './PillInputWithButton';

const LoadingSpinner = () => (
  <Spinner
    fadeIn="none"
    name="circle"
    color="#a9adc0"
    style={{
      width: 15,
      height: 15,
      marginLeft: 7,
      position: 'absolute',
    }}
  />
);

class PillInputWithLoadingOptionsAndButton extends React.Component {
  initOptionState = (props, val = { enabled: true, loading: false }) =>
    mapValues(props.options, () => val);

  state = {
    isDropdownOpen: false,
    selected: keys(this.props.options)[0],
    optionState: this.initOptionState(this.props),
  };

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps, this.props)) {
      this.setState({
        isDropdownOpen: false,
        selected: keys(nextProps.options)[0],
        optionState: this.initOptionState(nextProps),
      });
    }
  }

  onToggle = () => {
    const { options } = this.props;
    const { isDropdownOpen, optionState } = this.state;
    this.setState({ isDropdownOpen: !isDropdownOpen }, async () => {
      if (!isDropdownOpen) {
        const optionsWithOperation = keys(options).filter(k => !!options[k].onDropdownOpen);
        this.setState({
          optionState: optionsWithOperation.reduce(
            (obj, k) => ({ ...obj, [k]: { enabled: false, loading: true } }),
            optionState,
          ),
        });
        const optionResponses = await Promise.all(
          optionsWithOperation.map(async key => ({
            key,
            enabled: !!await options[key].onDropdownOpen(),
          })),
        );
        this.setState({
          optionState: optionResponses.reduce(
            (obj, x) => ({
              ...obj,
              [x.key]: { loading: false, enabled: x.enabled },
            }),
            optionState,
          ),
        });
      }
    });
  };
  render() {
    const {
      containerClassName = '',
      tooltipStyle,
      options,
      LoadingComponent = LoadingSpinner,
      selectedLabelTruncate,
      ...props
    } = this.props;
    const { isDropdownOpen, optionState, selected } = this.state;
    return (
      <div className={containerClassName}>
        <PillInputWithButton
          {...props}
          options={options}
          selected={selected}
          onOptionSelect={() => {
            this.setState({ isDropdownOpen: false });
            return options[selected].onSelected();
          }}
          SelectComponent={selectProps => (
            <Select
              {...selectProps}
              align="left"
              isOpen={isDropdownOpen}
              onOuterClick={() => this.setState({ isDropdownOpen: false })}
              highlightedIndex={null}
              items={Object.keys(options)}
              onToggle={this.onToggle}
              selectedLabelTruncate={selectedLabelTruncate}
              OptionDropdownComponent={dropDownProps => (
                <SelectOptionDropdown
                  {...dropDownProps}
                  selectItem={item => this.setState({ selected: item })}
                  isItemDisabled={({ item }) => !optionState[item].enabled}
                  DropDownOptionComponent={({ item, ...optionProps }) => (
                    <div
                      css={`
                        position: 'relative';
                        display: flex;
                        align-items: center;
                      `}
                    >
                      {optionState[item].loading && <LoadingComponent />}
                      <div style={{ visibility: optionState[item].loading ? 'hidden' : 'visible' }}>
                        <DropDownOption {...{ ...optionProps, item }} />
                        {!optionState[item].enabled &&
                          options[item].tooltip && (
                            <div
                              className={css`
                                position: absolute;
                                top: 100%;
                                background: white;
                                padding: 5px;
                                margin-top: -6px;
                                border-radius: 7px;
                                box-shadow: 1px 1px 7px rgba(0, 0, 0, 0.2);
                              `}
                            >
                              {options[item].tooltip}
                            </div>
                          )}
                      </div>
                    </div>
                  )}
                />
              )}
            />
          )}
        />
      </div>
    );
  }
}

export default PillInputWithLoadingOptionsAndButton;
