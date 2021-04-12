import { Card, Progress, Typography } from "antd";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { useState } from "react";
import { useInterval } from "../hooks/useInterval";
import { useTwoPassRendering } from "../hooks/useTwoPassRendering";

dayjs.extend(duration);

const { Title, Text } = Typography;

const getTimeDifferenceFrom = (now: dayjs.Dayjs, target: dayjs.Dayjs) => {
  const timeDifference = dayjs.duration(
    target.isBefore(now) ? now.diff(target) : target.diff(now),
  );
  const days = timeDifference.days();

  if (days > 1) return `${days} dias`;
  if (days === 1) return `${Math.floor(timeDifference.asHours())} horas`;
  return timeDifference.format("HH:mm:ss");
};

type ContestHeaderProps = Pick<Contest, "startDate" | "endDate" | "title">;

export const ContestHeader = ({
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

  const contestStatus = (() => {
    if (now.isBefore(startDate)) return "scheduled";
    if (now.isBefore(endDate)) return "running";
    return "ended";
  })();

  const relativeTimeInfo = (() => {
    if (contestStatus === "scheduled") {
      return `Iniciará em ${getTimeDifferenceFrom(now, startDate)}`;
    }
    if (contestStatus === "running") {
      return `Tempo restante: ${getTimeDifferenceFrom(now, endDate)}`;
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
