import { TRPCError } from '@trpc/server';
import bcrypt from 'bcryptjs';
import { OptionsType } from 'cookies-next/lib/types';
import { getCookie, setCookie } from 'cookies-next';
import customConfig from '../config/default';
import { Context } from '../createContext';
import { CreateUserInput, LoginUserInput } from '../schema/user.schema';
import {
    createUser,
    findUniqueUser,
    findUser,
    signTokens,
} from '../services/user.service';
import redisClient from '../utils/connectRedis';
import { signJwt, verifyJwt } from '../utils/jwt';

const cookieOptions: OptionsType = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
};

const accessTokenCookiesOptions: OptionsType = {
    ...cookieOptions,
    expires: new Date(Date.now() + customConfig.accessTokenExpiresIn * 60 * 1000),
};

const refreshRokenCookiesOptions: OptionsType = {
    ...cookieOptions,
    expires: new Date(
        Date.now() + customConfig.refreshTokenExpiresIn * 60 * 100,
    ),
};

export const registerHandler = async ({
    input,
}: {
    input: CreateUserInput,
}) => {
    try {
        const hashedPassword = await bcrypt.hash(input.password, 12);
        const user = await createUser({
            email: input.email,
            name: input.name,
            password: hashedPassword,
            photo: input.photo,
            provider: 'local',
        });

        return {
            status: 'success',
            data: {
                user,
            },
        };
    } catch (err: any) {
        if (err.code === 'P2002') {
            throw new TRPCError({
                code: 'CONFLICT',
                message: 'Email already exists',
            });
        }
        throw err;
    }
}