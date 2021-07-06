const express = require('express');
const router = express.Router();
const Contact = require('../models/contact');
//Getting all contacts
router.get('/', async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.json(contacts);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
})
router.post('/', async (req, res) => {
    const contact = new Contact({
        sex: req.body.sex,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        streetAndNumber: req.body.streetAndNumber,
        zipCode: req.body.zipCode,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
        private: req.body.private,
        geoCoord: req.body.geoCoord,
        email: req.body.email,
        owner: req.body.owner,
    })
    try {
        const newContact = await contact.save();
        console.log("new contact created");
        res.status(201).json(newContact._id);
    } catch (err) {
        res.status(400).json(err.message);
    }
})

//Delete
router.delete('/:id', getContact, async (req, res) => {
    try {
        await res.contact.remove()
        res.status(204)
    } catch (err) {
        res.status(500).json({message: err})
    }
})

//Update
router.put('/:id', getContact, async (req, res) => {

    try {
      const updatedContact = await res.contact.save()
      res.json(updatedcontact)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  })

async function getContact(req, res, next){
    let contact;
    try {
        contact = await Contact.findById(req.params.id);
        if (contact == null) {
            return res.status(404).json({message: 'Cannot find Contact'});
        }
    } catch(err) {
        return res.status(500).json({message: err.message})
    }

    res.contact = contact;
    next();
}

module.exports = router;