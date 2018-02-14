import React from 'react';
import Downshift from 'downshift';

import downChevronIcon from '../assets/icon-chevron-down-grey.svg';

function Select({ items, className, align = 'right', ...rest }) {
  return (
    <Downshift {...rest}>
      {({ getItemProps, isOpen, toggleMenu, selectedItem }) => (
        <div
          css={`
            position: relative;
            white-space: nowrap;
            z-index: 999;
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
            {selectedItem}
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
              style={{
                position: 'absolute',
                background: 'white',
                minWidth: '100%',
                zIndex: 1,
                border: '1px solid rgba(0, 0, 0, 0.05)',
                boxSizing: 'border-box',
                cursor: 'pointer',
                padding: 5,
                right: align === 'right' ? 0 : 'auto',
                left: align === 'right' ? 'auto' : 0,
                top: '100%',
              }}
            >
              {items.map(item => (
                <div
                  {...getItemProps({ item })}
                  key={item}
                  style={{ cursor: 'pointer', padding: 5 }}
                >
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

export default Select;
