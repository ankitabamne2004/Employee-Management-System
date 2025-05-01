const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  attachment: { type: String }, // Store the file path
  createdAt: { type: Date, default: Date.now },
  edited:{type:Boolean,default:false}
});

const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = Notification;
