const express = require('express');
const userRouter = express.Router();
const { getAllUsers, registerNewUser, getUser, updateUser, deleteUser } = require('../controllers/user')

userRouter.route('/')
    .get(getAllUsers)
    .post(registerNewUser);

userRouter.route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);

module.exports = userRouter;