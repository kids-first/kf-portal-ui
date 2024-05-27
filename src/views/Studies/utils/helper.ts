export const StudyCodeMap: { [key: string]: string } = {
  'KF-MMC': 'aml_sd_pet7q6f2_2018',
  'KF-CHDALL': 'bllnos_sd_z6mwd3h0_2018',
  'KF-OS': 'os_sd_zxjffmef_2015',
  'KF-TALL': 'tll_sd_aq9kvn5p_2019',
  CBTN: 'openpedcan_v15',
  'KF-NBL': 'openpedcan_v15',
};

export const mapStudyToPedcBioportal = (studyCode: string) => StudyCodeMap[studyCode] || '';
