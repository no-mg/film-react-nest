//TODO реализовать DTO для /orders
export class TicketDto {
  readonly film: string;
  readonly session: string;
  readonly daytime?: string;
  readonly day?: string;
  readonly time?: string;
  readonly row: number;
  readonly seat: number;
  readonly price?: number;
}

export class CreateOrderDto {
  readonly email: string;
  readonly phone: string;
  readonly tickets: TicketDto[];
}
