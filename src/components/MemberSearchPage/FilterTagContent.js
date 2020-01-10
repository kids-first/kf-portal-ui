import React from 'react';
import { Icon, Row, Tag } from 'antd';
import { find } from 'lodash';
import { ROLES } from 'common/constants';

const userRoleDisplayName = userRole => {
  const role = find(ROLES, { type: userRole });
  return role ? role.displayName : userRole;
};

const FilterTagContent = ({ filters, type, clearTag }) => {
  return (
    <div>
      <Row type="flex no-padding" justify="start" align="middle">
        {filters.map(f => (
          <Tag className={'tag-round flex'} key={f}>
            <div style={{ maxWidth: 350, overflow: 'hidden' }}>{userRoleDisplayName(f)} </div>
            <Icon key={f} onClick={clearTag(f, type)} style={{ color: 'white' }} type="close" />
          </Tag>
        ))}
      </Row>
    </div>
  );
};

export default FilterTagContent;
