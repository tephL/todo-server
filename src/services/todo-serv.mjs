import { query } from './db.mjs';
import * as helperServ from './helpers-serv.mjs';

export async function createTask({ title, description, category, user_id }){
    const t = await query(
        "INSERT INTO tasks VALUES ($1, $2, $3, $4) RETURNING * ",
        [user_id, title, description, category]
    );
    return t.rows[0];
}

export async function getTasks({ page, limit, user_id }){
    const ts = await query(
        "SELECT * FROM tasks WHERE user_id = $1 OFFSET $2 LIMIT $3",
        [user_id, (page-1) * limit, limit + 1]
    );
    return ts.rows;
}

export async function updateTask({ user_id, title, description, category, status }){
    const filtered = helperServ.sanitizeEmptyProps({title, description, category, status});
    if(!Object.keys(filtered).length) return null;
    let i = 2;
    const updates = Object.entries(filtered).map(u => `${u} = $${i++}`);
    const text = `UPDATE tasks SET ${updates.join(', ')} WHERE user_id = $1 RETURNING *`;
    const values = [user_id, ...Object.values(filtered)];
    const uq = await query(text, values);
    return uq.rows[0];
}

export async function archiveTask(task_id){
    const dq = await query(
        "UPDATE tasks SET archived_at = NOW() WHERE user_id = $1", 
        [task_id]
    );
    return dq;
}
