const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { type } = require('os');


const captainSchema = new mongoose.Schema({
    'fullName':{
        'firstName':{
            type: String,
            require: true,
            minlength:[3,'First name must be at least 3 character']
        },
        'lastName':{
            type: String,
            require: false,
        }
    },
    'email':{
        type: String,
        require: true,
        unique: true
    },
    'password':{
        type:String,
        require: true,
        select: false,
        minlength: [7,'Password must be at least 7 character']
    },
    'socketId':{
        type: String,
        
    },
    'status':{
        type: String,
        enum: ['active','inactive'],
        default: 'inactive',
    },
    'vehicle':{
        'color':{
            type: String,
            require : true,
            minlength: [3, 'Color must be at least 3 character']
        },
        'plate':{
            type: String,
            require: true,
             minlength: [3, 'Plate must be at least 3 character']
        },
        'capacity':{
            type: String,
            require:true,
            minlength: [1, 'capacity must be at 1']
        },
        'vehicleType':{
            type: String,
            enum: ['motorcycle', 'car', 'auto'],
            require: true
        },
        'location':{
            'lat':{
                type: Number
            },
            'lng':{
                type: Number
            }
        }
    },
    "location": {
       
  type: {
    type: String,
    enum: ["Point"],
    default: "Point"
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true
  }
}

}) 

captainSchema.methods.genrateToken =  function(){
    const token =  jwt.sign({_id:this._id},process.env.JWT_SECRET,{expiresIn: '24h'});
    return token;
}
captainSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password);
 
}
captainSchema.statics.hashPassword = async function(password){
   return await bcrypt.hash(password,10);
    
}
const captainModel =  mongoose.model('captain', captainSchema);
module.exports = captainModel;