import React from 'react';
import participantsStatIconPath from 'assets/icon-participants.svg';
import fileStatVisualPath from 'assets/icon-files.svg';
import fileSizeStatVisualPath from 'assets/icon-database.svg';
import familyMembersStatVisualPath from 'assets/icon-families-grey.svg';

export const participantsStatVisual = {
  icon: (
    <img
      src={participantsStatIconPath}
      alt=""
      style={{
        width: '21px',
        height: '26px',
        marginRight: '10px',
      }}
    />
  ),
  label: 'Participants',
};

export const fileStatVisual = {
  icon: (
    <img
      src={fileStatVisualPath}
      alt=""
      style={{
        width: '16px',
        height: '20px',
        marginRight: '10px',
      }}
    />
  ),
  label: 'Files',
};

export const fileSizeStatVisual = {
  icon: (
    <img
      src={fileSizeStatVisualPath}
      alt=""
      style={{
        width: '16px',
        height: '20px',
        marginRight: '10px',
      }}
    />
  ),
  label: 'Size',
};

export const familyMembersStatVisual = {
  icon: (
    <img
      src={familyMembersStatVisualPath}
      alt=""
      style={{
        width: '26px',
        height: '23px',
        marginRight: '10px',
      }}
    />
  ),
  label: 'Family Members',
};
