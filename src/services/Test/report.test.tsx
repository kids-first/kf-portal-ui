import { familyMemberAndParticipantIds } from '../participants';
import {
  buildSqonFromFileRepoForReport,
  RP_BIOSPECIMEN_FILE_REPO_DATA_KEY,
  RP_FAM_CLINICAL_DATA_FILE_REPO_KEY,
  RP_PARTICIPANT_FILE_REPO_KEY,
} from '../report';
import uniq from 'lodash/uniq';

jest.mock('../participants');

describe('Reshape sqon from file repo (buildSqonFromFileRepoForReport)', () => {
  beforeEach(() => {
    (familyMemberAndParticipantIds as jest.Mock).mockReset();
  });

  it('should return correct sqon shape when calling for participant report (FileRepo)', async () => {
    (familyMemberAndParticipantIds as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        getParticipantsIds: () => ['PT1', 'PT2'],
      }),
    );
    const sqonFromFileRepo = {
      op: 'and',
      content: [{ op: 'in', content: { field: 'kf_id', value: ['FILE_ID_1', 'FILE_ID_2'] } }],
    };
    const reshapeSqon = await buildSqonFromFileRepoForReport(
      RP_PARTICIPANT_FILE_REPO_KEY,
      sqonFromFileRepo,
    );

    expect(reshapeSqon).toEqual({
      op: 'in',
      content: {
        field: 'kf_id',
        value: ['PT1', 'PT2'],
      },
    });
  });

  it('should return correct sqon shape when calling for biospecimen report (FileRepo) with no sqon', async () => {
    const sqonFromFileRepo = undefined;
    const reshapeSqon = await buildSqonFromFileRepoForReport(
      RP_BIOSPECIMEN_FILE_REPO_DATA_KEY,
      sqonFromFileRepo,
    );

    expect(reshapeSqon).toEqual({
      op: 'and',
      content: [],
    });
  });

  it('should return correct sqon shape when calling for biospecimen report (FileRepo)', async () => {
    const sqonFromFileRepo = {
      op: 'and',
      content: [{ op: 'in', content: { field: 'kf_id', value: ['FILE_ID_1'] } }],
    };
    const reshapeSqon = await buildSqonFromFileRepoForReport(
      RP_BIOSPECIMEN_FILE_REPO_DATA_KEY,
      sqonFromFileRepo,
    );

    expect(reshapeSqon).toEqual({
      op: 'and',
      content: [{ op: 'in', content: { field: 'files.kf_id', value: ['FILE_ID_1'] } }],
    });
  });

  it('should return correct sqon shape when calling for family report (FileRepo)', async () => {
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
