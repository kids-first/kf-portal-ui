import { Typography } from 'antd';
import { ParagraphProps } from 'antd/lib/typography/Paragraph';
import cx from 'classnames';

import styles from './index.module.css';

const { Paragraph } = Typography;

type TLandingPageParagraph = ParagraphProps & {
  lead?: boolean;
  bold?: boolean;
  small?: boolean;
};

const LandingPageParagraph = ({
  lead = false,
  bold = false,
  small = false,
  ...props
}: TLandingPageParagraph) => (
  <Paragraph
    {...props}
    className={cx(styles.landingPageParagraph, props.className, {
      [styles.lead]: lead,
      [styles.bold]: bold,
      [styles.small]: small,
    })}
  />
);

export default LandingPageParagraph;
