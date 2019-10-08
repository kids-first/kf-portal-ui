import { Avatar, Table } from 'antd';
import React from 'react';
import { find } from 'lodash';
import { ROLES } from 'common/constants';
import { ProfileImage } from 'components/UserProfile/ui';
import { NavigationGravatar } from 'components/Header/ui';
import { MemberImage } from 'components/MemberSearchPage/ui';

const userRoleDisplayName = (userRole) => find(ROLES, { type: userRole }).displayName;
const columns = [
  {
    title: 'Avatar',
    key: 'avatar',
    render: (member) => (
      <span>
        <MemberImage email={member.email || ''}/>
        {console.log(member.roles[0])}
        {console.log(userRoleDisplayName(member.roles[0]))}
        {console.log(member.roles[0])}
        <div>{userRoleDisplayName(member.roles[0])}</div>
      </span>

    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: (member) => (
      <span>
        <a>{member.title + ' ' + member.firstName + ' ' + member.lastName}</a>
        <div>{member.city}, {member.state}, {member.country}</div>
        <div>Research Interests: {member.interests.join(",")}</div>
      </span>
    ),
  },
];

const MemberTable = (props) => {
  return (
    <div>
      {console.log(props)}
      <Table pagination={{defaultPageSize:10, showSizeChanger: true, pageSizeOptions: ['10', '20', '50']}} columns={columns} dataSource={props.memberList} />
    </div>
  );
};

export default MemberTable;