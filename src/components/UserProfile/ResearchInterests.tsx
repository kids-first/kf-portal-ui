import React from 'react';
import { CheckCircleFilled } from '@ant-design/icons';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import { Typography } from 'antd';
import chunk from 'lodash/chunk';

import { toKebabCase } from 'utils';

import './style.css';

const { Text } = Typography;

const CHUNK_SIZE = 2;

type Props = {
  interests: string[];
};

const ResearchInterest = ({ interests }: Props) => {
  const chunks = chunk(interests, CHUNK_SIZE);
  return (
    <>
      {chunks.map((chunk, index) => {
        const [interestLeft, interestRight] = chunk;
        return (
          <StackLayout key={toKebabCase(`${index}${interestLeft} ${interestRight}`)}>
            <div className={'ri-ro-text-wrapper ri-text-wrapper'}>
              <Text>
                <CheckCircleFilled className={'ri-icon'} />
                {interestLeft}
              </Text>
            </div>
            <div className={'ri-ro-text-wrapper ri-text-wrapper'}>
              {Boolean(interestRight) && (
                <Text>
                  <CheckCircleFilled className={'ri-icon'} />
                  {interestRight}
                </Text>
              )}
            </div>
          </StackLayout>
        );
      })}
    </>
  );
};

export default ResearchInterest;
