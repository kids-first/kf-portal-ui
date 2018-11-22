import React from 'react';

import CardContent from 'uikit/Card/CardContent';
import CardHeader from 'uikit/Card/CardHeader';
import { CardWrapper } from 'uikit/Card/styles';
import { withState, compose } from 'recompose';

const Multicard = compose(
  withState('badgeNumber', 'setBadgeNumber', null),
  withState('index', 'setIndex', 0),
)(
  ({
    Header,
    Content = CardContent,
    children,
    className,
    title,
    scrollable,
    setTitle,
    setIndex,
    setBadgeNumber,
    index,
    tabMenu,
  }) => {
    const setBadge = n => {
      if (n !== badgeNumber) setBadgeNumber(n);
    };

    console.log('children', children, React.Children.map(children, c => console.log('c', c)));
    return (
      <CardWrapper className={className}>
        {Header || <CardHeader title={title} />}

        <Content scrollable={scrollable} />
        {children({ setTitle, setIndex, setBadge, index })}
      </CardWrapper>
    );
  },
);

export default Multicard;
