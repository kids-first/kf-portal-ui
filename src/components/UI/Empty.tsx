import React from 'react';
import { Empty as AntdEmpty } from 'antd';
import emptyVerticalSmall from 'assets/empty-vertical-small.svg';
import emptyVerticalDefault from 'assets/empty-vertical-default.svg';
import emptyHorizontalDefault from 'assets/empty-horizontal-default.svg';
import emptyHorizontalSmall from 'assets/empty-horizontal-small.svg';
import style from './Empty.module.scss';

export enum Direction {
  HORIZONTAL = 'HORIZONTAL',
  VERTICAL = 'VERTICAL',
}

export enum SIZE {
  DEFAULT = 'DEFAULT',
  SMALL = 'SMALL',
}

type OwnProps = {
  description?: string;
  direction?: Direction;
  size?: SIZE;
  image?: string | null;
};

export const mapping = {
  [SIZE.SMALL + '.' + Direction.VERTICAL]: emptyVerticalSmall,
  [SIZE.DEFAULT + '.' + Direction.VERTICAL]: emptyVerticalDefault,
  [SIZE.DEFAULT + '.' + Direction.HORIZONTAL]: emptyHorizontalDefault,
  [SIZE.SMALL + '.' + Direction.HORIZONTAL]: emptyHorizontalSmall,
};

const computeImage = (size: SIZE, direction: Direction) => mapping[size + '.' + direction];
const computeDefaultDescriptionStyle = (size: SIZE) =>
  size === SIZE.DEFAULT ? style.descriptionDefault : style.descriptionSmall;

const DEFAULT_DESCRIPTION = 'No available data';

const generateDescriptionNode = (rawDescription: string | undefined, size: SIZE) => (
  <span className={computeDefaultDescriptionStyle(size)}>
    {rawDescription || DEFAULT_DESCRIPTION}
  </span>
);

const Empty = ({
  description,
  direction = Direction.VERTICAL,
  size = SIZE.DEFAULT,
  image = null,
}: OwnProps) => (
  <AntdEmpty
    description={generateDescriptionNode(description, size)}
    image={image || computeImage(size, direction)}
  />
);

export default Empty;
