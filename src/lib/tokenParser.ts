import jwt from 'jsonwebtoken';

export type token = {
    email: string,
    userId: number,
    username: string,
}

export const isTokenValid = (token: string): boolean => {
    try {
        return !!jwt.verify(token, 'secret-key');
    } catch(e) {
        return false;
    }
} 

export const decodeToken = (token: string): token|null => {
    try {
        return jwt.verify(token, 'secret-key') as token;
    } catch(e) {
        return null;
    }
};

export const createToken = ({ email, username, userId}: {
    email: string,
    userId: number,
    username: string,
}) => {
    return jwt.sign({ 
        email, username, userId,
     }, 'secret-key');
}