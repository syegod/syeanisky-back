import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
config();

export const authCheck = async (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s/, '');
    if(token){
        try {
            const decodedData = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decodedData._id;
            next();
        } catch (err) {
            console.log(err);
            return res.status(403).json({message: 'Not authenticated.'});
        }
    } else {
        return res.status(403).json({message: 'Not authenticated.'});
    }
}