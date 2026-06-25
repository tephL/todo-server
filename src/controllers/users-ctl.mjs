import { matchedData } from "express-validator";
import * as usersServ from '../services/users-serv.mjs';

export async function createUser(req, res){
    try{
        const { username, password } = matchedData(req);
        const u = await usersServ.createUser({ username, password });
        return res.status(200).json(u);
    } catch(err){
        console.log(err);
        return res.sendStatus(500);
    }
}

export async function getUsers(req, res){
    const { page, limit } = matchedData(req);
    const users = await usersServ.getUsers({ page, limit });
    if(!users.length) return res.sendStatus(204);
    return res.status(200).json(users);
}

export async function updateUser(req, res){
    try{
        const { user_id, username, password } = matchedData(req);
        const u = await usersServ.updateUser({ user_id, username, password });
        if(u===null) return res.sendStatus(204);
        return res.status(200).json(u);
    } catch(e){
        console.log(e);
        return res.sendStatus(500);
    }
}

export async function deleteUser(req, res){
    try{
        const { user_id } = req.params;
        const du = await usersServ.archiveUser(user_id);
        return res.sendStatus(200);
    } catch(e){
        console.log(e);
        return res.sendStatus(500);
    }
}
