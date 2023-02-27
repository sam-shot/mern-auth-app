import user_model from "../model/user_model.js";
import bcrypt from 'bcryptjs';
import genOTP from 'otp-generator';


/** MIDDLEWARE */

export async function verifyUser(req, res, next){
    try {
        const { email } = req.method == "GET" ? req.query:  req.body;

        let userExists = await user_model.findOne({email});
        if(!userExists) return res.status(404).send({error : "Can't find User"});
        next();
    } catch (error) {
        return res.status(404).send({error : "Authentication error"});
    }
}

/** POST REQUESTS  */ 


export async function register(req, res) {
  try {
    const { firstName, lastName, email, password, username } = req.body;
    // check exist user

    const userExists = new Promise((resolve, reject) => {
        user_model.findOne({email}, function (err, email) {
            if (err) reject(new Error(err));
            if (email) reject("Email Exist!");

            resolve();
        });
    });

    Promise.all([userExists]).then(() =>{
        if(password){
            bcrypt.hash(password, 10).then(hashedPass =>{

                const user = new user_model({
                    password: hashedPass,
                    email,
                    firstName,
                    lastName,
                    username
                });
                user.save().then(
                    result=>{
                        res.status(200).send({
                            message: "User Created Successfully"
                        });
                    }
                ).catch(error => {
                    res.status(500).send({error});
                });

            }).catch(error => {
                return res.status(500).send({
                    error: "Unable to Hash password"
                });
            });
        }
    }).catch(error => {
        return res.status(500).send({error});
    });
  } catch (error) {
    return res.status(500).send(error);
  }
}

export async function loginEmail(req, res) {
    const { email, password } = req.body;

    try {
        user_model.findOne({email}).then(user => {
            bcrypt.compare(password, user.password).then(passwordCheck => {
                if(!passwordCheck) return res.status(400).send({error : "Passwords do not match"});

                // const token = jwt.sign({
                //     userId: user._id,
                //     email: user.email
                // }, ENV.JWT_SECRET, {
                //     expiresIn: '1h'
                // });
                return res.status(200).send({
                    message: "Login Successfull",
                    email: user.email
                    // token
                })

            }).catch(error => {
                return res.status(400).send({error : "Passwords do not match"});
            });
        }).catch(error => {
            return res.status(404).send({error : "Email not Found!"})
        })
    } catch (error) {
        return res.status(500).send({error});
    }
}
export async function loginUsername(req, res) {
    const { username, password } = req.body;

    try {
        user_model.findOne({ username }).then(user => {
            bcrypt.compare(password, user.password).then(passwordCheck => {
                if(!passwordCheck) return res.status(400).send({error : "Passwords do not match"});

                // const token = jwt.sign({
                //     userId: user._id,
                //     email: user.email
                // }, ENV.JWT_SECRET, {
                //     expiresIn: '1h'
                // });
                return res.status(200).send({
                    message: "Login Successfull",
                    email: user.email
                    // token
                })

            }).catch(error => {
                return res.status(400).send({error : "Passwords do not match"});
            });
        }).catch(error => {
            return res.status(404).send({error : "User not Found!"})
        });
    } catch (error) {
        return res.status(500).send({error});
    }
}

export async function getUser(req, res) {

    const { username } = req.params;

    try {
        if(!username) return res.status(404).send({error : "Invalid User"});

        user_model.findOne({username}, function(err, user) {
            if(err) return res.status(500).send({err});
            if(!user) return res.status(501).send({error : "Could not find User"});
            
            const { password, ...rest } = Object.assign({}, user.toJSON());

            res.status(200).send(rest);
        })

    } catch (error) {
        return res.status(404).send({error : "Cannot Find user Data"});
    }
    
}

export async function updateUser(req, res){
    try {
        const {userId} = req.user;
        if(userId){
            const body = req.body;
            user_model.updateOne({ _id : userId}, body , function(err, data) {
                if(err) return res.status(500).send({error : "User not Found..!"});
                return res.status(200).send({message : " Update Successful "});
            });
        } else {
            return res.status(404).send({error : "User not Found..!"});
        }
        
    } catch (error) {
        return res.status(500).send({error});
    }
}

export async function generateOTP(req, res) {
    req.app.locals.OTP = genOTP.generate(4, {
        lowerCaseAlphabets : false,
        upperCaseAlphabets: false,
        specialChars: false
    });
    res.status(200).send({code: req.app.locals.OTP})
    
}

export async function verifyOtp(req, res) {
    const { code } = req.query;

    if(parseInt(req.app.locals.OTP) == parseInt(code)){
        req.app.locals.OTP = null;
        req.app.locals.resetSession = true;
        res.status(200).send({message: "Verified"});
    }
    res.status(400).send({error : "Invalid OTP"});
}

