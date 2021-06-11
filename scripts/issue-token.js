const Parking = artifacts.require('ParkingPlaces')

module.exports = async function(callback) {
  let parking = await Parking.deployed()
  // Code goes here...
  console.log("Contract Deployed")
  callback()
}
