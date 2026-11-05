import {
  InfoCard,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { useApi } from '@backstage/frontend-plugin-api';
import { useEntity } from '@backstage/plugin-catalog-react';
import { stringifyEntityRef } from '@backstage/catalog-model';
import useAsync from 'react-use/esm/useAsync';
import { readinessApiRef } from '../api';
import { ScorecardView } from './ScorecardView';

/** The card on the entity overview. */
export const ScorecardCard = (props: { passScore: number }) => {
  const { entity } = useEntity();
  const readinessApi = useApi(readinessApiRef);
  const entityRef = stringifyEntityRef(entity);
  const { value, loading, error } = useAsync(
    () => readinessApi.getScorecard(entityRef),
    [readinessApi, entityRef],
  );

  let body;
  if (loading) body = <Progress />;
  else if (error) body = <ResponseErrorPanel error={error} />;
  else if (!value) body = 'Not evaluated yet.';
  else body = <ScorecardView card={value} passScore={props.passScore} />;

  return <InfoCard title="Production readiness">{body}</InfoCard>;
};
