import { FileAccessType, IFileEntity } from 'graphql/files/models';
import { intersection } from 'lodash';

export const userHasAccessToFile = (
  file: IFileEntity,
  userAcls: string[],
  isConnectedToCavatica: boolean = false,
  isConnectedToGen3: boolean = false,
) => {
  console.log('File: ', file);
  console.log('Is Connected To GEN3: ', isConnectedToGen3);
  console.log('Is Connected To Cavatica: ', isConnectedToCavatica);

  if (!isConnectedToGen3 && !isConnectedToCavatica) {
    return false;
  }

  console.log('Is Controlled Access: ', file.controlled_access === FileAccessType.CONTROLLED);

  if (file.controlled_access === FileAccessType.CONTROLLED && !isConnectedToGen3) {
    return false;
  }

  console.log('Is Registered Access: ', file.controlled_access === FileAccessType.REGISTERED);

  if (file.controlled_access === FileAccessType.REGISTERED && !isConnectedToCavatica) {
    return false;
  }

  console.log('File ACLs: ', file.acl);
  console.log('User ACLs: ', userAcls);

  console.log('Intersection of ACLs: ', intersection(userAcls, file.acl));

  console.log(
    'Has access: ',
    !file.acl ||
      file.acl.length === 0 ||
      intersection(userAcls, file.acl).length > 0 ||
      file.controlled_access === FileAccessType.REGISTERED,
  );

  return (
    !file.acl ||
    file.acl.length === 0 ||
    intersection(userAcls, file.acl).length > 0 ||
    file.controlled_access === FileAccessType.REGISTERED
  );
};
