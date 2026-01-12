const express = require('express');
const fs = require('fs');
const users = require('./MOCK_DATA.json');

const app = express();
const port = process.env.PORT || 8000;

app.use(express.urlencoded({ extended: false }));

// Routes

app.get('/users', (req, res) => {
    const html = `
        ${users.map(user => `<li>Name: ${user.first_name} ${user.last_name}<br>Job Title: ${user.job_title}</li>`).join("")};
    `
    res.send(html);
})

// REST API points

app.get('/api/users', (req, res) => {
    return res.json(users);
})

app.post('/api/users', (req, res) => {
    const body = req.body;
    users.push({ ...body, id: users.length + 1 });
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {
        return res.json({ status: "new user created", id: users.length });
    });
})

app.route('/api/users/:id')
    .get((req, res) => {
        const id = Number(req.params.id)
        const user = users.find(u => u.id === id);
        if (!user) return res.status(404).json({ error: "User NOT FOUND" });
        return res.json(user);
    })
    .patch((req, res) => {
        const id = Number(req.params.id);
        const body = req.body;
        const user = users.find(u => u.id === id);
        if (!user) return res.status(404).json({ error: "User NOT FOUND" });
        Object.assign(user, body);
        fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), () => {
            res.json({ status: "user updated", user });
        });
    })
    .delete((req, res) => {
        const id = Number(req.params.id);
        const index = users.findIndex(u => u.id === id);
        if (index === -1) return res.status(404).json({ error: "User NOT FOUND" });
        const deletedUser = users.splice(index, 1);
        fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), () => {
            res.json({ status: "deleted", user: deletedUser[0] });
        });
    });

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    console.log(`http://localhost:${port}/users`);
    console.log(`http://localhost:${port}/api/users`);
})