import React from 'react';

export const participantsStatVisual = {
  icon: (
    <img
      src={require('../../assets/icon-participants.svg')}
      alt=""
      css={`
        width: 21px;
        height: 26px;
        margin-right: 10px;
      `}
    />
  ),
  label: 'Participants',
};

export const fileStatVisual = {
  icon: (
    <img
      src={require('../../assets/icon-files.svg')}
      alt=""
      css={`
        width: 16px;
        height: 20px;
        margin-right: 10px;
      `}
    />
  ),
  label: 'Files',
};

export const fileSizeStatVisual = {
  icon: (
    <img
      src={require('../../assets/icon-files.svg')}
      alt=""
      css={`
        width: 16px;
        height: 20px;
        margin-right: 10px;
      `}
    />
  ),
  label: 'Size',
};

export const familyMembersStatVisual = {
  icon: (
    <img
      src={require('../../assets/icon-families-grey.svg')}
      alt=""
      css={`
        width: 26px;
        height: 23px;
        margin-right: 10px;
      `}
    />
  ),
  label: 'Family Members',
};
