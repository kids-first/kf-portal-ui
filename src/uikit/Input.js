import React from 'react';
import styled from 'react-emotion';
import { withTheme } from 'emotion-theming';
import Row from 'uikit/Row';
import SearchIcon from 'react-icons/lib/fa/search';
import FaTimesCircleO from 'react-icons/lib/fa/times-circle';

// this this component should implement the default <input> type from react-dom with some additional
// props for styling
export const FilterInput = withTheme(
  ({
    theme,
    LeftIcon = SearchIcon,
    RightIcon = FaTimesCircleO,
    className,
    value,
    disabled,
    ...props
  }) => {
    const Wrapper = styled(Row)`
      ${({ theme }) => theme.input};
      color: ${({ theme }) => theme.greyScale7};
      align-items: center;
      .icon-left {
        margin-right: 5px;
      }
      .icon-right {
        cursor: pointer;
      }
      input {
        border: none;
        flex: 1;
      }
    `;
    const clearInput = () => props.onChange({ target: { value: '' } });
    return (
      <Wrapper disabled={disabled} className={className}>
        <LeftIcon className={'icon-left'} />
        <input {...{ value, disabled, ...props }} autoFocus />
        {value && value.length && <RightIcon className={'icon-right'} onClick={clearInput} />}
      </Wrapper>
    );
  },
);

export default styled('input')`
  ${({ theme }) => theme.input};
`;
