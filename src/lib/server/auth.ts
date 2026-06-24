import { betterAuth } from 'better-auth';
import { admin } from 'better-auth/plugins';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import prisma from './prisma';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          return {
            data: {
              ...user,
              username: user.username ?? user.name.toLowerCase().replace(/\s+/g, ''),
            },
          };
        },
      },
    },
  },
  plugins: [
    admin(),
  ],
});
