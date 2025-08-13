import {Router} from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import {authenticateUser} from '../middleware/auth.js'
import User from "../models/user.model.js";

const router = Router();

router.post(
    "/register",
    passport.authenticate("register", {session: false}),
    (req, res) => {
        res.status(201).json({message: "Usuario creado", user: req.user});
    
    }

);

router.post(
    "/login", 
    passport.authenticate("login", {session: false}),
    (req,res)=> {
        let userData = {...req.user};

        delete userData.password;

        const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '1h'});
        res.cookie("cookieToken", token, { httpOnly: true});

        res.status(200).json({usuarioLogueado: userData, token: token});
        
    
    
    }
);

router.get("/error", (req, res)=> {
    res.setHeader('Content-Type', 'application/json');
    res.status(400).json({ error: "Error al autenticar"})
});



router.get(
    "/current",
    passport.authenticate("current", {session: false, failureRedirect: "/api/sessions/error"}),
    (req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.status(200).json({mensaje: "Perfil del Usuario", usuario: req.user});
    
  }
);

router.get("/logout", (req, res) => {
    res.clearCookie("cookieToken");
    res.status(200).json({ message:"Logout exitoso", pyload: "Sesión cerrada correctamente "})
});



router.get("/users", authenticateUser, async (req, res) =>{
    try {
        const users = await User.find().select("-password").lean();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({message: "Error al obtener usuarios", error: error.message})
        
    }
});

router.put("/users/:uid", authenticateUser, async (req, res) =>{
    try {
        const {uid} = req.params;
        const updateData = req.body;

        if(updateData.password) {
            const bcrypt = await import("bcrypt");
            updateData.password = bcrypt.hashSync(updateData.password, 10)
        }

        const updateUser = await User.findByIdAndUpdate(uid, updateData, { new : true }).lean();
        if (!updateUser) return res.status(404).json({message: "Usuario no encontrado"});

        res.status(200).json({message: "Usuario actualizado", user: updateUser});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

router.delete("/users/:uid", authenticateUser, async (req, res) =>{
    try {
        const {uid} = req.params;
        const deletedUser = await User.findByIdAndDelete(uid).lean();

        if(!deletedUser) return res.status(404).json({ message: " Usuario no encontrado"});

        res.status(200).json({ message: "Usuario eliminado", user: deletedUser});
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
});



export default router;