import jwt from "jsonwebtoken";
import User from "../models/User.js";


// =============================
// PROTECT ROUTES
// =============================

export const protect = async (
    req,
    res,
    next
) => {

    try {

        const authHeader =
            req.headers.authorization;


        // =============================
        // CHECK AUTHORIZATION HEADER
        // =============================

        if (

            !authHeader ||

            !authHeader.startsWith(
                "Bearer "
            )

        ) {

            return res.status(401).json({

                message:
                    "Please login first",

            });

        }


        // =============================
        // GET TOKEN
        // =============================

        const token =
            authHeader.split(" ")[1];


        // =============================
        // VERIFY TOKEN
        // =============================

        const decoded =
            jwt.verify(

                token,

                process.env.JWT_SECRET

            );


        // =============================
        // FIND USER
        // =============================

        const user =
            await User.findById(

                decoded.userId

            ).select(
                "-password"
            );


        if (!user) {

            return res.status(401).json({

                message:
                    "User not found",

            });

        }


        // =============================
        // SAVE USER
        // =============================

        req.user = user;


        next();


    } catch (error) {

        return res.status(401).json({

            message:
                "Invalid or expired token. Please login again.",

        });

    }

};


// =============================
// ADMIN ONLY MIDDLEWARE
// =============================

export const adminOnly = (
    req,
    res,
    next
) => {

    if (

        !req.user ||

        req.user.role !== "admin"

    ) {

        return res.status(403).json({

            message:
                "Admin access only",

        });

    }


    next();

};

