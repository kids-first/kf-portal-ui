import React from 'react';
import Row from 'uikit/Row';
import SearchIcon from 'react-icons/lib/fa/search';
import FaTimesCircleO from 'react-icons/lib/fa/times-circle';
// import { flex } from 'styled-system';
import omit from 'lodash/omit';

import { input, flex } from '../theme/tempTheme.module.css';
import { filterInputWrapper, filterInput, iconLeft, iconRight } from './Input.module.css';

/*
this component should implement the same interface as <input> from react-dom
with some additional props
*/
const FilterInputWrapper = ({ children, className = '', ...props }) => (
  <Row className={`${input} ${filterInputWrapper} ${className}`} {...props}>
    {children}
  </Row>
);

const setNativeValue = (element, value) => {
  const valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
  const prototype = Object.getPrototypeOf(element);
  const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;

  if (valueSetter && valueSetter !== prototypeValueSetter) {
    prototypeValueSetter.call(element, value);
  } else {
    valueSetter.call(element, value);
  }
};
export const FilterInput = ({
  LeftIcon = SearchIcon,
  RightIcon = FaTimesCircleO,
  className,
  value,
  disabled,
  ref = React.createRef(),
  ...props
}) => {
  const clearInput = () => {
    const input = ref.current;
    setNativeValue(input, '');
    input.dispatchEvent(new Event('input', { bubbles: true }));
  };
  return (
    <FilterInputWrapper disabled={disabled} className={className}>
      {LeftIcon && <LeftIcon className={iconLeft} />}
      <input
        className={filterInput}
        {...{ value, disabled, ...omit(props, ['componentRef']) }}
        ref={ref}
        autoFocus
      />
      {value && value.length && <RightIcon className={iconRight} onClick={clearInput} />}
    </FilterInputWrapper>
  );
};

export default ({ children, className, italic = false, ...props }) => (
  <input
    className={`${input} ${flex} ${className}`}
    style={
      italic
        ? {
            fontStyle: 'italic',
          }
        : {}
    }
    {...props}
  >
    {children}
  </input>
);
