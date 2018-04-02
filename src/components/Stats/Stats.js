import React from 'react';
import Query from '@arranger/components/dist/Query';
import { get } from 'lodash';
import Spinner from 'react-spinkit';

const Line = () => {
  return (
    <div
      css={`
        width: 1px;
        height: 35px;
        background-color: #d4d6dd;
      `}
    />
  );
};

const Stat = ({ sqon, index, icon = '', accessor = '', label = '', query, fragment, ...props }) => {
  const getValue = typeof accessor() === 'function' ? accessor() : data => get(data, accessor());

  return (
    <div
      className={`stat`}
      css={`
        display: flex;
        flex-grow: 1;
        justify-content: center;
      `}
    >
      {icon}
      <div
        css={`
          font-size: 18px;
          font-weight: 500;
          letter-spacing: 0.3px;
          color: #343434;
          margin-right: 6px;
        `}
      >
        <Query
          debounceTime={100}
          name={`${index}StatQuery`}
          {...props}
          query={query(fragment())}
          variables={{ sqon }}
          index={index}
          render={data =>
            data ? (
              (getValue(data, accessor()) || 0).toLocaleString()
            ) : (
              <Spinner
                fadeIn="none"
                name="circle"
                color="#a9adc0"
                style={{
                  width: 15,
                  height: 15,
                  marginRight: 9,
                }}
              />
            )
          }
        />
      </div>
      <div
        css={`
          font-size: 13px;
          font-weight: 300;
          line-height: 1.54;
          letter-spacing: 0.2px;
          color: #74757d;
        `}
      >
        {label}
      </div>
    </div>
  );
};

export default ({ stats, className, ...props }) => (
  <div
    className={`statContainer`}
    css={`
      border: solid 1px #e0e1e6;
      display: flex;
      padding: 14px 0;
      align-items: center;
      background: #fff;
      ${className};
    `}
  >
    {stats.map((stat, i) => [
      i > 0 && <Line key={i} />,
      <Stat key={stat.label} {...props} {...stat} />,
    ])}
  </div>
);
