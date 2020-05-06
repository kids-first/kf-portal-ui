type CardHearProps = {
  title: string;
  children: string | React.ReactElement[];
  className: string;
  props: any;
  badge?: React.ReactElement;
};

declare function CardHeader(CardHearProps): React.ReactElement;

export default CardHeader;
