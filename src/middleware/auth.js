import jwt from "jsonwebtoken";

export const authenticateUser = (req, res, next)=>{
    try {
        const token = req.cookies?.cookieToken || req.headers.authorization?.split(" ")[1];

        if(!token){
            return res.status(401).json({message: "No autorizado, token no encontrado"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next(); 
    } catch (error) {
        return res.status(401).json({message: "token invalido o expirado"});
    }
};

export const authorizeRole = (roles) => {
    return (req, res, next) =>{
        if (!roles.includes(req.user.role)){
            return res.status(403).json({ message: "Acceso denegado: permisos isnuficientes!.."});
        }
        next();
    }
}