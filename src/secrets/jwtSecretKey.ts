import config from '../environment/config';

export const jwtConstants = {
    secret: config.JWT_ENCRYPTION
};