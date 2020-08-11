/* eslint-disable react/prop-types */
import React, { FunctionComponent, isValidElement } from 'react';
import { Card, Typography } from 'antd';
import { CardProps } from 'antd/lib/card';
import './SplashPage.css';
const { Title } = Typography;

type OwnProps = {
  stealth?: boolean;
  content: React.ReactNode;
  footerContent?: React.ReactNode;
  mainTitle: string;
};

type Props = OwnProps & CardProps;

const SplashPage: FunctionComponent<Props> = ({
  content,
  mainTitle,
  stealth = false,
  title = '',
  extra,
  footerContent,
}) => {
  if (stealth) {
    return <div className="splashPageContainer">{content}</div>;
  }

  return (
    <div className="splashPageContainer">
      <Title className={'main-title'}>{mainTitle}</Title>
      <Card title={title} extra={extra}>
        {content}
        {isValidElement(footerContent) && <div className={'footer'}>{footerContent}</div>}
      </Card>
    </div>
  );
};

export default SplashPage;
