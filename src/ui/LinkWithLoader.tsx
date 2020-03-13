import React, { FunctionComponent, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Spin } from 'antd';
import { Link } from 'react-router-dom';

interface Props extends RouteComponentProps<any> {
  getLink: () => Promise<string>;
  label: string;
  children: React.ReactNode;
  linkClassname?: string;
}

const LinkWithLoader: FunctionComponent<Props> = ({
  getLink,
  history,
  children,
  linkClassname = '',
}) => {
  const [isLoading, setIsLoading] = useState(false);
  if (isLoading) {
    return <Spin />;
  }
  return (
    <Link
      className={linkClassname}
      to={''}
      onClick={async e => {
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
    </Link>
  );
};

export default withRouter(LinkWithLoader);
