import { query } from './db.mjs';
import * as helperServ from './helpers-serv.mjs';

const returnFields = ['task_id', 'title', 'description', 'status', 'category', 'created_at'];

export async function createTask({ title, description, category, user_id }){
    const filtered = helperServ.sanitizeEmptyProps({ title, description, category });
    const fields = Object.keys(filtered);
    let i = 2;
    const fieldCounts = fields.map(f => `$${i++}`);
    const text = `INSERT INTO tasks (user_id, ${fields.join(', ')}) VALUES ($1, ${fieldCounts.join(', ')}) RETURNING ${returnFields.join(', ')}`;
    const t = await query(
        text, 
        [user_id, ...Object.values(filtered)]
    );
    return t.rows[0];
}

export async function getTasks({ page, limit, user_id }){
    const text = `SELECT ${returnFields.join(', ')} FROM tasks WHERE user_id = $1 AND archived_at IS NULL ORDER BY task_id OFFSET $2 LIMIT $3`; 
    const values = [user_id, (page-1) * limit, Number(limit) + 1];
    const ts = await query(text, values);
    return ts.rows;
}

export async function updateTask({ task_id, title, description, category, status }){
    const filtered = helperServ.sanitizeEmptyProps({title, description, category, status});
    if(!Object.keys(filtered).length) return null;
    let i = 2;
    const updates = Object.keys(filtered).map(u => `${u} = $${i++}`);
    const text = `UPDATE tasks SET ${updates.join(', ')} WHERE task_id = $1 RETURNING ${returnFields.join(', ')}`;
    const uq = await query(text, [task_id, ...Object.values(filtered)]);
    return uq.rows[0];
}

export async function archiveTask(task_id){
    const dq = await query(
        "UPDATE tasks SET archived_at = NOW() WHERE task_id = $1", 
        [task_id]
    );
    return dq;
}
