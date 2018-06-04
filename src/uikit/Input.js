import React from 'react';
import styled from 'react-emotion';
import { withTheme } from 'emotion-theming';
import Row from 'uikit/Row';
import SearchIcon from 'react-icons/lib/fa/search';
import FaTimesCircleO from 'react-icons/lib/fa/times-circle';

export const FilterInput = withTheme(
  ({ theme, LeftIcon = SearchIcon, RightIcon = FaTimesCircleO, className, value, ...props }) => {
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
    return (
      <Wrapper className={className}>
        <LeftIcon className={'icon-left'} />
        <input {...{ value, ...props }} autoFocus />
        {value &&
          value.length && (
            <RightIcon
              className={'icon-right'}
              onClick={() => {
                props.onChange({ target: { value: '' } });
              }}
            />
          )}
      </Wrapper>
    );
  },
);

export default styled('input')`
  ${({ theme }) => theme.input};
`;
