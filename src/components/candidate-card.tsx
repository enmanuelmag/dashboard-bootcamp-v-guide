import type { CandidateType } from '#/types/candidate';
import { Badge, Button, Flex, Paper, Title } from '@mantine/core';
import { Link } from '@tanstack/react-router';

type CandidateProps = {
  data: CandidateType;
};

const CandidateCard = (props: CandidateProps) => {
  const { data } = props;

  return (
    <Paper shadow="md" radius="md" withBorder p="xl">
      <Flex align="center" justify="space-between">
        <Title order={3}>{data.name}</Title>

        {/* BOTÓN PARA IR A LA PAGINA DE DETALLE DEL CANDIDATO */}
        <Link to="/candidates/$candidateId" params={{ candidateId: data.id }}>
          <Button variant="light" size="sm">
            Ver detalles
          </Button>
        </Link>
      </Flex>

      {/* INFO PREVIEW / INFO LIGERA DEL CANDIDATO */}
      <Badge color={statusColor(data.status)} mt={8} size="lg">
        {data.status}
      </Badge>
    </Paper>
  );

  // USAMOS FUNCTION PARA USARLA DESDE CUALQUIER LUGAR DEL COMPONENTE
  // RETORNA UN COLOR DE BADGE SEGÚN EL STATUS DEL CANDIDATO
  function statusColor(status: CandidateType['status']) {
    if (status === 'Pending') return 'yellow';
    if (status === 'Reviewing') return 'blue';
    if (status === 'Interviewing') return 'orange';
    if (status === 'Hired') return 'green';
    return 'gray';
  }
};

export default CandidateCard;
