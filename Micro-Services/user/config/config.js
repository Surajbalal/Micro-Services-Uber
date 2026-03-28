import dotenv from 'dotenv';

dotenv.config();


if(!process.env.JWT_REFRESH_TOKEN_SECRET){
    throw new Error('JWT_REFRESH_TOKEN_SECRET is not defined');
}

const config = {
    JWT_REFRESH_TOKEN_SECRET : process.env.JWT_REFRESH_TOKEN_SECRET,
}
export default config;