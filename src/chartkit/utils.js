import _ from 'lodash';

export const truncateText = (string = '', length = 5) => _.truncate(string, { length: length });
