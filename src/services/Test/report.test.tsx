import { familyMemberAndParticipantIds } from '../participants';
import {
  shapeSqonForBiospecimenRp,
  shapeSqonForFamilyRp,
  shapeSqonForParticipantRp,
} from '../report';
import uniq from 'lodash/uniq';

jest.mock('../participants');

describe('Reshape sqon from file repo when asking for a report', () => {
  beforeEach(() => {
    (familyMemberAndParticipantIds as jest.Mock).mockReset();
  });

  describe('Participant only report', () => {
    it('should return correct sqon shape', async () => {
      (familyMemberAndParticipantIds as jest.Mock).mockImplementation(() =>
        Promise.resolve({
          getParticipantsIds: () => ['PT1', 'PT2'],
        }),
      );
      const sqonFromFileRepo = {
        op: 'and',
        content: [{ op: 'in', content: { field: 'kf_id', value: ['FILE_ID_1', 'FILE_ID_2'] } }],
      };
      const reshapeSqon = await shapeSqonForParticipantRp(sqonFromFileRepo);

      expect(reshapeSqon).toEqual({
        op: 'in',
        content: {
          field: 'kf_id',
          value: ['PT1', 'PT2'],
        },
      });
    });
  });

  describe('Biospecimen report', () => {
    it('should return correct sqon shape when no sqon is provided', () => {
      const sqonFromFileRepo = undefined;
      const reshapeSqon = shapeSqonForBiospecimenRp(sqonFromFileRepo);

      expect(reshapeSqon).toEqual({
        op: 'and',
        content: [],
      });
    });

    it('should return correct sqon shape', () => {
      const sqonFromFileRepo = {
        op: 'and',
        content: [{ op: 'in', content: { field: 'kf_id', value: ['FILE_ID_1'] } }],
      };
      const reshapeSqon = shapeSqonForBiospecimenRp(sqonFromFileRepo);

      expect(reshapeSqon).toEqual({
        op: 'and',
        content: [{ op: 'in', content: { field: 'files.kf_id', value: ['FILE_ID_1'] } }],
      });
    });
  });

  describe('Family Member report', () => {
    it('should return correct sqon shape', async () => {
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
        content: [{ op: 'in', content: { field: 'kf_id', value: ['FILE_ID_1', 'FILE_ID_2'] } }],
      };
      const reshapeSqon = await shapeSqonForFamilyRp(sqonFromFileRepo);

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
