import { Config } from './../../types/Setup';
import * as sa from 'superagent';
import { AckResponse } from '../../types/BecknClientApi';
import { Context } from '@vue-storefront/core';

export default async function confirmOrder(
  context: Context,
  params: Record<string, unknown>,
  token: string
): Promise<AckResponse> {
  const config = context.config as Config;
  const client = context.client as sa.SuperAgent<sa.SuperAgentRequest>;
  return client
    .post(
      'https://api-node-dev.mobilityreferencebap.becknprotocol.io/client/v2/confirm'
    )
    .send(params)
    .then((res) => {
      return res.body as AckResponse;
    });
}
