type CardHearProps = {
  title: string;
  children: string | React.ReactElement[];
  className: string;
  badge?: React.ReactElement;
};

declare function CardHeader(CardHearProps): React.ReactElement;

export default CardHeader;
