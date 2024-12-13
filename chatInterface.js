// Import readline module for handling input and output via streams
// Import CinemaBooking class for cinema operations
const readline = require('readline');
const CinemaBooking = require('./cinemaBooking');

// Create readline interface for input and output in the console
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> ',
});

// Create a new instance of CinemaBooking
const cinema = new CinemaBooking();

// Function to start the system and prompt user for movie title and seating map
function startSystem() {
    // Prompt user to define movie title and seating map
    rl.question(
        'Welcome to GIC Cinemas! Please define movie title and seating map in [Title] [Row] [SeatsPerRow] format (e.g., Inception 8 10):\n',
        (input) => {
            const [title, rows, seatsPerRow] = input.split(' ');
            try {
                // Initialize cinema with provided title, rows, and seats per row
                cinema.initializeCinema(title, parseInt(rows, 10), parseInt(seatsPerRow, 10));
                console.log(`Cinema initialized for "${title}" with ${rows} rows and ${seatsPerRow} seats per row.`);
                // Proceed to main menu
                mainMenu();
            } catch (error) {
                console.error('Error:', error.message);
                // Restart system if initialization fails
                startSystem();
            }
        }
    );
}

// Main menu function to display options and handle user input
function mainMenu() {
    // Display main menu options
    console.log('\nWelcome to GIC Cinemas');
    console.log('[1] Book tickets');
    console.log('[2] Check bookings');
    console.log('[3] Exit');
    rl.prompt();

    // Handle user input for main menu options
    rl.removeAllListeners('line');
    rl.on('line', (line) => {
        switch (line.trim()) {
            case '1':
                // Proceed to book tickets
                bookTickets();
                break;
            case '2':
                // Proceed to check bookings
                checkBookings();
                break;
            case '3':
                // Exit the system
                rl.close();
                console.log('Thank you for using GIC Cinemas system. Bye!');
                process.exit(0);
                break;
            default:
                console.log('Invalid option. Please select 1, 2, or 3.');
                rl.prompt();
                break;
        }
    });
}

// Function to book tickets
async function bookTickets() {
    // Prompt user to enter number of tickets to book
    rl.question('Enter number of tickets to book, or press Enter to go back to the main menu:\n', async (numInput) => {
        if (numInput === '') return mainMenu();
        const numTickets = parseInt(numInput, 10);
        if (isNaN(numTickets)) {
            console.log('Invalid number. Try again.');
            return bookTickets();
        }
        try {
            // Attempt to book tickets with default allocation
            const { bookingId: initialBookingId, allocatedSeats: initialAllocatedSeats } = cinema.bookTickets(numTickets);
            console.log(`Successfully reserved ${numTickets} tickets. Booking ID: ${initialBookingId}`);
            console.log('Allocated Seats:', initialAllocatedSeats.map(([row, col]) => `${String.fromCharCode(65 + row)}${col + 1}`).join(', '));
            // Display seating map with allocated seats
            displaySeatingMap(initialAllocatedSeats, initialBookingId);

            // Prompt user for custom start position
            const customStart = await new Promise((resolve) =>
                rl.question('Enter Blank for default allocation or Enter new seating position (e.g., B03)\n', resolve)
            );

            if (customStart) {
                // Revert old allocation
                for (const [r, c] of initialAllocatedSeats) {
                    cinema.seatingMap[r][c] = '.';
                }
                delete cinema.bookings[initialBookingId];

                // Allocate from new start position
                const startRow = customStart.charCodeAt(0) - 65;
                const startCol = parseInt(customStart.slice(1), 10) - 1;
                const { bookingId: newBookingId, allocatedSeats: newAllocatedSeats } = cinema.bookTickets(numTickets, startRow, startCol);
                console.log(`Successfully reserved ${numTickets} tickets. Booking ID: ${newBookingId}`);
                console.log('Allocated Seats:', newAllocatedSeats.map(([row, col]) => `${String.fromCharCode(65 + row)}${col + 1}`).join(', '));
                // Display seating map with allocated seats
                displaySeatingMap(newAllocatedSeats, newBookingId);
                return mainMenu();
            } else {
                return mainMenu();
            }

        } catch (error) {
            console.error(error.message);
            return bookTickets();
        }
    });
}

// Function to check existing bookings
function checkBookings() {
    // Prompt user to enter booking ID
    rl.question('Enter your booking ID, or press Enter to go back to the main menu:\n', (input) => {
        if (input === '') return mainMenu();

        try {
            // Retrieve booking details
            const bookingDetails = cinema.getBooking(input);
            console.log(`Booking details for ID ${input}:`);
            console.log('Seats:', bookingDetails.map(([row, col]) => `${String.fromCharCode(65 + row)}${col + 1}`).join(', '));
            // Display seating map with allocated seats
            displaySeatingMap(bookingDetails, input);
            return mainMenu();
        } catch (error) {
            console.error(error.message);
            return checkBookings();
        }
    });
}

// Function to display the seating map
function displaySeatingMap(allocatedSeats) {
    // Display seating map header
    console.log('\nSeating Map:');
    console.log('\n     S C R E E N     ');
    console.log('---' + Array.from({ length: cinema.seatsPerRow }, () => '-').join('-'));

    // We have cinema.seatingMap where 0th index is the top row (A) and so on.
    // We reverse it for display so that the top row (A) is shown at the top.
    const reversedMap = [...cinema.seatingMap].reverse();

    reversedMap.forEach((row, index) => {
        // index 0 in reversedMap is actually the last row in cinema.seatingMap (row index cinema.rows - 1)
        // To get the original row index: originalRow = (cinema.seatingMap.length - 1 - index)
        const originalRow = cinema.seatingMap.length - 1 - index;
        const displayRow = row.map((seat, colIndex) => {
            if (allocatedSeats.some(([r, c]) => r === originalRow && c === colIndex)) {
                // This seat was just allocated in the current booking
                return 'O';
            } else if (seat !== '.') {
                // This seat is already booked in some previous booking
                return '#';
            } else {
                // This seat is available
                return '.';
            }
        });

        const rowLabel = String.fromCharCode(65 + originalRow);
        console.log(`${rowLabel}: ${displayRow.join(' ')}`);
    });

    console.log('   ' + Array.from({ length: cinema.seatsPerRow }, (_, i) => (i + 1).toString().padStart(2, '')).join(' '));
}

// Start the system by calling startSystem function
startSystem();