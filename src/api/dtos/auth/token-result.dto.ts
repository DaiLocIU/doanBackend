import { AutoMap } from 'nestjsx-automapper';

import parse from 'date-fns/parse';
import addMilliseconds from 'date-fns/addMilliseconds';
import ms from 'ms';
import { ApiProperty } from '@nestjs/swagger';

export class TokenResultDto {
  @AutoMap()
  @ApiProperty()
  token: string;

  @AutoMap()
  @ApiProperty()
  expiry: Date;

  computeExpiry(jwtExpired: string) {
    const milli = ms(jwtExpired);
    const now = Date.now();
    this.expiry = parse(addMilliseconds(now, milli).toLocaleString(), 'M/d/yyyy, h:mm:ss aaa', now);
  }
}
