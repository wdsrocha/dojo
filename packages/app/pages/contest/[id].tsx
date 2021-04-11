import { Card, Progress } from "antd";
import { ColumnsType } from "antd/lib/table";
import Text from "antd/lib/typography/Text";
import Title from "antd/lib/typography/Title";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useState } from "react";
import { useInterval } from "../../hooks/useInterval";
import { useTwoPassRendering } from "../../hooks/useTwoPassRendering";

dayjs.extend(duration);

interface Contest {
  title: string;
  startDate: string;
  endDate: string;
}

interface ContestResponse {
  data: Contest;
}

export const getServerSideProps: GetServerSideProps<ContestResponse> = async () => ({
  props: {
    data: {
      title: "North American Invitational Programming Contest (NAIPC) 2019",
      startDate: "2021-04-03 17:00 UTC-4",
      endDate: "2021-04-03 23:00 UTC-4",
    },
  },
});

const ContestHeader = ({
  startDate: rawStartDate,
  endDate: rawEndDate,
  title,
}: Contest) => {
  const isClient = useTwoPassRendering()

  const startDate = dayjs(rawStartDate);
  const endDate = dayjs(rawEndDate);
  const formattedStartDate = startDate.format("YYYY-MM-DD HH:mm Z UTC");
  const formattedEndDate = endDate.format("YYYY-MM-DD HH:mm Z UTC");

  const [now, setNow] = useState(dayjs());

  const getTimeDifferenceFrom = (date: dayjs.Dayjs) => {
    const timeDifference = dayjs.duration(
      date.isBefore(now) ? now.diff(date) : date.diff(now),
    );

    const hours = Math.floor(timeDifference.asHours());
    const minutes = timeDifference.format("m");
    const seconds = timeDifference.format("s");

    const formattedHours = `${hours} hora${hours !== 1 ? "s" : ""}`;
    const formattedMinutes = `${minutes} minuto${minutes !== "1" ? "s" : ""}`;
    const formattedSeconds = `${seconds} segundo${seconds !== "1" ? "s" : ""}`;

    if (timeDifference.days()) {
      return formattedHours;
    }
    if (timeDifference.hours()) {
      return `${formattedHours}, ${formattedMinutes} e ${formattedSeconds}`;
    }
    return `${formattedMinutes} e ${formattedSeconds}`;
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
      title={<Title level={1}>{title}</Title>}
    >
      <Progress percent={isClient ? percentage : 0} showInfo={false} />
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div>
          <Text strong>Início: </Text>
          {formattedStartDate}
        </div>
        <div className="order-first md:order-none">
          <Title level={5}>{isClient ? relativeTimeInfo : '...'}</Title>
        </div>
        <div>
          <Text strong>Término: </Text>
          {formattedEndDate}
        </div>
      </div>
    </Card>
  );
};

const ContestPage = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => (
  <ContestHeader {...data} />
);

export default ContestPage;
