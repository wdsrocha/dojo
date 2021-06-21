import fetchMock from 'jest-fetch-mock';

import { Problem } from '../../../../problems/problems.entity';
import { stubBrowser, stubPage } from '../../../puppeteer.mock';
import { UriAdapter } from './../../../../online-judges/adapters/uri/uri-adapter';
import { problemPage } from './uri-adapter.mock';
const { Response } = jest.requireActual('node-fetch');

jest.mock('puppeteer', () => ({
  launch() {
    return stubBrowser;
  },
}));

process.env.URI_BOT_EMAIL = 'email';
process.env.URI_BOT_PASSWORD = 'password';

describe('getProblem', () => {
  it('should get the problem data', async () => {
    const uriAdapter = new UriAdapter();
    fetchMock.mockReturnValue(Promise.resolve(new Response(problemPage)));
    const problem = await uriAdapter.getProblem('1001');

    expect(problem).toStrictEqual<Omit<Problem, 'id'>>({
      onlineJudgeId: 'uri',
      remoteProblemId: '1001',
      remoteLink: 'https://www.urionlinejudge.com.br/repository/UOJ_1001.html',
      title: 'Extremamente Básico',
      timelimit: '1',
      description:
        '<p>\n' +
        '                    Leia 2 valores inteiros e armazene-os nas vari&#xE1;veis <strong>A</strong> e <strong>B</strong>. Efetue a soma de <strong>A</strong> e <strong>B</strong> atribuindo o seu resultado na vari&#xE1;vel <strong>X</strong>. Imprima <strong>X</strong> conforme exemplo apresentado abaixo. N&#xE3;o apresente mensagem alguma al&#xE9;m daquilo que est&#xE1; sendo especificado e n&#xE3;o esque&#xE7;a de imprimir o fim de linha ap&#xF3;s o resultado, caso contr&#xE1;rio, voc&#xEA; receber&#xE1; &quot;<em>Presentation Error</em>&quot;.\n' +
        '                </p>',
      input:
        '<p>\n' +
        '                    A entrada cont&#xE9;m 2 valores inteiros.\n' +
        '                </p>',
      output:
        '<p>\n' +
        '                    Imprima a mensagem &quot;X = &quot; (letra X mai&#xFA;scula) seguido pelo valor da vari&#xE1;vel <strong> X </strong> e pelo final de linha. Cuide para que tenha um espa&#xE7;o antes e depois do sinal de igualdade, conforme o exemplo abaixo. \n' +
        '                </p>',
      inputExamples: [
        '10\n                                9',
        '-10\n                                4',
        '15\n                                -7',
      ],
      outputExamples: ['X = 19', 'X = -6', 'X = 8'],
    });
  });

  it('should throw 404 error when getting the problem data for an unknown problem', async () => {
    const uriAdapter = new UriAdapter();
    fetchMock.mockReturnValue(Promise.resolve(new Response(problemPage)));
    const { title } = await uriAdapter.getProblem('999');
    expect(title).toBeFalsy();
  });
});

describe('submit', () => {
  it('should submit a problem and receive the submission id', async () => {
    const uriAdapter = new UriAdapter();

    jest
      .spyOn(stubPage, 'url')
      .mockReturnValue(
        await Promise.resolve(
          'https://www.urionlinejudge.com.br/judge/pt/runs/code/20596989',
        ),
      );

    const { submissionId } = await uriAdapter.submit(
      '1000',
      '20',
      'print("Hello World!")',
    );

    expect(submissionId).toBe('20596989');
  });
});
