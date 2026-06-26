import { query } from "./db.mjs";
import * as securityServ from './security-serv.mjs';
import * as helpersServ from './helpers-serv.mjs';

export async function createUser({ username, password, }){
    const user = await query(
        "INSERT INTO users(username, hashed_password) VALUES ($1, $2) RETURNING role_id, username, user_id, created_at", 
        [username, securityServ.generateHashedPassword(password)]
    );
    return user.rows[0];
}

export async function getUsers({ page, limit }){
    try{
        const users = await query(
            "SELECT role_id, user_id, username, archived_at, created_at FROM users OFFSET $1 LIMIT $2",
            [(page - 1) * limit, limit + 1]
        );
        return users.rows;
    } catch(e){
        throw e
    }
}

export async function updateUser({ user_id, username, password }){
    try{
        const filtered = helpersServ.sanitizeEmptyProps({ username, password });
        const updates = Object.fromEntries(
            Object.entries(filtered)
            .map(([key, value]) => key === 'password' ? 
                ['hashed_password', securityServ.generateHashedPassword(value)] :
                [ key, value ]
            )
        );
        if(!Object.entries(updates).length) return null;

        let i = 2;
        const fieldsUpdates = Object.keys(updates).map(u => `${u} = $${i++}`);
        const text = `UPDATE users SET ${fieldsUpdates.join(', ')} WHERE user_id = $1 RETURNING role_id, username, user_id, created_at`;
        const values = [user_id, ...Object.values(updates)];

        const user = await query(text, values);
        return user.rows[0];
    } catch(e){
        throw e
    }
}

export async function archiveUser(user_id){
    try{
        const user = await query(
            "UPDATE users SET archived_at = NOW() WHERE user_id = $1",
            [user_id]
        );
        return user.rows[0];
    } catch(err){
        throw err;
    }
}
