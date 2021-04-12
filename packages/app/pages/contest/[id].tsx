import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import { Card, Progress, Tabs } from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import Text from "antd/lib/typography/Text";
import Title from "antd/lib/typography/Title";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { HTMLAttributes, useState } from "react";
import classNames from "classnames";
import { useInterval } from "../../hooks/useInterval";
import { useTwoPassRendering } from "../../hooks/useTwoPassRendering";
import { Hyperlink } from "../../components/Hyperlink";

dayjs.extend(duration);

type ProblemStatus = "not submitted" | "accepted" | "rejected";

const { TabPane } = Tabs;

interface ProblemOverview {
  id: string;
  origin: string;
  title: string;
  status: ProblemStatus;
  solvedCount: number;
  attemptedCount: number;
}

interface Contest {
  title: string;
  startDate: string;
  endDate: string;
  problems: ProblemOverview[];
}

interface ContestResponse {
  data: Contest;
}

export const getServerSideProps: GetServerSideProps<ContestResponse> = async () => ({
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

type ContestHeaderProps = Pick<Contest, "startDate" | "endDate" | "title">;

const ContestHeader = ({
  startDate: rawStartDate,
  endDate: rawEndDate,
  title,
}: ContestHeaderProps) => {
  const isClient = useTwoPassRendering();

  const startDate = dayjs(rawStartDate);
  const endDate = dayjs(rawEndDate);
  const formattedStartDate = startDate.format("YYYY-MM-DD HH:mm Z UTC");
  const formattedEndDate = endDate.format("YYYY-MM-DD HH:mm Z UTC");

  const [now, setNow] = useState(dayjs());

  const getTimeDifferenceFrom = (date: dayjs.Dayjs) => {
    const timeDifference = dayjs.duration(
      date.isBefore(now) ? now.diff(date) : date.diff(now),
    );
    const days = timeDifference.days();

    if (days > 1) {
      return `${days} dias`;
    }

    if (days === 1) {
      return `${Math.floor(timeDifference.asHours())} horas`;
    }

    return timeDifference.format("HH:mm:ss");
  };

  const contestStatus = (() => {
    if (now.isBefore(startDate)) return "scheduled";
    if (now.isBefore(endDate)) return "running";
    return "ended";
  })();

  const relativeTimeInfo = (() => {
    if (contestStatus === "scheduled") {
      return `Iniciará em ${getTimeDifferenceFrom(startDate)}`;
    }
    if (contestStatus === "running") {
      return `Tempo restante: ${getTimeDifferenceFrom(endDate)}`;
    }
    return <Text type="success">Acabou</Text>;
  })();

  const percentage = (() => {
    if (contestStatus === "scheduled") return 0;
    if (contestStatus === "ended") return 100;
    return +(100 * (now.diff(startDate) / endDate.diff(startDate))).toFixed(2);
  })();

  useInterval(() => setNow(dayjs()), contestStatus !== "ended" ? 1000 : null);

  return (
    <Card
      className="card"
      bodyStyle={{ paddingTop: 16 }}
      title={<Title level={1}>{title}</Title>}
    >
      <Progress
        percent={isClient ? percentage : 0}
        status={contestStatus === "running" ? "active" : undefined}
        showInfo={false}
      />
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div>
          <Text strong>Início: </Text>
          {formattedStartDate}
        </div>
        <div className="order-first md:order-none">
          <Title level={5}>{isClient ? relativeTimeInfo : "..."}</Title>
        </div>
        <div>
          <Text strong>Término: </Text>
          {formattedEndDate}
        </div>
      </div>
    </Card>
  );
};

interface ContestProblemsProps {
  problems: ProblemOverview[];
}

const renderStatus = (status: ProblemStatus) => {
  if (status === "accepted") {
    return <CheckCircleFilled style={{ fontSize: 20, color: "green" }} />;
  }
  if (status === "rejected") {
    return <CloseCircleFilled style={{ fontSize: 20, color: "red" }} />;
  }
  return null;
};

const ContestProblems = ({ problems }: ContestProblemsProps) => {
  const columns: ColumnsType<ProblemOverview> = [
    {
      title: "#",
      dataIndex: "id",
      render: (_, { id }) => (
        <Hyperlink href="/" strong>
          {id}
        </Hyperlink>
      ),
      width: 50,
      align: "center",
    },
    {
      title: "Origem",
      dataIndex: "origin",
      render: (_, { origin }) => <Hyperlink href="/">{origin}</Hyperlink>,
      responsive: ["sm"],
      width: 200,
    },
    {
      title: "Título",
      dataIndex: "title",
      render: (_, { title, status }) => (
        <div className="flex items-center justify-between">
          <Hyperlink href="/">{title}</Hyperlink>
          <Hyperlink href="/">{renderStatus(status)}</Hyperlink>
        </div>
      ),
      width: 600,
    },
    {
      title: "Resolvidos / tentados",
      render: (_, { solvedCount, attemptedCount }) => {
        const solvedProportion = attemptedCount
          ? (100 * (solvedCount / attemptedCount)).toFixed(0)
          : 0;
        return (
          <Hyperlink href="/">
            {`${solvedCount} / ${attemptedCount} (${solvedProportion}%)`}
          </Hyperlink>
        );
      },
      responsive: ["sm"],
      width: 175,
    },
  ];

  return (
    <Table<ProblemOverview>
      bordered
      rowKey={(record) => record.id}
      columns={columns}
      dataSource={problems}
      pagination={{ hideOnSinglePage: true, defaultPageSize: 26 }}
    />
  );
};

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
