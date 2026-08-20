import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;

  beforeEach(() => {
    logger = new JsonLogger();
  });

  it('должен выводить лог в формате JSON', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation();

    logger.log('тестовое сообщение');

    const output = spy.mock.calls[0][0];
    const parsed = JSON.parse(output);

    expect(parsed.level).toBe('log');
    expect(parsed.message).toBe('тестовое сообщение');

    spy.mockRestore();
  });

  it('должен выводить ошибку в формате JSOn', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation();

    logger.error('ошибка');

    const output = spy.mock.calls[0][0];
    const parsed = JSON.parse(output);

    expect(parsed.level).toBe('error');
    expect(parsed.message).toBe('ошибка');

    spy.mockRestore();
  });

  it('должен выводить warn в формате JSON', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation();

    logger.warn('предупреждение');

    const output = spy.mock.calls[0][0];
    const parsed = JSON.parse(output);

    expect(parsed.level).toBe('warn');

    spy.mockRestore();
  });

  it('должен выводить debug в формате JSON', () => {
    const spy = jest.spyOn(console, 'debug').mockImplementation();

    logger.debug('отладка');

    const output = spy.mock.calls[0][0];
    const parsed = JSON.parse(output);

    expect(parsed.level).toBe('debug');

    spy.mockRestore();
  });

  it('должен выводить verbose в формате JSON', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation();

    logger.verbose('подробно');

    const output = spy.mock.calls[0][0];
    const parsed = JSON.parse(output);

    expect(parsed.level).toBe('verbose');

    spy.mockRestore();
  });

  it('должен добавлять optionalParams в вывод', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation();

    logger.log('сообщение', 'парам1', 'парам2');

    const output = spy.mock.calls[0][0];
    const parsed = JSON.parse(output);

    expect(parsed.optionalParams).toEqual(['парам1', 'парам2']);

    spy.mockRestore();
  });
});