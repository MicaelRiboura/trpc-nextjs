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