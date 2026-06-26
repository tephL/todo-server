import { matchedData } from "express-validator";
import * as usersServ from '../services/users-serv.mjs';

export async function createUser(req, res){
    try{
        const { username, password } = matchedData(req);
        const u = await usersServ.createUser({ username, password });
        return res.status(201).send(u);
    } catch(err){
        if(err.detail) return res.status(400).send({ message: err.detail });
        return res.sendStatus(500);
    }
}

export async function getUsers(req, res){
    try{
        const { page, limit } = matchedData(req);
        const users = await usersServ.getUsers({ page, limit });
        if(!users.length) return res.sendStatus(204);
        const lastPage = users.length <= limit;
        return res.status(200).json({ users: users.slice(0, limit), lastPage: lastPage });
    } catch(err){
        if(err.detail) return res.status(400).send({ message: err.detail });
        return res.sendStatus(500);
    }
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
