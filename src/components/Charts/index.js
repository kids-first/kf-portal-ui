import React from 'react';

import 'ui/Tooltips/tooltips.scss';

export { default as MostFrequentDiagnosesChart } from './MostFrequentDiagnosesChart';
export { default as MemberResearchInterestsChart } from './MemberResearchInterestsChart';
export { default as MostParticipantsStudiesChart } from './MostParticipantsStudiesChart';

export const removeMondo = (value) => {
  const indexOfMondo = value.indexOf('(MONDO');
  return indexOfMondo > -1 ? value.substr(0, indexOfMondo) : value;
};

export const mostFrequentDiagnosisTooltip = (data) => {
  const { familyMembers, probands, label } = data;
  const participants = familyMembers + probands;
  return (
    <div className={'tp-diagnosis-container'}>
      <div>{removeMondo(label)}</div>
      <div>{`${participants.toLocaleString()} Participant${participants !== 1 ? 's' : ''}`}</div>
    </div>
  );
};

export const studiesToolTip = (data) => {
  const { familyMembers, probands, label } = data;
  const participants = familyMembers + probands;
  return (
    <div className={'tp-studies-container'}>
      <div>{label}</div>
      <div>{`${probands.toLocaleString()} Proband${probands !== 1 ? 's' : ''}`}</div>
      <div>{`${familyMembers.toLocaleString()} Other Participant${
        familyMembers > 1 ? 's' : ''
      }`}</div>
      <div>{`${participants.toLocaleString()} Participant${participants !== 1 ? 's' : ''}`}</div>
    </div>
  );
};
