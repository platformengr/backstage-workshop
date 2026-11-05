import { Progress, ResponseErrorPanel } from '@backstage/core-components';
import { useApi } from '@backstage/frontend-plugin-api';
import { useEntity } from '@backstage/plugin-catalog-react';
import { usePermission } from '@backstage/plugin-permission-react';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { Button, Container, Flex } from '@backstage/ui';
import { readinessEvaluatePermission } from '@internal/backstage-plugin-readiness-common';
import useAsyncFn from 'react-use/esm/useAsyncFn';
import { useEffect } from 'react';
import { readinessApiRef } from '../api';
import { ScorecardView } from './ScorecardView';

/** The Readiness tab: the scorecard, and a button to evaluate now. */
export const ReadinessContent = () => {
  const { entity } = useEntity();
  const readinessApi = useApi(readinessApiRef);
  const entityRef = stringifyEntityRef(entity);
  const { allowed } = usePermission({
    permission: readinessEvaluatePermission,
  });

  const [load, fetchCard] = useAsyncFn(
    () => readinessApi.getScorecard(entityRef),
    [readinessApi, entityRef],
  );
  const [run, evaluate] = useAsyncFn(async () => {
    await readinessApi.evaluate(entityRef);
    await fetchCard();
  }, [readinessApi, entityRef, fetchCard]);

  useEffect(() => {
    fetchCard();
  }, [fetchCard]);

  const error = load.error ?? run.error;
  return (
    <Container>
      <Flex direction="column" gap="4">
        {error && <ResponseErrorPanel error={error} />}
        {load.loading && <Progress />}
        {load.value && <ScorecardView card={load.value} passScore={75} />}
        <Button isDisabled={!allowed || run.loading} onPress={() => evaluate()}>
          Evaluate now
        </Button>
      </Flex>
    </Container>
  );
};
