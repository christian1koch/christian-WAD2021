const express = require('express');
const router = express.Router();
const User = require('../models/user');
//Getting all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
})
router.post('/', async (req, res) => {
    try {
        const users = await User.find();
        for(let i = 0; i < users.length; i++){
            
            if (users[i].username == req.body.username && users[i].password == req.body.password){
                res.status(200);
                return res.json(users[i]);
                
            }
        }
        res.status(401).json({message: "Unauthorized"});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
})
//Getting one

module.exports = router;