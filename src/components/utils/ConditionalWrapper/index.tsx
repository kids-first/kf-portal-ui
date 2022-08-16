import React from 'react';

interface IConditionalWrapperProps {
  condition: boolean;
  wrapper: (children: React.ReactElement) => React.ReactElement;
  children: React.ReactElement;
}

const ConditionalWrapper = ({ condition, wrapper, children }: IConditionalWrapperProps) =>
  condition ? wrapper(children) : children;

export default ConditionalWrapper;