/*
  There are a lot of warnings induced by the  "...props' festival".
  Some of our external libraries use this bad pattern as well
  which makes it almost impossible at the moment to fix them correctly.
  So, for the sake of depolluting the warnings, I'll use the following method. 
*/

export const removeUnwantedProps = (incomingProps = {}, blackListedPropKeys = []) => {
  const filteredEntries = Object.entries(incomingProps).filter(
    ([key]) => !blackListedPropKeys.includes(key),
  );
  return Object.fromEntries(filteredEntries);
};
