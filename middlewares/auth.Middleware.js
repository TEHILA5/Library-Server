import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
    try {
        const { authorization = '' } = req.headers; 
        const [, token] = authorization.split(' ');
 
        const secretKey = process.env.JWT_SECRET ?? 'secretKey55555';
        const data = jwt.verify(token, secretKey); 
        console.log(data);   

        req.currentUser = data; 
        next();
    } catch (error) { 
        next({ status: 403, message: `Authentication failed` })
    }
};
 
export const isAdmin = (req, res, next) => {
    console.log(req.currentUser);

    if (req.currentUser.role === "admin") {
        return next();
    }
    return next({ status: 401, message: `Authorization failed (no permissions)` });
};

export const isOwner = (req, res, next) => {
    if (!req.currentUser) return next({ status: 401, message: "Authentication required" });
    next();
};

export const isOwnerOrAdmin = (req, res, next) => {
    if (!req.currentUser) {
        return next({ status: 401, message: "Authentication required" });
    }

    const { user_id, role } = req.currentUser;
    const { id } = user_id;  
    if (role === "admin" || user_id === id) {
        return next();
    }

    return next({ status: 401, message: "Authorization failed (no permissions)" });
};
