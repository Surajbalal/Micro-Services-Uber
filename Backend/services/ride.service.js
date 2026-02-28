const rideModel = require('../models/ride.model');
const { sendMessageToSocketId } = require('../socket');
const mapService = require('./maps.service');
const crypto = require('crypto');

module.exports.generateOtp = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

module.exports.getFare = async (pickup, destination) => {
  if (!pickup || !destination) {
    throw new Error("Pickup and destination are required");
  }

  const destinationTime = await mapService.getDistanceTime(pickup, destination);
console.log(destinationTime);
  const distanceInKm = destinationTime.distance.value / 1000;
  const timeInMin = destinationTime.duration.value / 60;

  const rates = {
    car: { base: 50, perKm: 12, perMin: 2 },
    auto: { base: 30, perKm: 8, perMin: 1.5 },
    motorcycle: { base: 20, perKm: 6, perMin: 1 }
  };

  function calculateFare(rate) {
    return Math.round(
      rate.base +
      distanceInKm * rate.perKm +
      timeInMin * rate.perMin
    );
  }

  return {
    car: calculateFare(rates.car),
    auto: calculateFare(rates.auto),
    motorcycle: calculateFare(rates.motorcycle)
  };
};

module.exports.create = async ({user,pickup,destination,vehicleType,distance,duration})=>{
  console.log("inside create service",pickup,destination)
    if(!user || !pickup || !destination ||!vehicleType || !distance || !duration){
        throw new Error('All fields are required');
    }
    const fare = await this.getFare( pickup.address,
  destination.address);

    const ride = await rideModel.create({
        user,
        pickup,
        destination,
        distance,
        duration,
        fare:fare[vehicleType],
        otp: this.generateOtp(),
    })
    console.log("check is this returning full ride detail or not",ride);
    return ride;
}
module.exports.confirmRide = async (rideId,captainId) =>{
  if(!rideId || !captainId){
    throw new Error('RideId and captainId is required');
  }

  const ride = await rideModel.findOneAndUpdate(
    {_id:rideId},
    {status: 'accepted', captain: captainId},
    { new: true })
    .populate('user')
    .populate('captain').select('+otp');

  // const ride = rideModel.findOne({_id: rideId}).populate('user');

  if(!ride){
    throw new Error('Ride not found');
  }

  return ride;
}
module.exports.startRide = async ({rideId, otp}) =>{
  console.log("Inside functional test 1",);
  if(!rideId || !otp ){
    throw new Error('rideId otp and captain are required ')
  }
  console.log("Inside functional test 2",);
  
  const ride = await rideModel.findOne({_id:rideId})
  .populate('user')
  .populate('captain')
  .select('+otp')
  console.log("Inside functional test 3",);
console.log("this is functional test",ride);
  if(!ride){
    throw new Error('Ride not found');
  }

  if(ride.status !== 'accepted'){
    throw new Error('Ride not accepted')
  }

  if(ride.otp !== otp){
    throw new Error('Invalid otp')
  }
  
  await rideModel.findOneAndUpdate({_id:rideId},
    {status: 'ongoing'}
  )

    sendMessageToSocketId(ride.user.socketId,
      'ride-started',
      ride
    )
 return ride;
}
module.exports.endRide = async ({rideId, captain}) =>{
  if(!rideId){
    throw new Error('RideId is required');
  }

  const ride = await rideModel.findOne({_id: rideId,captain: captain._id})
  .populate('user')
  .populate('captain')
  .select('+otp')

  if(!ride){
    throw new Error('Ride not found')
  }

  if(ride.status !== 'ongoing'){
    throw new Error('Ride not ongoing')
  }

  await rideModel.findOneAndUpdate({_id: rideId},
    {
      status: 'completed'
    })
  return ride;
}