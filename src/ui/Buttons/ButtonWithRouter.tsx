/* eslint-disable react/prop-types */
import React, { FunctionComponent, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Button } from 'antd';
import { ButtonProps } from 'antd/lib/button';

type OwnProps = {
  children: React.ReactNode;
  getLink: () => Promise<string>;
};

type Props = OwnProps & RouteComponentProps & ButtonProps;

const ButtonWithRouter: FunctionComponent<Props> = ({
  getLink,
  history,
  children,
  type = 'primary',
  size = 'middle',
}) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Button
      loading={isLoading}
      type={type}
      size={size}
      onClick={async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const url = await getLink();
        setIsLoading(false);
        if (url) {
          history.push(url);
        }
      }}
    >
      {children}
    </Button>
  );
};

export default withRouter(ButtonWithRouter);
