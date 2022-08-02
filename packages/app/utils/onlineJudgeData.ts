interface OnlineJudgeData {
  [key: string]: {
    languages: {
      [key: string]: string;
    };
  };
}

export const onlineJudgeData: OnlineJudgeData = {
  uri: {
    languages: {
      "C (gcc 4.8.5, -O2 -lm) [+0s]": "1",
      "C# (mono 5.10.1.20) [+2s]": "7",
      "C++ (g++ 4.8.5, -std=c++11 -O2 -lm) [+0s]": "2",
      "C++17 (g++ 7.3.0, -std=c++17 -O2 -lm) [+0s]": "16",
      "C99 (gcc 4.8.5, -std=c99 -O2 -lm) [+0s]": "14",
      "Dart (dart 2.9) [+2s]": "22",
      "Go (go 1.8.1) [+2s]": "12",
      "Haskell (ghc 7.6.3) [+5s]": "17",
      "Java (OpenJDK 1.7.0) [+2s]": "3",
      "Java 14 (OpenJDK 1.14.0) [+2s]": "21",
      "Java 8 (OpenJDK 1.8.0) [+2s]": "11",
      "JavaScript (nodejs 8.4.0) [+2s]": "10",
      "Kotlin (1.2.10) [+2s]": "15",
      "Lua (lua 5.2.3) [+1s]": "9",
      "OCaml (ocamlc 4.01.0) [+1s]": "18",
      "Pascal (fpc 2.6.2) [+0s]": "19",
      "PHP (7.4.3) [+1s]": "24",
      "Python (Python 2.7.6) [+1s]": "4",
      "Python 3 (Python 3.4.3) [+1s]": "5",
      "Python 3.8 (Python 3.8.2) [+1s]": "20",
      "R (Rscript 4.0.2) [+2s]": "23",
      "Ruby (ruby 2.3.0) [+5s]": "6",
      "Scala (scalac 2.11.8) [+5s]": "8",
    },
  },
  codeforces: {
    languages: {
      "GNU GCC C11 5.1.0": "43",
      "Clang++17 Diagnostics": "52",
      "GNU G++11 5.1.0": "42",
      "GNU G++14 6.4.0": "50",
      "GNU G++17 7.3.0": "54",
      "Microsoft Visual C++ 2010": "2",
      "Microsoft Visual C++ 2017": "59",
      "GNU G++17 9.2.0 (64 bit, msys 2)": "61",
      "C# 8, .NET Core 3.1": "65",
      "C# Mono 6.8": "9",
      "D DMD32 v2.091.0": "28",
      "Go 1.15.6": "32",
      "Haskell GHC 8.10.1": "12",
      "Java 11.0.6": "60",
      "Java 1.8.0_241": "36",
      "Kotlin 1.4.0": "48",
      "OCaml 4.02.1": "19",
      "Delphi 7": "3",
      "Free Pascal 3.0.2": "4",
      "PascalABC.NET 3.4.2": "51",
      "Perl 5.20.1": "13",
      "PHP 7.2.13": "6",
      "Python 2.7.18": "7",
      "Python 3.8.10": "31",
      "PyPy 2.7 (7.3.0)": "40",
      "PyPy 3.7 (7.3.0)": "41",
      "Ruby 3.0.0": "67",
      "Rust 1.49.0": "49",
      "Scala 2.12.8": "20",
      "JavaScript V8 4.8.0": "34",
      "Node.js 12.6.3": "55",
    },
  },
};

interface Option {
  value: string;
  label: string;
}

export function getLanguageOptions(onlineJudgeId: string): Option[] {
  if (!(onlineJudgeId in onlineJudgeData)) {
    return [];
  }

  const languageOptions: Option[] = [];

  Object.entries(onlineJudgeData[onlineJudgeId].languages).forEach(
    ([key, value]) => {
      languageOptions.push({
        label: key,
        value,
      });
    }
  );

  return languageOptions;
}

export function getLanguageById(
  onlineJudgeId: string,
  languageId: string
): string | undefined {
  if (!(onlineJudgeId in onlineJudgeData)) {
    return undefined;
  }

  let language: string | undefined;
  Object.entries(onlineJudgeData[onlineJudgeId].languages).forEach(
    ([key, value]) => {
      if (languageId === value) {
        language = key;
      }
    }
  );
  return language;
}
