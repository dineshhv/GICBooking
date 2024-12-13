// Class definition for CinemaBooking
// Manages movie title, seating map, and bookings
class CinemaBooking {
    // Constructor to initialize cinema booking properties
    constructor() {
        this.movieTitle = '';
        this.rows = 0;
        this.seatsPerRow = 0;
        this.seatingMap = [];
        this.bookings = {};
        this.bookingCounter = 0;
    }

    // Initialize cinema with title, rows, and seats per row
    // Throws error if rows or seats per row exceed limits
    initializeCinema(title, rows, seatsPerRow) {
        if (rows > 26 || seatsPerRow > 50) {
            throw new Error("Rows cannot exceed 26 and seats per row cannot exceed 50.");
        }
        this.movieTitle = title;
        this.rows = rows;
        this.seatsPerRow = seatsPerRow;
        this.seatingMap = Array.from({ length: rows }, () => Array(seatsPerRow).fill('.'));
    }

    // Book tickets and allocate seats
    // Generates a booking ID and stores allocated seats
    bookTickets(numTickets, startRow = null, startCol = null) {
        if (numTickets > this.getAvailableSeats()) {
            const availableSeats = this.getAvailableSeats();
            throw new Error(`Sorry, there are only ${availableSeats} seats available.`);
        }

        const allocatedSeats = this.allocateSeats(numTickets, startRow, startCol);
        this.bookingCounter++;
        const bookingId = `GIC${String(this.bookingCounter).padStart(4, '0')}`;
        this.bookings[bookingId] = allocatedSeats;
        return { bookingId, allocatedSeats };
    }

    // Calculate available seats
    // Returns the count of unoccupied seats
    getAvailableSeats() {
        return this.seatingMap.flat().filter(seat => seat === '.').length;
    }

    // Allocate seats based on number of tickets
    // Supports custom allocation starting from specified row and column
    allocateSeats(numTickets, startRow = null, startCol = null) {
        const seats = [];
        if (startRow !== null && startCol !== null) {
            // Custom allocation logic
            for (let i = startRow; i < this.rows; i++) {
                for (let j = startCol; j < this.seatsPerRow; j++) {
                    if (this.seatingMap[i][j] === '.') {
                        seats.push([i, j]);
                        this.seatingMap[i][j] = 'O';
                        if (seats.length === numTickets) return seats;
                    }
                }
                startCol = 0; // Reset column for the next row
            }
            // If not enough seats are found in the specified row, continue searching in other rows
            for (let i = 0; i < startRow; i++) {
                for (let j = 0; j < this.seatsPerRow; j++) {
                    if (this.seatingMap[i][j] === '.') {
                        seats.push([i, j]);
                        this.seatingMap[i][j] = 'O';
                        if (seats.length === numTickets) return seats;
                    }
                }
            }
        } else {
            // Default allocation logic (from top row A downwards)
            const middleCol = Math.floor(this.seatsPerRow / 2);
            for (let i = 0; i < this.rows; i++) {
                for (let j = middleCol; j < this.seatsPerRow; j++) {
                    if (this.seatingMap[i][j] === '.') {
                        seats.push([i, j]);
                        this.seatingMap[i][j] = 'O';
                        if (seats.length === numTickets) return seats;
                    }
                }
                for (let j = middleCol - 1; j >= 0; j--) {
                    if (this.seatingMap[i][j] === '.') {
                        seats.push([i, j]);
                        this.seatingMap[i][j] = 'O';
                        if (seats.length === numTickets) return seats;
                    }
                }
            }
        }
        return seats;
    }

    // Retrieve booking details by booking ID
    // Throws error if booking ID not found
    getBooking(bookingId) {
        if (!this.bookings[bookingId]) {
            throw new Error("Booking ID not found.");
        }
        return this.bookings[bookingId];
    }
}

// Export CinemaBooking class for external use
module.exports = CinemaBooking;