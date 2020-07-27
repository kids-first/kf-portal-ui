import { familyMemberAndParticipantIds } from '../participants';
import { fetchPtIdsFromSaveSets } from '../sets';
import {
  buildSqonFromFileRepoForReport,
  RP_FAM_CLINICAL_DATA_FILE_REPO_KEY,
  RP_PARTICIPANT_FILE_REPO_KEY,
} from '../report';
import uniq from 'lodash/uniq';

jest.mock('../participants');
jest.mock('../sets');

describe('Reshape sqon from file repo when asking for a report', () => {
  beforeEach(() => {
    (familyMemberAndParticipantIds as jest.Mock).mockReset();
    (fetchPtIdsFromSaveSets as jest.Mock).mockReset();
  });

  describe('Participants-only and Biospecimen reports', () => {
    it('should return correct sqon shape when sqon is an uploaded list', async () => {
      (fetchPtIdsFromSaveSets as jest.Mock).mockImplementation(() =>
        Promise.resolve(['PT_1', 'PT_2']),
      );
      const sqonFromFileRepoWithUploadedList = {
        op: 'and',
        content: [
          {
            op: 'in',
            content: {
              field: 'participants.kf_id',
              value: 'set_id:8df9c858-c1ca-45da-a3cf-2ac07b318911',
            },
          },
        ],
      };

      const reshapeSqon = await buildSqonFromFileRepoForReport(
        RP_PARTICIPANT_FILE_REPO_KEY,
        sqonFromFileRepoWithUploadedList,
      );

      expect(reshapeSqon).toEqual({
        op: 'and',
        content: [
          {
            op: 'in',
            content: {
              field: 'kf_id',
              value: ['PT_1', 'PT_2'],
            },
          },
        ],
      });
    });

    it('should return correct sqon shape when sqon is mixed (save set and others)', async () => {
      (fetchPtIdsFromSaveSets as jest.Mock).mockImplementation(() =>
        Promise.resolve(['PT_1', 'PT_2']),
      );
      const sqonFromFileRepoWithUploadedList = {
        op: 'and',
        content: [
          {
            op: 'in',
            content: {
              field: 'participants.diagnoses.diagnosis_category',
              value: ['Structural Birth Defect'],
            },
          },
          {
            op: 'in',
            content: {
              field: 'participants.kf_id',
              value: 'set_id:28b621a0-5081-488e-8069-386e813fb969',
            },
          },
        ],
      };

      const reshapeSqon = await buildSqonFromFileRepoForReport(
        RP_PARTICIPANT_FILE_REPO_KEY,
        sqonFromFileRepoWithUploadedList,
      );

      expect(reshapeSqon).toEqual({
        op: 'and',
        content: [
          {
            op: 'in',
            content: { field: 'diagnoses.diagnosis_category', value: ['Structural Birth Defect'] },
          },
          { op: 'in', content: { field: 'kf_id', value: ['PT_1', 'PT_2'] } },
        ],
      });
    });

    it('should return correct sqon shape when files are selected', async () => {
      const sqonFromFileRepoWithUploadedList = {
        op: 'and',
        content: [
          {
            op: 'in',
            content: {
              field: 'kf_id',
              value: [
                'GF_JN3Q982A',
                'GF_N9VPDWCA',
                'GF_0VW958WB',
                'GF_RX9CTXKZ',
                'GF_K32E4AZC',
                'GF_71FBXWYA',
              ],
            },
          },
        ],
      };

      const reshapeSqon = await buildSqonFromFileRepoForReport(
        RP_PARTICIPANT_FILE_REPO_KEY,
        sqonFromFileRepoWithUploadedList,
      );

      expect(reshapeSqon).toEqual({
        op: 'and',
        content: [
          {
            op: 'in',
            content: {
              field: 'files.kf_id',
              value: [
                'GF_JN3Q982A',
                'GF_N9VPDWCA',
                'GF_0VW958WB',
                'GF_RX9CTXKZ',
                'GF_K32E4AZC',
                'GF_71FBXWYA',
              ],
            },
          },
        ],
      });
    });
  });

  describe('Family member sqon Report', () => {
    it('should return correct sqon shape when sqon is mixed', async () => {
      const getParticipantsIds = () => ['PT_1', 'PT_2'];
      const getFamilyMembersIds = () => ['PT_X1', 'PT_Y2'];

      (familyMemberAndParticipantIds as jest.Mock).mockImplementation(() =>
        Promise.resolve({
          getParticipantsIds,
          getFamilyMembersIds,
        }),
      );

      (fetchPtIdsFromSaveSets as jest.Mock).mockImplementation(() =>
        Promise.resolve(['PT_1', 'PT_2']),
      );
      const sqonFromFileRepo = {
        op: 'and',
        content: [
          {
            op: 'in',
            content: {
              field: 'participants.biospecimens.source_text_tissue_type',
              value: ['Normal'],
            },
          },
          {
            op: 'in',
            content: {
              field: 'participants.family.family_compositions.composition',
              value: ['trio'],
            },
          },
          { op: 'in', content: { field: 'participants.gender', value: ['Female'] } },
          {
            op: 'in',
            content: {
              field: 'participants.kf_id',
              value: 'set_id:d129a673-df59-4f4c-8baf-3c295013c346',
            },
          },
          { op: 'in', content: { field: 'participants.race', value: ['Reported Unknown'] } },
        ],
      };

      const reshapeSqon = await buildSqonFromFileRepoForReport(
        RP_FAM_CLINICAL_DATA_FILE_REPO_KEY,
        sqonFromFileRepo,
      );

      expect(reshapeSqon).toEqual({
        op: 'in',
        content: {
          field: 'kf_id',
          value: uniq([...getFamilyMembersIds(), ...getParticipantsIds()]),
        },
      });
    });

    it('should return correct sqon shape when files are selected', async () => {
      const getParticipantsIds = () => ['PT_X1', 'PT_X2'];
      const getFamilyMembersIds = () => ['PT_X1', 'PT_Y2'];

      (familyMemberAndParticipantIds as jest.Mock).mockImplementation(() =>
        Promise.resolve({
          getParticipantsIds,
          getFamilyMembersIds,
        }),
      );
      const sqonFromFileRepo = {
        op: 'and',
        content: [
          {
            op: 'in',
            content: {
              field: 'kf_id',
              value: ['FILE_1', 'FILE_2'],
            },
          },
        ],
      };

      const reshapeSqon = await buildSqonFromFileRepoForReport(
        RP_FAM_CLINICAL_DATA_FILE_REPO_KEY,
        sqonFromFileRepo,
      );

      expect(reshapeSqon).toEqual({
        op: 'in',
        content: {
          field: 'kf_id',
          value: uniq([...getFamilyMembersIds(), ...getParticipantsIds()]),
        },
      });
    });
  });
});
