import { Card, Progress, Typography } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { useInterval } from "../hooks/useInterval";
import { useTwoPassRendering } from "../hooks/useTwoPassRendering";

const getTimeDifferenceFrom = (now: dayjs.Dayjs, target: dayjs.Dayjs) => {
  const timeDifference = dayjs.duration(
    target.isBefore(now) ? now.diff(target) : target.diff(now)
  );
  const days = timeDifference.days();

  if (days > 1) return `${days} dias`;
  if (days === 1) return `${Math.floor(timeDifference.asHours())} horas`;

  // Why the fuck the following does not work??????
  // return timeDifference.format("HH:mm:ss");
  // Workaround ahead.

  const hours = timeDifference.hours().toFixed(2);
  const minutes = timeDifference.minutes().toFixed(2);
  const seconds = timeDifference.seconds().toFixed(2);

  return `${hours}:${minutes}:${seconds}`;
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
    if (!isClient) {
      return <span>...</span>;
    }
    if (contestStatus === "scheduled") {
      const timeToStart = getTimeDifferenceFrom(now, startDate);
      return <span className="font-bold">{`Iniciará em ${timeToStart}`}</span>;
    }
    if (contestStatus === "running") {
      const remainingTime = getTimeDifferenceFrom(now, endDate);
      return (
        <span className="font-bold">{`Tempo restante: ${remainingTime}`}</span>
      );
    }
    return <span className="text-green-700 font-bold">Acabou</span>;
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
      title={<h1 className="text-4xl whitespace-pre-wrap">{title}</h1>}
    >
      <Progress
        percent={isClient ? percentage : 0}
        status={contestStatus === "running" ? "active" : undefined}
        showInfo={false}
      />
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div>
          <span className="font-bold">Início: </span>
          {formattedStartDate}
        </div>
        <div className="order-first md:order-none text-base">
          {relativeTimeInfo}
        </div>
        <div>
          <span className="font-bold">Término: </span>
          {formattedEndDate}
        </div>
      </div>
    </Card>
  );
};
