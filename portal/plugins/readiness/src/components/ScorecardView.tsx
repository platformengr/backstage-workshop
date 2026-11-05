import type { Scorecard } from '@internal/backstage-plugin-readiness-common';
import { Flex, Text } from '@backstage/ui';

/** The score and one line per check. Used by the card and the tab. */
export const ScorecardView = (props: {
  card: Scorecard;
  passScore: number;
}) => {
  const { card, passScore } = props;
  const ready = card.score >= passScore;
  return (
    <Flex direction="column" gap="2">
      <Text variant="title-small">
        {card.score}% {ready ? 'Ready' : 'Not ready'} (pass: {passScore}%)
      </Text>
      {card.checks.map(check => (
        <Text key={check.id}>
          {check.passed ? '✅' : '❌'} {check.title}
          {check.message ? `: ${check.message}` : ''}
        </Text>
      ))}
      <Text variant="body-small">
        Evaluated {new Date(card.evaluatedAt).toLocaleString()}
      </Text>
    </Flex>
  );
};
