/* eslint-disable react/prop-types */
import React, { FunctionComponent, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ButtonProps } from 'antd/lib/button';
import { Button } from 'antd';

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
}) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Button
      loading={isLoading}
      type={type}
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
