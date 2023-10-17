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
        const { list, anime } = req.body;
        if (!anime || !list) return res.status(400).json({ message: `No anime or list provided.` });
        const user = await User.findById(req.userId);
        if(user.list?.some(e => e.anime?.mal_id === anime?.mal_id)){
            const index = user.list.findIndex(e => e.anime.mal_id === anime.mal_id);
            user.list[index].list = list;
            await user.save();
            return res.status(202).json({ message: `${anime.title || `Anime`} was successfully moved to ${list} list.` })
        }
        user.list.push({
            anime,
            date: new Date(),
            list
        });
        await user.save();
        return res.status(202).json({ message: `${anime.title || `Anime`} was successfully added to ${list} list.` });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: err.message || '500 Server error.' });
    }
}

export const removefromlist = async (req, res) => {
    try {
        main();
        const { anime, list } = req.body;
        if (!anime || !list) return res.status(400).json({ message: `No anime or list provided.` });
        const user = await User.findById(req.userId);
        const index = user.list.findIndex(e => e.anime.mal_id === anime.mal_id);
        user.list.splice(index, 1);
        await user.save();
        return res.status(202).json({ message: `${anime.title || `Anime`} was successfully removed from ${list} list.` });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: err.message || '500 Server error.' });
    }
}

export const changerating = async (req, res) => {
    try {
        main();
        const {animeId, rating} = req.body;
        if (!rating) return res.status(400).json({ message: `Rating cannot be null or empty.` });
        const user = await User.findById(req.userId);
        const index = user.list.findIndex(e => e.anime?.mal_id == animeId);
        console.log('Index: ' + index);
        user.list[index].rating = rating;
        await user.save();
        return res.status(202).json({ message: `Rating of anime in your list was successfully changed.` });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: err.message || '500 Server error.' });
    }
}

export const changeepisodes = async (req, res) => {
    try {
        main();
        const {animeId, episodes} = req.body;
        if (!episodes) return res.status(400).json({ message: `Watched episodes cannot be null or empty.` });
        const user = await User.findById(req.userId);
        const index = user.list.findIndex(e => e.anime?.mal_id == animeId);
        console.log(index);
        user.list[index].episodes = episodes;
        await user.save();
        return res.status(202).json({ message: `Amount of watched anime episodes was successfully changed.` });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: err.message || '500 Server error.' });
    }
}