import { matchedData } from 'express-validator';
import * as taskServ from '../services/tasks-serv.mjs';

export async function createTask(req, res){
    try{
        const data = matchedData(req);
        const t = await taskServ.createTask({ user_id: req.user.user_id, ...data });
        console.log(t);
        return res.status(201).json(t);
    } catch(e){
        console.log(e);
        return res.sendStatus(500);
    }
}
