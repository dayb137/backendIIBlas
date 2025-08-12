import {Router} from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";

const router = Router();

router.post("/register", async (req, res)=> {
    const { first_name, last_name, email, age, password, role, cart} = req.body;
    if(!first_name || !password || !email){
        return res.status(400).json({ error: " Complete todo los datos"});
    }
    try {
        const userExistente = await User.findOne({ email });
        if(userExistente) return res.status(400).json({ error: "Email ya registrado"});

        const nUser = new User({ first_name, last_name, email, age, password: bcrypt.hashSync(password, 10), role:'user'});
        await nUser.save();

        res.status(201).json({message: "Usuario creado", user: nUser.first_name});
    } catch (error) {
        res.status(500).json({error: error.message});
        
    }
});

router.post(
    "/login", 
    passport.authenticate("login", {session: false, failureRedirect:"/api/sessions/error"}),
    (req,res)=> {
        let userData = {...req.user.toObject()};
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
    passport.authenticate("current", {session: false, fallureRedirect: "/api/sessions/error"}),
    (req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.status(200).json({mensaje: "Perfil del Usuario" + req.user.first_name, datosUsuario: req.user});
    
  }
);

export default router;