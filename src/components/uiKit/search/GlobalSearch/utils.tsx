import { isEmpty } from 'lodash';

export const highlightSearchMatch = (value: string, matchRegex: RegExp, search: string) => {
  const result = !isEmpty(search) && value.search(matchRegex) >= 0;

  return result ? (
    <span
      dangerouslySetInnerHTML={{
        __html: value.replace(matchRegex, (match) => `<strong>${match}</strong>`),
      }}
    ></span>
  ) : (
    value
  );
};
