import { setGen3Token } from 'services/ajax';
import ajax from 'services/ajax';
import { gen3ApiRoot } from 'common/injectGlobals';

/** getUser()
  Return object structure:
    {
      "certificates_uploaded": [],
      "email": null,
      "message": "",
      "project_access": {
        "march-demo": [
          "read-storage"
        ],
        "phs001138": [
          "read-storage"
        ],
        "phs001228": [
          "read-storage"
        ]
      },
      "resources_granted": [],
      "user_id": 58,
      "username": "RAHULVERMA"
    }

  */
export const getUser = async credentials => {
  let accessToken = await getAccessToken(credentials);
  await setGen3Token(accessToken.data.access_token);
  return await ajax.get(gen3ApiRoot + 'user/user');
};

/**
Should return access token in response payload
  {
  "access_token": "eyJhb6IkpXVCIsImtpZCI6ImtleS0wMSJ9.eyJjb250ZXh0Ijp7InVzZXIiOnsiaXNfYWRtaW4iOmZhbHNlLCJuYW1lIjoiUkFIVUxWRVJNQSIsInByb2plY3RzIjp7InBoczAwMTEzOCI6WyJyZWFkLXN0b3JhZ2UiXSwibWFyY2gtZGVtbyI6WyJyZWFkLXN0b3JhZ2UiXSwicGhzMDAxMjI4IjpbInJlYWQtc3RvcmFnZSJdfX19LCJqdGkiOiI5YTcxMzJlYi05YWJkLTQyOWQtYWJiNi1hZWEzNTQ4YTFkNzUiLCJhdWQiOlsiZGF0YSIsInVzZXIiLCJmZW5jZSIsIm9wZW5pZCJdLCJleHAiOjE1MjA1Mzg4NjQsImlzcyI6Imh0dHBzOi8vZ2VuM3FhLmtpZHMtZmlyc3QuaW8vdXNlciIsImlhdCI6MTUyMDUzNTI2NCwicHVyIjoiYWNjZXNzIiwic3ViIjoiNTgifQ.jYR_Ppm3wJ1nCgzegyb3UPQbAOFPmcXfGyUkneywcQE4B7BWJAh_N48BTmOY8-jMAF8HpberTd86IkOquYQki3T2LzXf4BgxhApUjeIke_MLD5SjkhY0gUVCbgbTPPRZDWV2ynBNivmOoHoVV15rS-Xp3b-hULTfsNERE8tmuNnAjEsb5iLahxsA3HVKRHCNyTAsWEW9nn82vmAd4F5p3y1zIvn5Ks0bb0Foigy3mN-d6T49iTzVb6BAmyxra8rGx8-Vo7LgRaNMZ6iYVzuDH1H8r3PM58PF4hFOn65IkZ4oro1YRZXIto9G9XvVjFlhw"
  }
*/

export const getAccessToken = async credentials => {
  let config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return await ajax.post(gen3ApiRoot + 'user/credentials/cdis/access_token', credentials, config);
};

export const downloadFileFromGen3 = async (credentials, fileUUID) => {
  let accessToken = await getAccessToken(credentials);
  await setGen3Token(accessToken.data.access_token);
  let signedUrl = await ajax.get(gen3ApiRoot + 'user/data/download/' + fileUUID);
  return signedUrl.data.url;
};
