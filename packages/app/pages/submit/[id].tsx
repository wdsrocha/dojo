import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { SubmissionForm } from "../../components/SubmissionForm";

interface ProblemType {
  onlineJudgeId: string;
  remoteProblemId: string;
  title: string;
}

interface ProblemResponse {
  data: ProblemType;
}

function isString(x: any): x is string {
  return typeof x === "string";
}

export const getServerSideProps: GetServerSideProps<ProblemResponse> = async ({
  params,
  res,
}) => {
  if (!isString(params?.id)) {
    res.statusCode = 400;
    return { props: { data: {} } };
  }

  const [onlineJudgeId, remoteProblemId] = params?.id?.split("-") ?? [];
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/problems/${onlineJudgeId}/${remoteProblemId}`,
    {
      method: "GET",
      credentials: "include",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    },
  );

  const data = await response.json();

  if (response.status === 404) {
    return {
      notFound: true,
    };
  }

  return {
    props: { data },
  };
};

const Page = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => (
  <SubmissionForm
    onlineJudgeId={data.onlineJudgeId}
    remoteProblemId={data.remoteProblemId}
    title={data.title}
  />
);

export default Page;
