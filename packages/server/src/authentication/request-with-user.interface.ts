import { Request } from 'express';

import { User } from '../users/users.entity';

export interface RequestWithUser extends Request {
  user: User;
}
