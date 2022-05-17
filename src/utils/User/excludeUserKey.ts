import { User } from '@prisma/client';

export default function exclude<User, Key extends keyof User>(
  user: User,
  ...keys: Key[]
) {
  for (let key of keys) {
    delete user[key];
  }
  return user;
}
