import { Config } from '../../types/Setup';
import * as sa from 'superagent';
import { onInitializeOrderParam } from '../../types/initializeOrder';
import { AckResponse } from '../../types/BecknClientApi';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function support(
  context: { config: Config; client: sa.SuperAgent<sa.SuperAgentRequest> },
  params: onInitializeOrderParam,
  token: string
): Promise<AckResponse> {
  const config = context.config as Config;
  const client = context.client as sa.SuperAgent<sa.SuperAgentRequest>;

  return client
    .post(config.api.url + config.api.endpoints.support)
    .send(params)
    .then((res) => {
      return res.body as AckResponse;
    });
}

export async function onSupport(
  context: { config: Config; client: sa.SuperAgent<sa.SuperAgentRequest> },
  params: onInitializeOrderParam,
  token: string
): Promise<AckResponse> {
  const config = context.config as Config;
  const client = context.client as sa.SuperAgent<sa.SuperAgentRequest>;
  return client
    .get(config.api.url + config.api.endpoints.onSupport)
    .query(params)
    .then((res) => {
      return res.body as AckResponse;
    });
}
