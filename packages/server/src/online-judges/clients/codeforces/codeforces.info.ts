import { Verdict } from '../../../submissions/submissions.entity';

interface OnlineJudgeInfo {
  name: string;
  languages: {
    [key: string]: string;
  };
  verdicts: {
    [key: string]: Verdict;
  };
}

export const codeforcesInfo: OnlineJudgeInfo = {
  name: 'Codeforces',
  languages: {
    'GNU GCC C11 5.1.0': '43',
    'Clang++17 Diagnostics': '52',
    'GNU G++11 5.1.0': '42',
    'GNU G++14 6.4.0': '50',
    'GNU G++17 7.3.0': '54',
    'Microsoft Visual C++ 2010': '2',
    'Microsoft Visual C++ 2017': '59',
    'GNU G++17 9.2.0 (64 bit, msys 2)': '61',
    'C# 8, .NET Core 3.1': '65',
    'C# Mono 6.8': '9',
    'D DMD32 v2.091.0': '28',
    'Go 1.15.6': '32',
    'Haskell GHC 8.10.1': '12',
    'Java 11.0.6': '60',
    'Java 1.8.0_241': '36',
    'Kotlin 1.4.0': '48',
    'OCaml 4.02.1': '19',
    'Delphi 7': '3',
    'Free Pascal 3.0.2': '4',
    'PascalABC.NET 3.4.2': '51',
    'Perl 5.20.1': '13',
    'PHP 7.2.13': '6',
    'Python 2.7.18': '7',
    'Python 3.8.10': '31',
    'PyPy 2.7 (7.3.0)': '40',
    'PyPy 3.7 (7.3.0)': '41',
    'Ruby 3.0.0': '67',
    'Rust 1.49.0': '49',
    'Scala 2.12.8': '20',
    'JavaScript V8 4.8.0': '34',
    'Node.js 12.6.3': '55',
  },
  verdicts: {
    Running: Verdict.PENDING,
    Accepted: Verdict.ACCEPTED,
    Compilation: Verdict.COMPILATION_ERROR,
    Time: Verdict.TIME_LIMIT_EXCEEDED,
    Wrong: Verdict.WRONG_ANSWER,
    Memory: Verdict.MEMORY_LIMIT_EXCEEDED,
    // TODO: check why DB crashes on Runtime Error
    Runtime: Verdict.RUNTIME_ERROR,
  },
};
