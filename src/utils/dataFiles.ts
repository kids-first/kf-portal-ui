import { FileAccessType, IFileEntity } from 'graphql/files/models';
import { intersection } from 'lodash';

const STUDIES_CONTROLLED_AS_REGISTERED_RULES = ['CBTN'];

export const userHasAccessToFile = (
  file: IFileEntity,
  userAcls: string[],
  isConnectedToCavatica: boolean = false,
  isConnectedToGen3: boolean = false,
) => {
  if (!isConnectedToGen3 && !isConnectedToCavatica) {
    return false;
  }

  const fileAccess = file;
  if (STUDIES_CONTROLLED_AS_REGISTERED_RULES.includes(fileAccess.study.study_code)) {
    fileAccess.controlled_access = FileAccessType.REGISTERED;
  }

  if (fileAccess.controlled_access === FileAccessType.CONTROLLED && !isConnectedToGen3) {
    return false;
  }

  if (fileAccess.controlled_access === FileAccessType.REGISTERED && !isConnectedToCavatica) {
    return false;
  }

  return (
    !fileAccess.acl ||
    fileAccess.acl.length === 0 ||
    intersection(userAcls, fileAccess.acl).length > 0 ||
    fileAccess.controlled_access === FileAccessType.REGISTERED
  );
};
