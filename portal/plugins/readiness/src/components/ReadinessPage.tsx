import { Progress, ResponseErrorPanel } from '@backstage/core-components';
import { useApi } from '@backstage/frontend-plugin-api';
import type { Scorecard } from '@internal/backstage-plugin-readiness-common';
import {
  CellText,
  Container,
  Header,
  Table,
  useTable,
  type ColumnConfig,
} from '@backstage/ui';
import useAsync from 'react-use/esm/useAsync';
import { readinessApiRef } from '../api';

type Row = Scorecard & { id: string };

const columns: ColumnConfig<Row>[] = [
  {
    id: 'entityRef',
    label: 'Entity',
    isRowHeader: true,
    cell: row => <CellText title={row.entityRef} />,
  },
  {
    id: 'score',
    label: 'Score',
    cell: row => <CellText title={`${row.score}%`} />,
  },
  {
    id: 'failing',
    label: 'Failing checks',
    cell: row => (
      <CellText
        title={row.checks
          .filter(c => !c.passed)
          .map(c => c.title)
          .join(', ')}
      />
    ),
  },
];

const ScorecardTable = ({ rows }: { rows: Row[] }) => {
  const { tableProps } = useTable({
    mode: 'complete',
    data: rows,
    paginationOptions: { pageSize: rows.length || 1 },
  });
  return (
    <Table
      columnConfig={columns}
      {...tableProps}
      pagination={{ type: 'none' }}
    />
  );
};

/** Every scorecard, lowest score first. */
export const ReadinessPage = () => {
  const readinessApi = useApi(readinessApiRef);
  const { value, loading, error } = useAsync(
    () => readinessApi.listScorecards(),
    [readinessApi],
  );

  let body;
  if (loading) body = <Progress />;
  else if (error) body = <ResponseErrorPanel error={error} />;
  else
    body = (
      <ScorecardTable
        rows={(value ?? []).map(c => ({ ...c, id: c.entityRef }))}
      />
    );

  return (
    <>
      <Header title="Production readiness" />
      <Container>{body}</Container>
    </>
  );
};
