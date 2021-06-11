const Parking = artifacts.require('ParkingPlaces')

module.exports = async function(deployer, network, accounts) {
  // Deploy Parking Contract
  await deployer.deploy(Parking)
  const parkingContract = await Parking.deployed()
}
