import React from 'react';
import { compose, withState, withProps } from 'recompose';
import Button from '../uikit/Button';
import Select from '../uikit/Select';

const enhance = compose(
  withProps(({ options = [], defaultSelected }) => ({
    options,
    defaultSelected: defaultSelected || options[0],
  })),
  withState('selected', 'setSelected', ({ defaultSelected }) => defaultSelected),
);

const PillInputWithButton = ({
  selected,
  setSelected,
  options,
  defaultSelected,
  children,
  onClick,
}) => {
  return (
    <div
      css={`
        display: flex;
      `}
    >
      <Select
        items={options}
        defaultSelectedItem={defaultSelected}
        onChange={e => setSelected(e)}
        css={`
          border-radius: 10px;
          border-right: none;
          border-top-right-radius: unset;
          border-bottom-right-radius: unset;
          flex-grow: 1;
          height: 30px;
        `}
      />
      <Button
        onClick={() => onClick(selected)}
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
        {children}
      </Button>
    </div>
  );
};

export default enhance(PillInputWithButton);
