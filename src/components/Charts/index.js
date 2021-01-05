import React from 'react';

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
    <div className={'tooltip-dx-chart-container'}>
      <div className={'tooltip-dx-chart-label'}>{removeMondo(label)}</div>
      <div>{`${participants.toLocaleString()} Participant${participants !== 1 ? 's' : ''}`}</div>
    </div>
  );
};

export const studiesToolTip = (data) => {
  const { familyMembers, probands, label } = data;
  const participants = familyMembers + probands;
  return (
    <div className={'tooltip-studies-chart-container'}>
      <div className={'tooltip-studies-chart-label'}>{label}</div>
      <div>{`${probands.toLocaleString()} Proband${probands !== 1 ? 's' : ''}`}</div>
      <div>{`${familyMembers.toLocaleString()} Other Participant${
        familyMembers > 1 ? 's' : ''
      }`}</div>
      <div>{`${participants.toLocaleString()} Participant${participants !== 1 ? 's' : ''}`}</div>
    </div>
  );
};
