import bcrypt from 'bcrypt';

const saltRounds = 10;

export function generateHashedPassword(password){
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
}

export function compareHashedPassword(password, hashed_password){
    return bcrypt.compareSync(password, hashed_password);
}
