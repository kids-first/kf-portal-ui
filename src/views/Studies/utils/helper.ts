export const StudyCodeMap: { [key: string]: string } = {
  'KF-NBL': 'x01_fy16_nbl_maris',
  'KF-CHDALL': 'aml_sd_z6mwd3h0_2018',
  'KF-MMC': 'aml_sd_pet7q6f2_2018',
  'KF-OS': 'os_sd_zxjffmef_2015',
  CBTN: 'openpedcan_v15',
};

export const mapStudyToPedcBioportal = (studyCode: string) => StudyCodeMap[studyCode] || '';
