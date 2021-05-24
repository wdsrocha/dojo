import { Verdict } from "../../../submissions/submissions.entity";

interface OnlineJudgeInfo {
  name: string
  languages: {
    [key: string]: string;
  }
  verdicts: {
    [key: string]: Verdict
  }
}

export const info: OnlineJudgeInfo = {
  name: 'URI',
  languages: {
    'C (gcc 4.8.5, -O2 -lm) [+0s]': '1',
    'C# (mono 5.10.1.20) [+2s]': '7',
    'C++ (g++ 4.8.5, -std=c++11 -O2 -lm) [+0s]': '2',
    'C++17 (g++ 7.3.0, -std=c++17 -O2 -lm) [+0s]': '16',
    'C99 (gcc 4.8.5, -std=c99 -O2 -lm) [+0s]': '14',
    'Dart (dart 2.9) [+2s]': '22',
    'Go (go 1.8.1) [+2s]': '12',
    'Haskell (ghc 7.6.3) [+5s]': '17',
    'Java (OpenJDK 1.7.0) [+2s]': '3',
    'Java 14 (OpenJDK 1.14.0) [+2s]': '21',
    'Java 8 (OpenJDK 1.8.0) [+2s]': '11',
    'JavaScript (nodejs 8.4.0) [+2s]': '10',
    'Kotlin (1.2.10) [+2s]': '15',
    'Lua (lua 5.2.3) [+1s]': '9',
    'OCaml (ocamlc 4.01.0) [+1s]': '18',
    'Pascal (fpc 2.6.2) [+0s]': '19',
    'PHP (7.4.3) [+1s]': '24',
    'Python (Python 2.7.6) [+1s]': '4',
    'Python 3 (Python 3.4.3) [+1s]': '5',
    'Python 3.8 (Python 3.8.2) [+1s]': '20',
    'R (Rscript 4.0.2) [+2s]': '23',
    'Ruby (ruby 2.3.0) [+5s]': '6',
    'Scala (scalac 2.11.8) [+5s]': '8',
  },
  verdicts: {
    '- IN QUEUE -': Verdict.PENDING,
    ACCEPTED: Verdict.ACCEPTED,
    'COMPILATION ERROR': Verdict.COMPILATION_ERROR,
    'TIME LIMIT EXCEEDED': Verdict.TIME_LIMIT_EXCEEDED,
    'PRESENTATION ERROR': Verdict.PRESENTATION_ERROR,
    'WRONG ANSWER': Verdict.WRONG_ANSWER,
    'MEMORY LIMIT EXCEEDED': Verdict.MEMORY_LIMIT_EXCEEDED,
  },
};
