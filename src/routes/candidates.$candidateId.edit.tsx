import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/candidates/$candidateId/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/candidates/$candidateId/edit"!</div>
}
