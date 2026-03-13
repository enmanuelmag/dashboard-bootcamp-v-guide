import TanstackQueryFlow from '#/components/demo/query-flow';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/demo/query-flow')({
  component: RouteComponent,
});

function RouteComponent() {
  return <TanstackQueryFlow />;
}
