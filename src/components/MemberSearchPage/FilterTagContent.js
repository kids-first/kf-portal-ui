import React from 'react';
import { Icon, Row, Tag } from 'antd';
import { find } from 'lodash';
import { ADMIN_OPTIONS, ROLES } from 'common/constants';

const userRoleDisplayName = tagName => {
  const roleTagName = find(ROLES, { type: tagName });
  const memberOptionTagName = ADMIN_OPTIONS[tagName];
  return roleTagName
    ? roleTagName.displayName
    : memberOptionTagName
    ? memberOptionTagName
    : tagName;
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
