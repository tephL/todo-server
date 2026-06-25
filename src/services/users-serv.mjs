import { prisma } from "./db.mjs";
import * as securityServ from './security-serv.mjs';
import * as helpersServ from './helpers-serv.mjs';

export async function createUser({ username, password, }){
    return await prisma.users.create({ 
        data: {
            username: username, 
            hashed_password: securityServ.generateHashedPassword(password)
        },
        omit: {
            hashed_password: true, 
            archived_at: true, 
            user_id: true
        }
    });
}

export async function getUsers({ page, limit }){
    return await prisma.users.findMany({
        skip: Number( (page-1) * limit ), 
        take: Number(limit), 
        omit: {
            hashed_password: true, 
            archived_at: true, 
        }
    });
}

export async function updateUser({ user_id, username, password }){
    const filtered = helpersServ.sanitizeEmptyProps({ username, password });
    const updates = Object.fromEntries(
        Object.entries(filtered)
        .map(([key, value]) => key === 'password' ? 
            ['hashed_password', securityServ.generateHashedPassword(value)] :
            [ key, value ]
        )
    );
    if(!Object.entries(updates).length) return null;
    const u = await prisma.users.update({ 
        data: { ...updates }, 
        where: {
            user_id: Number(user_id)
        }, 
        omit: {
            hashed_password: true, 
            archived_at: true 
        }
    });
    return u;
}

export async function archiveUser(user_id){
    return await prisma.users.update({
        data: { archived_at: new Date() }, 
        where: { user_id: Number(user_id) }
    })
}
