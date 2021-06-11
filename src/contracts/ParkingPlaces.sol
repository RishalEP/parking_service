pragma solidity >=0.4.0 <0.7.0;

contract ParkingPlaces {
    //  Structure of User Information
    struct User {
        string name;
        string password;
        bool isReserved;
        uint256[] bookings;
    }

    // Structure of Booking Information
    struct Bookings {
        uint256 id;
        address userAddress;
        string name;
        bool isApproved;
        bool isRejected;
        bool isPaid;
        uint256 placeId;
        uint256 rating;
        string placeName;
    }

    // Structure of Place Information
    struct Places {
        uint256 id;
        string name;
        uint256 totalSlots;
        uint256 remainingSlots;
        uint256[] bookings;
    }

    mapping(address => User) public users; // Users are mapped with the Corresponding Ethereum Address
    mapping(uint256 => Bookings) public bookings; // Bookings are mapped with the Booking Id
    mapping(uint256 => Places) public places; // Places are mapped with the Place Id
    address[] public userAccounts; // Registered users address are stored in an array
    address public owner; // Owner address to be keeped here.
    uint256 public totalBooking = 0; // Total Number of Bookings till date - initialized to zero
    uint256 public totalPlaces = 0; // Total Number of Places till date - initialized to zero

    event Register(address indexed _from, bool _success);
    event Book(address indexed _from, uint256 _id, bool _success);
    event Approved(
        address indexed _user,
        uint256 _id,
        uint256 _placeId,
        bool _success
    );
    event Leave(address indexed _user, uint256 _id, bool _success);
    event Withdraw(address indexed _user, bool _success);
    event RegisterPlace(address indexed _from, uint256 _id, bool _success);

    constructor() public {
        owner = msg.sender;

        // totalSlots = slotsAvailable;
        // remainingSlots = slotsAvailable;

        setPlace("Edappaly", 5);
        setPlace("Aluva", 5);
        setPlace("Cochin", 5);
        setPlace("Fort-Kochi", 5);
        setPlace("Kaloor", 5);
        setPlace("Palarivattom", 5);
    }

    // Only owner of the contract can initiate the transaction using this modifier
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner Can Do the Action");
        _;
    }

    // Minimum Parking Fee is set as 10 wei by default.
    modifier hasValue() {
        require(msg.value >= 10 wei, "10 wei Required as Parking Fee");
        _;
    }

    // Validating a booking if it exists or not
    modifier validBooking(uint256 bookingNumber) {
        require(bookingNumber <= totalBooking, "Could not find the booking");
        _;
    }

    modifier validUser(uint256 bookingNumber) {
        // Validating a user if the booking done by that user or not
        require(
            bookings[bookingNumber].userAddress == msg.sender,
            "Only the Booked user can initiate the action"
        );
        _;
    }

    modifier hasSlots(uint256 id) {
        // Verifying wether the slots available or not
        require(places[id].remainingSlots >= 1, "No Slots Available");
        _;
    }

    // Verifying if a user exists or not
    function existsUser(address user) public view returns (bool exists) {
        for (uint256 i = 0; i < userAccounts.length; i++) {
            if (userAccounts[i] == user) return true;
        }
        return false;
    }

    // Registration of  a new user. To be initiated by the user
    function setPlace(string memory _name, uint256 _maxSlots) public onlyOwner {
        totalPlaces += 1;
        Places storage instructor = places[totalPlaces];

        instructor.id = totalPlaces;
        instructor.name = _name;
        instructor.totalSlots = _maxSlots;
        instructor.remainingSlots = _maxSlots;

        emit RegisterPlace(msg.sender, totalPlaces, true);
    }

    // Registration of  a new user. To be initiated by the user
    function setUser(string memory _name, string memory _password) public {
        require(msg.sender != owner, "Admin Could not onboard as a user");
        if (!existsUser(msg.sender)) {
            User storage instructor = users[msg.sender];

            instructor.name = _name;
            instructor.password = _password;
            instructor.isReserved = false;

            userAccounts.push(msg.sender);
            emit Register(msg.sender, true);
        } else revert("User Already Exists");
    }

    // View functionality for the Registered users as of now.
    function registeredUsers() public view returns (address[] memory) {
        return userAccounts;
    }

    // View functionality for the Registered users as of now.
    function userInfo(address usersAddress)
        public
        view
        returns (
            string memory name,
            bool isReserved,
            uint256[] memory userBookings
        )
    {
        return (
            users[usersAddress].name,
            users[usersAddress].isReserved,
            users[usersAddress].bookings
        );
    }

    // View functionality for the Registered users as of now.
    function placeInfo(uint256 id)
        public
        view
        returns (
            uint256 _id,
            string memory _name,
            uint256 _total,
            uint256 _remaining,
            uint256[] memory _userBookings
        )
    {
        return (
            places[id].id,
            places[id].name,
            places[id].totalSlots,
            places[id].remainingSlots,
            places[id].bookings
        );
    }

    // View functionality for all the booking-related as of now.
    function bookInfo(uint256 id)
        public
        view
        returns (
            string memory _name,
            uint256 _remaining,
            uint256 _rating,
            string memory _placeName,
            bool _isApproved,
            bool _isRejected
        )
    {
        uint256 placeId = bookings[id].placeId;
        return (
            bookings[id].name,
            places[placeId].remainingSlots,
            bookings[id].rating,
            places[placeId].name,
            bookings[id].isApproved,
            bookings[id].isRejected
        );
    }

    // Function to book a new slot. To be initiated by a registered user
    function bookSlot(uint256 placeId) public hasSlots(placeId) returns (bool) {
        if (existsUser(msg.sender)) {
            require(
                users[msg.sender].isReserved == false,
                "Already on a Booking"
            );
            totalBooking += 1;
            Bookings storage initiate = bookings[totalBooking];

            initiate.id = totalBooking;
            initiate.userAddress = msg.sender;
            initiate.name = users[msg.sender].name;
            initiate.isApproved = false;
            initiate.isRejected = false;
            initiate.isPaid = false;
            initiate.placeId = placeId;
            initiate.rating = 0;
            initiate.placeName = places[placeId].name;

            places[placeId].bookings.push(totalBooking);

            users[msg.sender].isReserved = true;
            users[msg.sender].bookings.push(totalBooking);

            emit Book(msg.sender, totalBooking, true);

            return true;
        } else revert("User Not Exists");
    }

    // Function to Approve any pending bookings. To be initiated by the owner
    function approveSlot(uint256 bookingId)
        public
        validBooking(bookingId)
        onlyOwner
        returns (bool success)
    {
        if (!bookings[bookingId].isApproved) {
            uint256 placeId = bookings[bookingId].placeId;
            require(places[placeId].remainingSlots >= 1, "No Slots Available");

            bookings[bookingId].isApproved = true;
            places[placeId].remainingSlots--;
            emit Approved(msg.sender, bookingId, placeId, true);
            return true;
        } else revert("Booking Already Approved");
    }

    // Function to Reject any pending bookings. To be initiated by the owner
    function rejectApproval(uint256 bookingId)
        public
        validBooking(bookingId)
        onlyOwner
        returns (bool success)
    {
        if (
            !bookings[bookingId].isApproved && !bookings[bookingId].isRejected
        ) {
            uint256 placeId = bookings[bookingId].placeId;
            bookings[bookingId].isRejected = true;
            address user = bookings[bookingId].userAddress;
            users[user].isReserved = false;
            emit Approved(msg.sender, bookingId, placeId, false);
            return true;
        } else revert("Booking Already Approved");
    }

    // Function to be executed at the time when a user leaves the parking premises.
    // The user needs to be payed for the service provided by the owner.
    function leaveParking(uint256 _bookingId, uint256 _rating)
        public
        payable
        hasValue
        validBooking(_bookingId)
        validUser(_bookingId)
        returns (bool success)
    {
        if (
            bookings[_bookingId].isApproved &&
            bookings[_bookingId].isPaid == false
        ) {
            uint256 placeId = bookings[_bookingId].placeId;
            bookings[_bookingId].isPaid = true;
            bookings[_bookingId].rating = _rating;
            address user = bookings[_bookingId].userAddress;
            users[user].isReserved = false;
            places[placeId].remainingSlots++;
            emit Leave(msg.sender, _bookingId, true);
            return true;
        } else revert("Not Suppose to leave now");
    }

    //Withdraw the ether from contract address to owner address .
    function withdrawAll() public onlyOwner returns (bool success) {
        msg.sender.transfer(address(this).balance);
        emit Withdraw(msg.sender, true);
        return true;
    }
}
