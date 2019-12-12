import * as React from 'react';
import PropTypes from 'prop-types';

import Column from 'uikit/Column';
import Chip from 'uikit/Chip';
import Row from 'uikit/Row';
import CircleIcon from 'uikit/CircleIcon';
import FileIcon from 'icons/FileIcon';
import participantSvg from 'icons/ParticipantIcon';

import './EntityPage.css';

const entityIcon = type => {
  switch (type) {
    case 'file':
      return <CircleIcon color="#009cbb" size={60} Icon={FileIcon} iconSize="22px" />;
    case 'participant':
      return <CircleIcon color="#ed2b9e" size={60} Icon={participantSvg} />;
    default:
      return null;
  }
};

const EntityTitle = ({ icon, title, tags = [] }) => (
  <Row>
    {entityIcon(icon)}
    <Column style={{ justifyContent: 'center' }}>
      <h1 className="entityTitle">{title}</h1>
    </Column>
    {tags ? tags.map((tag, i) => <Chip key={`${i}${tag}`}>{tag}</Chip>) : null}
  </Row>
);

EntityTitle.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.string,
  tags: PropTypes.array,
};

export default EntityTitle;
