import { LoggerService, Injectable } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {
  private format(level: string, message: unknown, ...optionalParams: unknown[]): string {
    const parts: string[] = [];
    parts.push(`level=${level}`);
    parts.push(`time=${new Date().toISOString()}`);

    const addParam = (key: string, value: unknown) => {
      let strValue = typeof value === 'string' ? value : JSON.stringify(value);
      strValue = strValue
        .replace(/\t/g, '\\t')
        .replace(/\n/g, '\\n')
        .replace(/=/g, '\\=');
      parts.push(`${key}=${strValue}`);
    };

    addParam('message', message);

    optionalParams.forEach((param, index) => {
      addParam(`param${index}`, param);
    });

    return parts.join('\t');
  }

  log(message: unknown, ...optionalParams: unknown[]) {
    console.log(this.format('log', message, ...optionalParams));
  }

  error(message: unknown, ...optionalParams: unknown[]) {
    console.error(this.format('error', message, ...optionalParams));
  }

  warn(message: unknown, ...optionalParams: unknown[]) {
    console.warn(this.format('warn', message, ...optionalParams));
  }

  debug(message: unknown, ...optionalParams: unknown[]) {
    console.debug(this.format('debug', message, ...optionalParams));
  }

  verbose(message: unknown, ...optionalParams: unknown[]) {
    console.log(this.format('verbose', message, ...optionalParams));
  }
}