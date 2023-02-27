

export default async function Auth(req, res, next) {
    try {
        
        // const token = req.headers.authorization.split(" ")[1];

        // const decodedToken = await jwt.verify(token, ENV.JWT_SECRET);
        req.user = 987089;
        next();

    } catch (error) {
        res.status(401).json({error : "Authentication failed, Please Log In Again"})
    }
    
}


export function localVar(req, res, next) {
    req.app.locals = {
        OTP : null,
        resetSession: false
    }
    
    next();
}