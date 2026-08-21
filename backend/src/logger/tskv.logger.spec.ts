import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;

  beforeEach(() => {
    logger = new TskvLogger();
  });

  it('должен выводить лог в формате TSKV', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation();

    logger.log('тестовое сообщение');

    const output = spy.mock.calls[0][0];

    expect(output).toContain('level=log');
    expect(output).toContain('message=тестовое сообщение');
    expect(output).toContain('\t');

    spy.mockRestore();
  });

  it('должен выводить ошибку в формате TSKV', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation();

    logger.error('ошибка');

    const output = spy.mock.calls[0][0];

    expect(output).toContain('level=error');
    expect(output).toContain('message=ошибка');

    spy.mockRestore();
  });

  it('должен выводить warn в формате TSKV', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation();

    logger.warn('предупреждение');

    const output = spy.mock.calls[0][0];

    expect(output).toContain('level=warn');

    spy.mockRestore();
  });

  it('должен выводить debug в формате TSKV', () => {
    const spy = jest.spyOn(console, 'debug').mockImplementation();

    logger.debug('отладка');

    const output = spy.mock.calls[0][0];

    expect(output).toContain('level=debug');

    spy.mockRestore();
  });

  it('должен выводить verbose в формате TSKV', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation();

    logger.verbose('подробно');

    const output = spy.mock.calls[0][0];

    expect(output).toContain('level=verbose');

    spy.mockRestore();
  });

  it('должен добавлять параметры как param0, param1', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation();

    logger.log('сообщение', 'доп1', 'доп2');

    const output = spy.mock.calls[0][0];

    expect(output).toContain('param0=доп1');
    expect(output).toContain('param1=доп2');

    spy.mockRestore();
  });

  it('должен экранировать табуляцию в значениях', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation();

    logger.log('сообщение\tс\tтабами');

    const output = spy.mock.calls[0][0];

    expect(output).toContain('message=сообщение\\tс\\tтабами');

    spy.mockRestore();
  });
});
