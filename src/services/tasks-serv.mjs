import { query } from './db.mjs';
import * as helperServ from './helpers-serv.mjs';

export async function createTask({ title, description, category, user_id }){
    const filtered = helperServ.sanitizeEmptyProps({ title, description, category });
    const fields = Object.keys(filtered);
    let i = 2;
    const fieldCounts = fields.map(f => `$${i++}`);
    const text = `INSERT INTO tasks (user_id, ${fields.join(', ')}) VALUES ($1, ${fieldCounts.join(', ')}) RETURNING task_id, title, description, status, category, created_at`;
    const t = await query(
        text, 
        [user_id, ...Object.values(filtered)]
    );
    return t.rows[0];
}

export async function getTasks({ page, limit, user_id }){
    const text = "SELECT * FROM tasks WHERE user_id = $1 ORDER BY task_id OFFSET $2 LIMIT $3"; 
    const values = [user_id, (page-1) * limit, Number(limit) + 1];
    const ts = await query(text, values);
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
