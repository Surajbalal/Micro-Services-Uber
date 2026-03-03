const  axios  = require("axios");
const { error } = require("console");

const { publishToQueue } = require("./rabbit");


const apiKey = process.env.GOOGLE_MAPS_API;

module.exports.getAddressCoordinates = async(address) => {
  try {
    const url = "https://maps.googleapis.com/maps/api/geocode/json";

    const response = await axios.get(url, {
      params: {
        address: address,
        key: apiKey,
      },
    });
    if (response.data.status !== "OK") {
      throw new Error(response.data.status);
    }

    const location = response.data.results[0].geometry.location;

    return {
      lat: location.lat,
      lng: location.lng,
    };

  } catch (error) {
    console.error("Error fetching coordinates:", error.message);


    throw new Error("Unable to fetch coordinates for this address");
  }
}
module.exports.getDistanceTime = async (origin, destination)=> {
   const url = "https://maps.googleapis.com/maps/api/distancematrix/json";

const params = {
  origins: origin,
  destinations: destination,
  key: apiKey
}

  try {
    const response = await axios.get(url, { params });
   const data = response.data;


    if (response.status !== 200) {
      throw new Error("Request failed");
    }
    const element = response.data.rows[0].elements[0];

    if (response.data.status !== "OK" || element.status !== "OK") {
      throw new Error("Invalid origin or destination");
    }

    return element;
  } catch (error) {
    console.error("Service error:", error.message);
    throw error; 
  }
}
module.exports.getAutoCompleteSuggestions = async(input)=>{
  if(!input){
    throw new Error('Input is required');
  }
  try {
    const url = "https://maps.googleapis.com/maps/api/place/autocomplete/json";

    const response = await axios.get(url, {
      params: {
        input: input,
        key: apiKey,
      },
    });

    if(response.data.status != 'OK'){
      throw new Error('Unable to fetch suggestions')
    }

    return response.data.predictions;
  } catch (error) {
    console.error("Error fetching address suggestions:", error.message);
    throw error
  }
}
module.exports.getCaptainInTheRadius = async (lat, lng, radius) => {
  try {

    console.log("Parameters received:", lat, lng, radius);

    // const captains = await captainModel.find({
    //   location: {
    //     $geoWithin: {
    //       $centerSphere: [[lng, lat], radius / 6371]
    //     }
    //   }
    // });
    const captains = await publishToQueue('get-captainInTheRadius',{lat, lng, radius})

    console.log("Captains inside radius:", captains);

    return captains;

  } catch (error) {
    console.error("Error in getCaptainInTheRadius:", error);
    throw error;
  }
};




