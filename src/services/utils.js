import React, { Fragment } from 'react';
import Component from 'react-component-component';
import { compose, withState, withHandlers } from 'recompose';

export const toGqlString = str => str.replace('.', '__');
export const fromGqlString = str => str.replace('__', '.');
export const hocToRenderProps = hoc => hoc(({ render, ...props }) => render(props));

export const DropDownState = ({ render }) => {
  const withDropdownState = compose(
    withState('isDropdownVisible', 'setDropdownVisibility', false),
    withHandlers({
      toggleDropdown: ({ isDropdownVisible, setDropdownVisibility }) => e => {
        setDropdownVisibility(!isDropdownVisible);
      },
    }),
  );
  const Provider = hocToRenderProps(withDropdownState);
  return (
    <Provider
      render={({ isDropdownVisible, toggleDropdown, setDropdownVisibility }) => {
        const closeMenu = () => setDropdownVisibility(false);
        return (
          <Component
            didMount={() => window.addEventListener('click', closeMenu)}
            willUnmount={() => window.removeEventListener('click', closeMenu)}
          >
            {() => render({ isDropdownVisible, toggleDropdown, setDropdownVisibility })}
          </Component>
        );
      }}
    />
  );
};
