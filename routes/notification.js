const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification'); 
const multer = require('multer');

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname); 
    }
  });
  
  const upload = multer({ storage });
  
  router.post('/notifications', upload.single('attachment'), async (req, res) => {
    try {
        console.log('req.body:', req.body);
        console.log('req.file:', req.file);

        const { title, message } = req.body;
        const attachment = req.file ? req.file.path : null;

        const newNotification = new Notification({ title, message, attachment });
        await newNotification.save();
        res.status(201).json(newNotification);
    } catch (error) {
        console.error('Error saving notification:', error);
        res.status(500).json({ error: 'Failed to save notification' });
    }
});

// GET all notifications
router.get('/notifications', async (req, res) => {
    try {
        const notifications = await Notification.find();
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});

// PUT to edit a notification
router.put('/notifications/:id', async (req, res) => {
    try {
        const { title, message } = req.body;
        const updatedNotification = await Notification.findByIdAndUpdate(
            req.params.id,
            { title, message,edited:true},
            { new: true }
        );
        res.json(updatedNotification);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update notification' });
    }
});

// DELETE a notification
router.delete('/notifications/:id', async (req, res) => {
    // console.log('Deleting ID:', req.params.id);
    try {
        await Notification.findByIdAndDelete(req.params.id);
        res.json({ message: 'Notification deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete notification' });
    }
});

module.exports = router;