import React from 'react';
import Gravtar from 'uikit/Gravatar';
import { Link } from 'react-router-dom';
import CogIcon from 'react-icons/lib/fa/cog';
import PencilIcon from 'react-icons/lib/fa/pencil';

import LinkButton from './LinkButton';
import CompletionWrapper from '../UserProfile/CompletionWrapper';
import RoleIconButton from '../RoleIconButton';

export default ({ theme, percentageFilled, loggedInUser, profileColors }) => (
  <div className={`profileInfoBar ${theme.column}`}>
    <CompletionWrapper completed={percentageFilled} innerCircleSize="83.18%">
      <Gravtar className={`gravatar`} email={loggedInUser.email || ''} size={180} />
    </CompletionWrapper>

    <RoleIconButton className={`roleIconButton`}>
      <span>{`${(percentageFilled * 100).toFixed(0)}% Complete`}</span>
    </RoleIconButton>
    <div>
      <Link to={`/user/${loggedInUser.egoId}#aboutMe`} className={`userFullName`}>
        {loggedInUser.title && loggedInUser.title.replace(/^./, m => m.toUpperCase()) + '. '}
        {loggedInUser.firstName} {loggedInUser.lastName}
      </Link>
      {[
        loggedInUser.jobTitle && <span className={`jobTitle`}>{loggedInUser.jobTitle}</span>,
        loggedInUser.institution,
        [loggedInUser.city, loggedInUser.state].filter(Boolean).join(', '),
        loggedInUser.country,
      ]
        .filter(Boolean)
        .map((str, i) => <div key={`${str}${i}`}>{str}</div>)}
      <div className={`email`}>{loggedInUser.email}</div>
    </div>
    <div className={theme.row}>
      <LinkButton hash="#aboutMe" icon={<PencilIcon />} egoId={loggedInUser.egoId} theme={theme}>
        edit profile
      </LinkButton>
      <LinkButton hash="#settings" icon={<CogIcon />} egoId={loggedInUser.egoId} theme={theme}>
        setting
      </LinkButton>
    </div>
  </div>
);
