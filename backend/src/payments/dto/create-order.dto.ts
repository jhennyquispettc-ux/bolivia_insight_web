import { IsIn } from 'class-validator';

export class CreateOrderDto {
  // Only the two session lengths we sell. The price is derived from this
  // server-side — the client never sends an amount.
  @IsIn([15, 30])
  durationMin: number;
}
