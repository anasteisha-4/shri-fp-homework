/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import * as R from 'ramda';

import Api from '../tools/api';

const api = new Api();

const toBinary = (number) =>
  api
    .get('https://api.tech/numbers/base', {
      from: 10,
      to: 2,
      number
    })
    .then(R.prop('result'));

const getAnimal = (id) =>
  api
    .get(`https://animals.tech/${id}`, {
      id
    })
    .then(R.prop('result'));

const tapLog = R.curry((writeLog, x) => {
  writeLog(x);
  return x;
});

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
  writeLog(value);

  if (
    !R.allPass([
      R.pipe(R.length, R.lt(R.__, 10)),
      R.pipe(R.length, R.gt(R.__, 2)),
      R.pipe(Number.parseFloat, R.gt(R.__, 0)),
      R.test(/^[0-9]+\.?[0-9]*$/)
    ])(value)
  ) {
    handleError('ValidationError');
    return;
  }

  R.pipe(
    Number,
    Math.round,
    tapLog(writeLog),
    toBinary,
    R.andThen(
      R.pipe(
        tapLog(writeLog),
        R.length,
        tapLog(writeLog),
        (len) => Math.pow(len, 2),
        tapLog(writeLog),
        (sq) => sq % 3,
        tapLog(writeLog),
        getAnimal
      )
    ),
    R.andThen(handleSuccess)
  )(value).catch(() => handleError('APIError'));
};

export default processSequence;
