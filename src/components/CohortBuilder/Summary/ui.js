import React, { useRef } from 'react';
import Card from 'uikit/Card';
import CardHeader from 'uikit/Card/CardHeader';
import { HeaderWrapper, CardWrapper } from 'uikit/Card/styles';
import { styleComponent } from 'components/Utils';
import { Spinner } from 'uikit/Spinner';
import PropTypes from 'prop-types';
import './Summary.css';

export const BarChartContainer = styleComponent('div', 'barChartContainer');

const LongCard = styleComponent(CardWrapper, 'longCard');
const MediumCard = styleComponent(CardWrapper, 'mediumCard');
const CohortHeaderWrapper = styleComponent(HeaderWrapper, 'cohortHeaderWrapper');
const CohortCardHeader = styleComponent(CardHeader, 'cohortCardHeader');

export const CohortCard = ({
                             title,
                             badge,
                             children,
                             long = false,
                             loading = false,
                             showHeader = true,
                             Content,
                           }) => {
  const divElem = useRef();
  return (
    <Card
      CardWrapper={long ? LongCard : MediumCard}
      HeaderWrapper={CohortHeaderWrapper}
      Header={<CohortCardHeader title={title} badge={badge} />}
      showHeader={showHeader}
      Content={Content}
    >
      {loading ?
        <div ref={divElem} className="dynamic-content">
          <Spinner className={'spinner'} size={'large'} />
        </div>
        : typeof children === 'function' ? (
          <div ref={divElem} className="dynamic-content">
            {children({ height: divElem.current?.offsetHeight })}
          </div>
        ) : (
          children
        )}

      }
    </Card>
  )
}

CohortCard.propTypes = {
  title: PropTypes.string,
  long: PropTypes.bool,
  loading: PropTypes.bool,
  showHeader: PropTypes.bool,
  children: PropTypes.any,
  Content: PropTypes.func,
  badge: PropTypes.number,
};

export const getCohortBarColors = (data, theme) => {
  const { chartColors } = theme;
  const hasProbands = data.some((d) => d.probands !== 0);
  const hasFamilyMembers = data.some((d) => d.familyMembers !== 0);
  const colors = [];
  if (hasProbands) colors.push(chartColors.blue);
  if (hasFamilyMembers) colors.push(chartColors.purple);
  return colors;
};
