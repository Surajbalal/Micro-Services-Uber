const mongoose = require('mongoose');
const { type } = require('os');


const rideSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user',
                required: true
    },
    captain:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'captain'
    },
   pickup: {
    address: {
      type: String,
      required: true
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true
      }
    }
  },

  destination: {
    address: {
      type: String,
      required: true
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true
      }
    }
  },
    fare: {
        type: Number,
        required: true
    },
    status:{
        type: String,
        enum: ['pending','accepted','ongoing','completed','cancelled'],
        default: 'pending'
    },
    duration:{
        type:Number //in sec
    },
    distance:{
        type: Number //in mtr
    },
    paymentID:{
        type: String
    },
    orderID:{
        type: String
    },
    signature:{
        type: String
    },
    otp:{
        type : String,
        select: false,
        required: true,
    }
})
module.exports = mongoose.model('rideModel',rideSchema);