import { prisma } from "./db.mjs";

export async function createTask({ title, description, category, user_id }){
    const t = await prisma.tasks.create({
        data: {
            title: title, 
            description: description, 
            category: category, 
            user_id: user_id, 
        }
    });
    return t;
}

export async function getTasks({ page, limit, user_id }){
    const ts = await prisma.tasks.findMany({ 
        skip: ( (page - 1) * limit ),
        take: limit, 
        where: {
            user_id: user_id 
        }
    });
    return ts;
}
