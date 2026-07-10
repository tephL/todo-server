import { matchedData } from 'express-validator';
import * as taskServ from '../services/tasks-serv.mjs';

export async function createTask(req, res){
    try{
        const data = matchedData(req);
        const t = await taskServ.createTask({ user_id: req.user.user_id, ...data });
        return res.status(201).json(t);
    } catch(e){
        console.log(e);
        return res.sendStatus(500);
    }
}

export async function getTasks(req, res){
    try{
        const { page, limit } = req.query;
        const tasks = await taskServ.getTasks({ page, limit, user_id: req.user.user_id });
        if(!tasks.length) return res.sendStatus(204);
        const lastPage = limit >= tasks.length;
        return res.status(200).json({ tasks: tasks.slice(0, limit), lastPage: lastPage});
    } catch(e){
        console.log(e);
        return res.sendStatus(500);
    }
}

export async function updateTask(req, res){
    try{
        const update = await taskServ.updateTask({ task_id: req.query.task_id, ...matchedData(req)});
        if(!update) return res.sendStatus(204);
        return res.status(200).json(update);
    } catch(e){
        console.log(e);
        return res.sendStatus(500);
    }
}

export async function deleteTask(req, res){
    try{
        const t = await taskServ.archiveTask(req.params.task_id);
        return res.sendStatus(200);
    } catch(e){
        return res.sendStatus(500);
    }
}
