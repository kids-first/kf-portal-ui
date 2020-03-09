import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Row, Tag } from 'antd';
import { ADMIN_OPTIONS, ROLES } from 'common/constants';

const userRoleDisplayName = tagName => {
  const roleTagName = ROLES.find(x => x.type === tagName);
  const memberOptionTagName = ADMIN_OPTIONS[tagName];

  if (roleTagName) {
    return roleTagName.displayName;
  } else if (memberOptionTagName) {
    return memberOptionTagName;
  } else {
    return tagName;
  }
};

const FilterTagContent = ({ filters, type, clearTag }) => (
    <div>
      <Row className={'no-padding'} type="flex" justify="start" align="middle">
        {filters.map(f => (
          <Tag className={'tag-round flex'} key={f}>
            <div style={{ maxWidth: 350, overflow: 'hidden' }}>{userRoleDisplayName(f)} </div>
            <CloseOutlined key={f} onClick={clearTag(f, type)} style={{ color: 'white' }} />
          </Tag>
        ))}
      </Row>
    </div>
  );

export default FilterTagContent;
