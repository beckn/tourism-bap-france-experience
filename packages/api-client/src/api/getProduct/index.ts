import { CustomQuery, Logger } from '@vue-storefront/core';
import { Config } from './../../types/Setup';
import * as sa from 'superagent';
// import { SearchItemsWhere } from '../../types/Search';
import { AckResponse } from '../../types/BecknClientApi';
import { Context } from '@vue-storefront/core';

/* eslint  camelcase: 0 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function getProduct(
  context: Context,
  params,
  customQuery?: CustomQuery
): Promise<AckResponse> {
  const criteriaData: { [k: string]: any } = {
    dropLocation: params.locationIs
  };
  // if (params.providerId) criteriaData.provider_id = params.providerId;
  if (params.itemContains) criteriaData.searchString = params.itemContains;
  if (params.category) criteriaData.category_name = params.category;

  const qParams = {
    context: {
      domain: 'tourism'
    },
    message: {
      criteria: criteriaData
    }
  };

  const client = context.client as sa.SuperAgent<sa.SuperAgentRequest>;
  Logger.error(qParams);
  return client
    .post(
      'https://api-node.mobilityreferencebap.becknprotocol.io/client/v2/search'
    )
    .send(qParams)
    .then((res) => {
      return res.body as AckResponse;
    })
    .catch((err) => {
      console.log(err);

      throw new Error('Error in Api');
    });

  /* return Promise.resolve({
    data: [],
    total: 0
  });*/
}
