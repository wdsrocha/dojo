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
    'C# Mono 5.18': '9',
    'D DMD32 v2.086.0': '28',
    'Go 1.12.6': '32',
    'Haskell GHC 8.6.3': '12',
    'Java 11.0.5': '60',
    'Java 1.8.0_162': '36',
    'Kotlin 1.3.10': '48',
    'OCaml 4.02.1': '19',
    'Delphi 7': '3',
    'Free Pascal 3.0.2': '4',
    'PascalABC.NET 3.4.2': '51',
    'Perl 5.20.1': '13',
    'PHP 7.2.13': '6',
    'Python 2.7.15': '7',
    'Python 3.7.2': '31',
    'PyPy 2.7 (7.2.0)': '40',
    'PyPy 3.6 (7.2.0)': '41',
    'Ruby 2.0.0p645': '8',
    'Rust 1.35.0': '49',
    'Scala 2.12.8': '20',
    'JavaScript V8 4.8.0': '34',
    'Node.js 9.4.0': '55',
    'ActiveTcl 8.5': '14',
    'Io-2008-01-07 (Win32)': '15',
    'Pike 7.8': '17',
    Befunge: '18',
    'OpenCobol 1.0': '22',
    Factor: '25',
    Secret_171: '26',
    Roco: '27',
    'Ada GNAT 4': '33',
    'Mysterious Language': '38',
    FALSE: '39',
    'Picat 0.9': '44',
    'GNU C++11 5 ZIP': '45',
    'Java 8 ZIP': '46',
    J: '47',
    'Microsoft Q#': '56',
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
