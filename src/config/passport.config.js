import passport from "passport";
import { Strategy as JWTStrategy, ExtractJwt } from"passport-jwt";
import { Strategy as localStrategy} from "passport-local";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";

const extraerToken = (req) =>{
    let token = null;
    if (req && req.cookies && req.cookies.cookieToken) {
    token = req.cookies.cookieToken;
    }

    if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1];
    }
}



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
                    const user = await User.findById(tokenData.id).select("-password");
                    if (!user) return done (null, false)
                        return done (null, false)
                } catch (error) {
                  return done(error, false)
                    
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
                    const user = await User.findOne({ email });
                    if(!user) return done (null, false);
                    

                    const isValid = bcrypt.compareSync(password, user.password);
                    if (!isValid) return done (null, false);
                    

                    return done(null, user); 
                } catch(error) {
                    return done(error);
                }
            }
        )
    )
};
