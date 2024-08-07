import { PrismaClient } from '@prisma/client';
import { validateRequest } from './auth';
import { enhance } from '@zenstackhq/runtime';

export const prisma = new PrismaClient();


export async function getEnhancedPrisma(): Promise<PrismaClient> {
    const { user } = await validateRequest();
    // create a wrapper of Prisma client that enforces access policy,
    // data validation, and @password, @omit behaviors
    return enhance(prisma, { user: {id: user?.id!}});
}