export const launchCluster = async (api: Function) => {
  let response;
  const url = 'https://kf-api-variant-cluster-qa.kidsfirstdrc.org/stack';

  try {
    response = await api({
      method: 'POST',
      url: url,
      headers: {
        Authorization:
          'Bearer eyJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE1ODg1OTYzODEsImV4cCI6MTU4ODY4Mjc4MSwic3ViIjoiYWRkNzQxMDItMjRmOS00YTZjLThjYzEtZWRlMTM5NGQ3MGJmIiwiaXNzIjoiZWdvIiwiYXVkIjpbXSwianRpIjoiNmUyYjE4MzEtOTdlMi00MTI0LWE0MGItYTVkMjFhNDg3MDE2IiwiY29udGV4dCI6eyJ1c2VyIjp7Im5hbWUiOiJhZHJpYW5wYXVsY2h1QGdtYWlsLmNvbSIsImVtYWlsIjoiYWRyaWFucGF1bGNodUBnbWFpbC5jb20iLCJzdGF0dXMiOiJBcHByb3ZlZCIsImZpcnN0TmFtZSI6IkFkcmlhbiIsImxhc3ROYW1lIjoiUGF1bCIsImNyZWF0ZWRBdCI6IjIwMTktMTItMDYgMDg6MTg6MTUiLCJsYXN0TG9naW4iOiIyMDIwLTA1LTA0IDEyOjQ2OjIxIiwicHJlZmVycmVkTGFuZ3VhZ2UiOm51bGwsInJvbGVzIjpbIkFETUlOIl0sImdyb3VwcyI6W10sInBlcm1pc3Npb25zIjpbXX19fQ.dWcmQRe2Fw95k7FMxjSOaPO29_wot6f8Olvm53PpXTFTtQ3VyzlbUHgQCX6-ZAmsppPQ1vJQz7ucFcQDFkNofbjyyyouqNZyO5URHes2LnzNj8pq1C8RwusstLSvToSprujQkiHFEFLMHyAAJdGZz11rzWVHQb8ZlDvqPcwArCX_f8oh9-K_TQKnkHsME16Bld4opm3WQR7sTe23-pgOc_dFn4mFEgzx2VFw2q4yDoXXmN89MXo7a3chXLvqsvAnz9wb9iKjhAPTHxOW9NMjqSjurYak16031BKkkELhju5jxGkh-YxsiPBp6VBPYSkdKiOitOxQK1JWqQz-TgBJaQ',
      },
    });
  } catch (err) {
    throw new Error(err);
  }
  return response;
};

export const getStatus = async (api: Function) => {
  let response;
  const url = 'https://kf-api-variant-cluster-qa.kidsfirstdrc.org/stack';
  try {
    response = await api({
      method: 'GET',
      url: url,
      headers: {
        Authorization:
          'Bearer eyJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE1ODg1OTYzODEsImV4cCI6MTU4ODY4Mjc4MSwic3ViIjoiYWRkNzQxMDItMjRmOS00YTZjLThjYzEtZWRlMTM5NGQ3MGJmIiwiaXNzIjoiZWdvIiwiYXVkIjpbXSwianRpIjoiNmUyYjE4MzEtOTdlMi00MTI0LWE0MGItYTVkMjFhNDg3MDE2IiwiY29udGV4dCI6eyJ1c2VyIjp7Im5hbWUiOiJhZHJpYW5wYXVsY2h1QGdtYWlsLmNvbSIsImVtYWlsIjoiYWRyaWFucGF1bGNodUBnbWFpbC5jb20iLCJzdGF0dXMiOiJBcHByb3ZlZCIsImZpcnN0TmFtZSI6IkFkcmlhbiIsImxhc3ROYW1lIjoiUGF1bCIsImNyZWF0ZWRBdCI6IjIwMTktMTItMDYgMDg6MTg6MTUiLCJsYXN0TG9naW4iOiIyMDIwLTA1LTA0IDEyOjQ2OjIxIiwicHJlZmVycmVkTGFuZ3VhZ2UiOm51bGwsInJvbGVzIjpbIkFETUlOIl0sImdyb3VwcyI6W10sInBlcm1pc3Npb25zIjpbXX19fQ.dWcmQRe2Fw95k7FMxjSOaPO29_wot6f8Olvm53PpXTFTtQ3VyzlbUHgQCX6-ZAmsppPQ1vJQz7ucFcQDFkNofbjyyyouqNZyO5URHes2LnzNj8pq1C8RwusstLSvToSprujQkiHFEFLMHyAAJdGZz11rzWVHQb8ZlDvqPcwArCX_f8oh9-K_TQKnkHsME16Bld4opm3WQR7sTe23-pgOc_dFn4mFEgzx2VFw2q4yDoXXmN89MXo7a3chXLvqsvAnz9wb9iKjhAPTHxOW9NMjqSjurYak16031BKkkELhju5jxGkh-YxsiPBp6VBPYSkdKiOitOxQK1JWqQz-TgBJaQ',
      },
    });
  } catch (err) {
    throw new Error(err);
  }
  return response;
};
