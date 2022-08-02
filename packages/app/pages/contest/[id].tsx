import { Card, Tabs } from "antd";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { HTMLAttributes } from "react";
import classNames from "classnames";
import { ContestHeader } from "../../components/ContestHeader";
import { ContestProblems } from "../../components/ContestProblems";

const { TabPane } = Tabs;

interface ContestResponse {
  data: Contest;
}

export const getServerSideProps: GetServerSideProps<
  ContestResponse
> = async () => ({
  props: {
    data: {
      title: "III Maratona de Programação do Norte",
      startDate: "2021-04-11 20:00 UTC-4",
      endDate: "2021-04-12 00:00 UTC-4",
      problems: [
        {
          id: "A",
          origin: "URI",
          title: "Quanta Mandioca?",
          status: "accepted",
          solvedCount: 12,
          attemptedCount: 15,
        },
        {
          id: "B",
          origin: "URI",
          title: "Cobra Norato",
          status: "rejected",
          solvedCount: 0,
          attemptedCount: 7,
        },
        {
          id: "C",
          origin: "URI",
          title: "Jaçanã",
          status: "not submitted",
          solvedCount: 2,
          attemptedCount: 2,
        },
        {
          id: "D",
          origin: "URI",
          title: "Casais",
          status: "not submitted",
          solvedCount: 0,
          attemptedCount: 0,
        },
        {
          id: "E",
          origin: "URI",
          title:
            "Máquina do Tempo Quebrada e o Retorno da Emergência em Manaus",
          status: "accepted",
          solvedCount: 14,
          attemptedCount: 20,
        },
        {
          id: "F",
          origin: "URI",
          title: "Dabriel e a Divisibilidade",
          status: "accepted",
          solvedCount: 3,
          attemptedCount: 3,
        },
        {
          id: "G",
          origin: "URI",
          title: "Fibra Ótica",
          status: "not submitted",
          solvedCount: 0,
          attemptedCount: 0,
        },
        {
          id: "H",
          origin: "URI",
          title: "Mistura de Bits",
          status: "not submitted",
          solvedCount: 0,
          attemptedCount: 0,
        },
        {
          id: "I",
          origin: "URI",
          title: "Smider Pan",
          status: "not submitted",
          solvedCount: 0,
          attemptedCount: 0,
        },
        {
          id: "J",
          origin: "URI",
          title: "Emergência em Manaus",
          status: "not submitted",
          solvedCount: 0,
          attemptedCount: 0,
        },
        {
          id: "K",
          origin: "URI",
          title: "Monitor",
          status: "not submitted",
          solvedCount: 0,
          attemptedCount: 0,
        },
        {
          id: "L",
          origin: "URI",
          title: "Gabarito",
          status: "not submitted",
          solvedCount: 0,
          attemptedCount: 0,
        },
        {
          id: "M",
          origin: "URI",
          title: "Plantação de Açaí",
          status: "not submitted",
          solvedCount: 0,
          attemptedCount: 0,
        },
      ],
    },
  },
});

type ContestBodyProps = Pick<Contest, "problems"> &
  HTMLAttributes<HTMLDivElement>;

const ContestBody = ({ problems, className }: ContestBodyProps) => (
  <Card bodyStyle={{ paddingTop: 0 }} className={classNames("card", className)}>
    <Tabs size="large" defaultActiveKey="overview">
      <TabPane key="problems" tab="Problemas">
        <ContestProblems problems={problems} />
      </TabPane>
      <TabPane key="status" tab="Submissões">
        Submissões
      </TabPane>
      <TabPane key="rank" tab="Rank">
        Rank
      </TabPane>
    </Tabs>
  </Card>
);

const ContestPage = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => (
  <>
    <ContestHeader {...data} />
    <ContestBody className="mt-3" problems={data.problems} />
  </>
);

export default ContestPage;
