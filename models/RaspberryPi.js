const mongoose = require('mongoose') ;

const carSchema = new mongoose.Schema(
{
  licensePlate:
  {
      type : String,
      allowNull : false
  },
  userLocation :
  {
      type : String,
      allowNull : false
  },
  tripId:
  {
      type: String,
      required: false
  }
});

const RaspberryPi = mongoose.model('RaspberryPi', carSchema);

module.exports = RaspberryPi;