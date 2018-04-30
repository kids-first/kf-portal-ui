import React from 'react';
import { compose, withState, withProps } from 'recompose';
import Button from '../uikit/Button';
import Select from '../uikit/Select';
import LoadingOnClick from '../components/LoadingOnClick';

const enhance = compose(
  withProps(({ options = [], defaultSelected }) => ({
    options,
    defaultSelected: defaultSelected || Object.keys(options)[0],
  })),
  withState('selected', 'setSelected', ({ defaultSelected }) => defaultSelected),
);

const SelectStyle = `
  border-radius: 10px;
  border-right: none;
  border-top-right-radius: unset;
  border-bottom-right-radius: unset;
  flex-grow: 1;
  height: 30px;
`;

export const PillInputWithButton = ({
  selected,
  setSelected,
  options,
  defaultSelected,
  children,
  onClick,
  render,
  SelectComponent,
  onOptionSelect,
  isButtonDisabled,
}) => {
  return (
    <LoadingOnClick
      onClick={() => (onOptionSelect ? onOptionSelect({ selected }) : options[selected]())}
      render={({ onClick, loading }) => {
        return (
          <div
            css={`
              display: flex;
            `}
          >
            {SelectComponent && (
              <SelectComponent css={SelectStyle} {...{ setSelected, selectedItem: selected }} />
            )}
            {!SelectComponent && (
              <Select
                items={Object.keys(options)}
                defaultSelectedItem={defaultSelected}
                onChange={e => setSelected(e)}
                css={SelectStyle}
              />
            )}
            <Button
              disabled={isButtonDisabled ? isButtonDisabled() : !options[selected]}
              onClick={onClick}
              css={`
                border-radius: 10px;
                border-top-left-radius: unset;
                border-bottom-left-radius: unset;
                flex-grow: 1;
                box-sizing: border-box;
                flex: none;
                padding-left: 8px;
              `}
            >
              {render ? render({ loading }) : children}
            </Button>
          </div>
        );
      }}
    />
  );
};

export default enhance(PillInputWithButton);
