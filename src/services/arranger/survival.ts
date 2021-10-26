import flatten from 'lodash/flatten';
import get from 'lodash/get';

import { arrangerApiRoot, arrangerProjectId } from 'common/injectGlobals';
import { ApiFunction } from 'store/apiTypes';
import { Sqon } from 'store/sqon';

type Donor = {
  time: number;
  censored: boolean;
  meta: { id: string };
};

type Group = {
  start: number;
  end: number;
  died: number;
  censored: number;
  cumulativeSurvival: number;
  donors: Donor[];
};

export const fetchSurvivalData = (api: ApiFunction) => async (sqon: Sqon) => {
  const body = { project: arrangerProjectId, sqon };

  const result = await api({
    method: 'POST',
    url: `${arrangerApiRoot}survival`,
    body,
  });

  const donors = flatten(
    result.data.map((group: Group) =>
      group.donors.map((donor) => ({
        id: get(donor, 'meta.id', ''),
        time: donor.time,
        survivalEstimate: group.cumulativeSurvival,
        censored: donor.censored,
      })),
    ),
  );
  return { donors };
};
