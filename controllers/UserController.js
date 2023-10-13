import bcryptjs from "bcryptjs";
import main from "../db.js";
import { User } from "../models.js";
import jwt from 'jsonwebtoken';
const { hash, compare } = bcryptjs;
const { sign } = jwt;

export const register = async (req, res) => {
    try {
        main();
        const { username, password } = req.body;

        const candidate = await User.findOne({ username });
        if (candidate) return res.status(400).json({ message: 'Username already taken.' })

        const hashedPass = await hash(password, 10);

        const user = new User({ username: username, passwordHash: hashedPass });
        await user.save();

        const token = await sign({
            _id: user._id
        }, process.env.JWT_SECRET, {
            expiresIn: '3d'
        });

        const { passwordHash, ...userData } = user._doc;
        return res.status(201).json({ token });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: err.message || '500 Server error.' });
    }
}

export const login = async (req, res) => {
    try {
        main();
        const { username, password } = req.body;

        const candidate = await User.findOne({ username });
        if (!candidate) return res.status(400).json({ message: 'User not found.' })

        const passIsValid = await compare(password, candidate.passwordHash);
        if (!passIsValid) return res.status(400).json({ message: 'Password is invalid.' });

        const { passwordHash, ...userData } = candidate._doc;
        const token = await sign({
            _id: candidate._id
        }, process.env.JWT_SECRET, {
            expiresIn: '3d'
        });
        return res.status(201).json({ token });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: err.message || '500 Server error.' });
    }
}

export const getme = async (req, res) => {
    try {
        main();
        const user = await User.findById(req.userId);
        if (!user) return res.status(400).json({ message: 'Authentication failed.' });
        const token = await sign({
            _id: user._id
        }, process.env.JWT_SECRET, {
            expiresIn: '3d'
        });
        const { passwordHash, ...userData } = user._doc;
        return res.json({ userData, token });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: err.message || '500 Server error.' });
    }
}

export const addtolist = async (req, res) => {
    try {
        main();
        const { rated, list, anime } = req.body;
        const user = await User.findById(req.userId);
        user.lists[list].push({
            rated,
            anime,
            date: new Date()
        });
        await user.save();
        return res.status(202).json({ message: `${anime.title || `Anime`} was successfully added to ${list} list.` })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: err.message || '500 Server error.' });
    }
}

export const removefromlist = async (req, res) => {
    try {
        main();
        const { anime, list } = req.body;
        if (!anime || !list) return res.status(400).json({ message: `` });
        const user = await User.findById(req.userId);
        const index = user.lists[list].indexOf(anime);
        user.lists[list].splice(index, 1);
        await user.save();
        return res.status(202).json({ message: `${anime.title || `Anime`} was successfully removed from ${list} list.` });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: err.message || '500 Server error.' });
    }
}