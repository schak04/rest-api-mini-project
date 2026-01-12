const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 8000;
app.use(express.urlencoded({ extended: false }));

// DB Connection
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/rest-api-mini-project-db');
        console.log("MongoDB connected");
    }
    catch(err) {
        console.error("Error connecting DB:", err);
    }
}
connectDB();

// Schema
const UserSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    gender: { type: String, required: true },
    job_title: { type: String, required: true }
}, {timestamps: true});
const User = mongoose.model('User', UserSchema);

// Routes
app.get('/users', async (_req, res) => {
    const users = await User.find({});
    const html = `${users
                    .map(user => 
                        `<li>Name: ${user.first_name} ${user.last_name} | Job Title: ${user.job_title}</li>`)
                    .join("")}`
    res.send(html);
})

// REST API points
app.get('/api/users', async (req, res) => {
    const users = await User.find({});
    return res.json(users);
})
app.post('/api/users', async (req, res) => {
    const body = req.body;
    if (!body ||
        !body.first_name ||
        !body.last_name ||
        !body.email ||
        !body.gender ||
        !body.job_title) {
        return res.status(400).json({error: "All fields are required"});
    }
    const newUser = await User.create({
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        gender: body.gender,
        job_title: body.job_title
    })
    console.log(newUser);
    return res.status(201).json({message: `Successfully registered new user: ${newUser.first_name}`});
})
app.route('/api/users/:id')
    .get(async (req, res) => {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "User NOT FOUND" });
        return res.json(user);
    })
    .patch(async (req, res) => {
        const updates = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            updates,
            {new: true, runValidators: true}
        )
        if (!user) {
            return res.status(404).json({error: "User NOT FOUND"});
        }
        return res.json({
            status: "user updated",
            user
        })
    })
    .delete(async (req, res) => {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ error: "User NOT FOUND" });
        const deletedUser = user;
        res.json({ status: "deleted", deletedUser });
    });

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    console.log(`http://localhost:${port}/users`);
    console.log(`http://localhost:${port}/api/users`);
});