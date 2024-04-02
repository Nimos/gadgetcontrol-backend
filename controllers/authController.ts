import { Request } from "express";
import jwt from "jsonwebtoken";

class AuthController {

    constructor() {
        console.log("Creating Auth Controller")
    }
    
    login(request: Request) {
        const secret = process.env.SECRET_KEY;
        const password = process.env.PASSWORD;
        if (!secret) {
            throw "No SECRET_KEY in .env"
        }
        if (request.body.password != password) {
            return {
                "error": true,
                "message": "INVALID_PASSWORD"
            }
        }
        const token = jwt.sign({ loggedIn: true }, secret, { expiresIn: 84000 * 7});

        return {
            "access_token": token
        }
    }

    verify(token: string) {
        const secret = process.env.SECRET_KEY;
        if (!secret) {
            throw "No SECRET_KEY in .env"
        }

        const payload = jwt.verify(token, secret);

        if (typeof payload == "string") {
            return false;
        } else {
            return payload.loggedIn;
        }
            
    }
}

let controller: AuthController = new AuthController();

export default controller;