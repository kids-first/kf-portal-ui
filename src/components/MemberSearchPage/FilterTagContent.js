import React from 'react';
import { Divider, Icon, Row, Tag } from 'antd';
import { find } from 'lodash';
import { ROLES } from 'common/constants';

const userRoleDisplayName = userRole => {
  const role = find(ROLES, { type: userRole });
  return role ? role.displayName : userRole;
};

const FilterTagContent = ({ filters, title, type, clearTag }) => {
  return (
    <div>
      <Row style={{ textTransform: 'uppercase', fontWeight: 'bold', paddingTop: 8 }}>{title}</Row>
      <Divider style={{ marginBottom: 16, marginTop: 10 }} />
      <Row type="flex" justify="start" align="middle" style={{ paddingBottom: 10 }}>
        {filters.map(f => (
          <Tag key={f} style={{ maxWidth: 300 }}>
            {userRoleDisplayName(f)}{' '}
            <Icon key={f} onClick={clearTag(f, type)} style={{ color: 'white' }} type="close" />
          </Tag>
        ))}
      </Row>
    </div>
  );
};

export default FilterTagContent;
