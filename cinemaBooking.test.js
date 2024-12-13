const CinemaBooking = require('./cinemaBooking');

describe("Cinema Booking System", () => {
    let cinema;

    beforeEach(() => {
        cinema = new CinemaBooking();
        cinema.initializeCinema("Inception", 8, 10);
    });

    test("should initialize cinema with correct title and seating map", () => {
        expect(cinema.movieTitle).toBe("Inception");
        expect(cinema.seatingMap.length).toBe(8);
        expect(cinema.seatingMap[0].length).toBe(10);
    });

    test("should throw error if rows or seats per row exceed limits", () => {
        expect(() => cinema.initializeCinema("Inception", 27, 10)).toThrow();
        expect(() => cinema.initializeCinema("Inception", 8, 51)).toThrow();
    });

    test("should book tickets and allocate seats correctly", () => {
        const { bookingId, allocatedSeats } = cinema.bookTickets(4);
        expect(bookingId).toBe("GIC0001");
        expect(allocatedSeats.length).toBe(4);
    });

    test("should throw error if booking exceeds available seats", () => {
        expect(() => cinema.bookTickets(100)).toThrow();
    });

    test("should return available seats correctly", () => {
        cinema.bookTickets(10);
        expect(cinema.getAvailableSeats()).toBe(70);
    });

    test("should retrieve booking details by ID", () => {
        const { bookingId } = cinema.bookTickets(5);
        const bookingDetails = cinema.getBooking(bookingId);
        expect(bookingDetails.length).toBe(5);
    });

    test("should throw error for invalid booking ID", () => {
        expect(() => cinema.getBooking("INVALID")).toThrow();
    });
});