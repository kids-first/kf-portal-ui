import React from 'react';
import Downshift from 'downshift';

import downChevronIcon from '../assets/icon-chevron-down-grey.svg';

function Dropdown({ items, className, children, align = 'right', ...rest }) {
  return (
    <Downshift {...rest}>
      {({ getItemProps, isOpen, toggleMenu, itemToString, selectedItem }) => (
        <div
          css={`
            position: relative;
            white-space: nowrap;
            z-index: 100;
            border-radius: 10px;
            background-color: #ffffff;
            border: solid 1px #cacbcf;
            color: #343434;
            font-size: 12px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            padding-left: 10px;
            ${className};
          `}
        >
          <div
            style={{
              display: 'flex',
              cursor: 'pointer',
              flexGrow: 1,
              height: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
            onClick={toggleMenu}
          >
            {children}
            <img
              alt=""
              src={downChevronIcon}
              css={`
                width: 9px;
                margin-left: 7px;
                margin-right: 12px;
                transform: rotate(${isOpen ? 180 : 0}deg);
                transition: transform 0.2s;
              `}
            />
          </div>
          {!isOpen ? null : (
            <div
              css={`position: absolute;
              background: white;
              min-width: 100%;
              z-index: 1;
              box-sizing: border-box,
              cursor: pointer;
              padding: 5,
              right: ${align === 'right' ? 0 : 'auto'};
              left: ${align === 'right' ? 'auto' : 0};
              top: 100%;
              box-shadow: 0 0 4.9px 0.1px #bbbbbb;

              &:after, &:before {
                bottom: 100%;
                left: 50%;
                border: solid transparent;
                content: " ";
                height: 0;
                width: 0;
                position: absolute;
                pointer-events: none;
              }

              &:after {
                border-color: rgba(255, 255, 255, 0);
                border-bottom-color: #ffffff;
                border-width: 6px;
                margin-left: -6px;
              }
              &:before {
                border-color: rgba(0, 0, 0, 0);
                border-bottom-color: #bbb;
                border-width: 7px;
                margin-left: -7px;
              }
            `}
            >
              {items.map((item, i) => (
                <div {...getItemProps({ item })} key={i} style={{ cursor: 'pointer', padding: 10 }}>
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Downshift>
  );
}

export default Dropdown;
