const User = require('../models/user');

async function getAllUsers(_req, res) {
    const users = await User.find({});
    return res.json(users);
}

async function registerNewUser(req, res) {
    const body = req.body;
    if (!body ||
        !body.first_name ||
        !body.last_name ||
        !body.email ||
        !body.gender ||
        !body.job_title) {
        return res.status(400).json({ error: "All fields are required" });
    }
    const newUser = await User.create({
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        gender: body.gender,
        job_title: body.job_title
    })
    console.log(newUser);
    return res.status(201).json({ message: `Successfully registered new user: ${newUser.first_name} (ID: ${newUser._id})` });
}

async function getUser(req, res) {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User NOT FOUND" });
    return res.json(user);
}

async function updateUser(req, res) {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(
        req.params.id,
        updates,
        { new: true, runValidators: true }
    )
    if (!user) {
        return res.status(404).json({ error: "User NOT FOUND" });
    }
    return res.json({
        status: "updated",
        user
    })
}

async function deleteUser(req, res) {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User NOT FOUND" });
    const deletedUser = user;
    res.json({ status: "deleted", deletedUser });
}

module.exports = {
    getAllUsers,
    registerNewUser,
    getUser,
    updateUser,
    deleteUser
};