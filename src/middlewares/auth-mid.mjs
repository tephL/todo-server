export function isUserAuthenticated(req, res, next){
    if(!req.isAuthenticated()) return res.sendStatus(401);
    next();
}

export function isUserAdmin(req, res, next){
    if(req.user.role_id !== 888) return res.sendStatus(401);
    next();
}
