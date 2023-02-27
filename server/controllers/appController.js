import user_model from "../model/user_model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ENV from '../config.js'


/** MIDDLEWARE */

export async function verifyUser(req, res, next){
    try {
        const { email } = req.method = req.body;

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
    const { firstName, lastName, email, password } = req.body;
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
                    lastName
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

export async function login(req, res) {
    const { email, password} = req.body;

    try {
        user_model.findOne({email}).then(user => {
            bcrypt.compare(password, user.password).then(passwordCheck => {
                if(!passwordCheck) return res.status(400).send({error : "Passwords do not match"});

                const token = jwt.sign({
                    userId: user._id,
                    email: user.email
                }, ENV.JWT_SECRET, {
                    expiresIn: '24h'
                });
                return res.status(200).send({
                    message: "Login Successfull",
                    email: user.email,
                    token
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

export async function getUser(req, res) {

    const { email } = req.params;

    try {
        if(!email) return res.status(404).send({error : "Invalid Email Address"});

        user_model.findOne({email}, function(err, user) {
            if(err) return res.status(500).send({err});
            if(!user) return res.status(501).send({error : "Could not find User"});
            
            const { password, ...rest } = Object.assign({}, user.toJSON());

            res.status(200).send(rest);
        })

    } catch (error) {
        return res.status(404).send({error : "Cannot Find user Data"});
    }
    
}