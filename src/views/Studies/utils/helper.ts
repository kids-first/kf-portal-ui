import { IFileEntity } from '../../../graphql/files/models';

const VALID_DATA_TYPES: string[] = [
  'Somatic Simple Nucleotide Variations',
  'Raw Gene Fusions',
  'Gene Expression Quantification',
  'Somatic Copy Number Variations',
];

export const StudyCodeMap: { [key: string]: string } = {
  'KF-MMC': 'aml_sd_pet7q6f2_2018',
  'KF-CHDALL': 'bllnos_sd_z6mwd3h0_2018',
  'KF-OS': 'os_sd_zxjffmef_2015',
  'KF-TALL': 'tll_sd_aq9kvn5p_2019',
  CBTN: 'openpedcan_v15',
  'KF-NBL': 'x01_fy16_nbl_maris',
};

export const mapStudyToPedcBioportal = (studyCode: string) => StudyCodeMap[studyCode] || '';

export const areFilesDataTypeValid = (files: IFileEntity[]): boolean =>
  files.some((file) => VALID_DATA_TYPES.includes(file.data_type));
