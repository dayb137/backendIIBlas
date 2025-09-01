import passport from "passport";
import { Strategy as JWTStrategy, ExtractJwt } from"passport-jwt";
import { Strategy as localStrategy} from "passport-local";
import User from "../dao/models/user.model.js";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";

const extraerToken = (req) =>{
    let token = null;
    if (req && req.cookies && req.cookies.cookieToken) token = req.cookies.cookieToken;

    return token;
};

export const iniciarPassport = () =>{
    passport.use(
        "current",
        new JWTStrategy(
            {
                secretOrKey: process.env.JWT_SECRET,
                jwtFromRequest: ExtractJwt.fromExtractors([extraerToken])
            },
            async (tokenData, done) => {
                try {
                    return done (null, tokenData)
                } catch (error) {
                  return done(error, false)
                    
                }
            }
        )
    );
    passport.use(
        "register",
        new localStrategy(
            {
                usernameField: "email",
                passwordField: "password",
                passReqToCallback: true
            },
            async (req, email, password, done) => {
                try {
                    const{ first_name, last_name, age} = req.body;

                    if(!first_name || !email || !password)
                        return done(null, false, { message: "Datos incompletos"});
                    
                    const existingUser = await User.findOne({ email });
                    if(existingUser) 
                        return done(null, false, {message:"Email ya registrado"});

                    const newUser = new User({
                        first_name,
                        last_name,
                        email,
                        age,
                        password: bcrypt.hashSync(password, 10),
                        role: "user"
                    })

                    await newUser.save()

                    const userWithoutPassword  = newUser.toObject();
                    delete userWithoutPassword.password;

                    return done(null, userWithoutPassword);

                } catch (error) {
                    return done(error)
                    
                }
            }
        )
    );
    passport.use(
        "login",
        new localStrategy(
            {
                usernameField:"email",
            },
            async (email, password, done) => {
                try{
                    const user = await User.findOne({ email }).lean();
                    if(!user) return done (null, false);
                    

                    const isValid = bcrypt.compareSync(password, user.password);
                    if (!isValid) return done (null, false);
                    

                    return done(null, user); 
                } catch(error) {
                    return done(error);
                }
            }
        )
    );
};
