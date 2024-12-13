# GIC Cinema Booking System

This project is a command-line application for managing cinema bookings. It allows users to initialize a cinema, book tickets, and check existing bookings.

## Prerequisites

- Node.js (latest version recommended)
- npm (Node Package Manager)
- Docker (optional, for running in a container)

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd GICBooking
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Normal Run

To run the application normally using Node.js:

1. Start the application:

   ```bash
   npm start
   ```

2. Follow the on-screen prompts to interact with the cinema booking system.

### Docker Run

To run the application using Docker:

1. Build the Docker image:

   ```bash
   docker build -t gic-cinema-booking .
   ```

2. Run the Docker container:

   ```bash
   docker run -it --rm gic-cinema-booking
   ```

3. Follow the on-screen prompts to interact with the cinema booking system.

## Usage

- Initialize the cinema by providing a movie title, number of rows, and seats per row.
- Book tickets by selecting the number of tickets and optionally specifying a starting seat.
- Check bookings using the booking ID provided after a successful booking.

## How to Use the Program

1. **Initialize the Cinema**:

   - When prompted, enter the movie title, number of rows, and seats per row in the format `[Title] [Rows] [SeatsPerRow]` (e.g., `Inception 8 10`).
   - The system will confirm the initialization with the provided details.

2. **Book Tickets**:

   - Select option `1` from the main menu to book tickets.
   - Enter the number of tickets you wish to book.
   - Optionally, specify a starting seat position (e.g., `B03`) or leave it blank for default allocation.
   - The system will allocate seats and provide a booking ID.

3. **Check Bookings**:

   - Select option `2` from the main menu to check existing bookings.
   - Enter your booking ID to view the details of your booking.

4. **Exit the System**:
   - Select option `3` from the main menu to exit the application.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
