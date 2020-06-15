import graphql from 'services/arranger';
import { initializeApi } from 'services/api';

type BsNode = {
  node: {
    external_aliquot_id: string;
    external_sample_id: string;
    kf_id: string;
  };
};

type BiospecimensEdges = Array<BsNode>;

const findBsNodeMatchingId = (bsIdOfUnknownOrigin: string, bsEgdes: BiospecimensEdges) =>
  bsEgdes.find((bsNodes: BsNode) => Object.values(bsNodes.node).includes(bsIdOfUnknownOrigin));

export const resolveBSIdToKfId = async (rawId: string) => {
  const response = await graphql(initializeApi())({
    query: `
     query ($sqon: JSON) {
      participant {
        hits(filters: $sqon) {
          total
          edges {
            node {
              kf_id
              external_id
              biospecimens {
                hits {
                  edges {
                    node {
                      external_aliquot_id
                      external_sample_id
                      kf_id
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
      `,
    variables: {
      sqon: {
        op: 'or',
        content: [
          {
            op: 'filter',
            content: {
              value: rawId,
              fields: [
                'biospecimens.external_aliquot_id',
                'biospecimens.external_sample_id',
                'biospecimens.kf_id',
              ],
            },
          },
        ],
      },
    },
  });
  //BS is associated  to one and only one participant.
  const firstEdge = (response?.data?.participant?.hits?.edges || [])[0];
  const biospecimensEdges = firstEdge?.node?.biospecimens?.hits?.edges || [];
  const match = findBsNodeMatchingId(rawId, biospecimensEdges);
  return match?.node?.kf_id;
};
