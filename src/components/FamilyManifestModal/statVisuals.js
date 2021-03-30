import React from 'react';
import fileStatVisualPath from 'assets/icon-files.svg';
import participantsStatIconPath from 'assets/icon-participants.svg';
import fileSizeStatVisualPath from 'assets/icon-database.svg';
import familyMembersStatVisualPath from 'assets/icon-families-grey.svg';
import style from './statVisuals.module.css';

const participantsStatVisualIcon = (
  <img
    src={participantsStatIconPath}
    alt=""
    style={{
      width: '21px',
      height: '26px',
      marginRight: '10px',
    }}
  />
);
export const participantsStatVisual = {
  icon: participantsStatVisualIcon,
  label: 'Participants',
};

const fileStatVisualIcon = (
  <img
    src={fileStatVisualPath}
    alt=""
    style={{
      width: '16px',
      height: '20px',
      marginRight: '10px',
    }}
  />
);

export const fileStatVisual = {
  icon: fileStatVisualIcon,
  label: 'Files',
};

const fileSizeStatVisualIcon = (
  <img
    src={fileSizeStatVisualPath}
    alt=""
    style={{
      width: '16px',
      height: '20px',
      marginRight: '10px',
    }}
  />
);

export const fileSizeStatVisual = {
  icon: fileSizeStatVisualIcon,
  label: 'Size',
};

const familyMembersStatVisualIcon = (
  <img
    src={familyMembersStatVisualPath}
    alt=""
    style={{
      width: '26px',
      height: '23px',
      marginRight: '10px',
    }}
  />
);
export const familyMembersStatVisual = {
  icon: familyMembersStatVisualIcon,
  label: 'Family Members',
};

const generateHeader = (data) => {
  const header = {
    title: (
      <div className={style.inlineWithIcon}>
        {data.icon && <div className={`left`}>{data.icon}</div>}
        {data.label}
      </div>
    ),
    key: data.label.toLowerCase().replace(' ', ''),
    dataIndex: data.label.toLowerCase().replace(' ', ''),
  };
  if (data.render) {
    header.render = data.render;
  }
  return header;
};

export const participantStatsHeader = [
  {
    icon: null,
    label: 'Data Types',
    // eslint-disable-next-line react/display-name
    render: (props) => (
      <div className={style.inlineWithIcon}>
        {props.showCheckbox && (
          <input type="checkbox" checked={props.isChecked} className={`left checkbox`} />
        )}
        {props.leftComponent && <div className={style.checkbox}>{props.leftComponent}</div>}
        {props.fileType}
      </div>
    ),
  },
  participantsStatVisual,
  fileStatVisual,
  fileSizeStatVisual,
].map(generateHeader);

export const familyMemberStatsHeader = [
  { icon: null, label: 'Data Types' },
  familyMembersStatVisual,
  fileStatVisual,
  fileSizeStatVisual,
].map(generateHeader);

export const participantStatsHeaderTotal = [
  participantsStatVisual,
  fileStatVisual,
  fileSizeStatVisual,
].map(generateHeader);
