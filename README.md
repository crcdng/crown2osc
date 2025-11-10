# Neurosity Crown Focus 2 OSC

Script adapted by Team Sensvyra for Cyberdelic Hackathon, c-base, Nov 8-9 2025 

This project connects to the Neurosity Crown device, retrieves focus data, and sends it via OSC (Open Sound Control) to a specified address.

## Prerequisites

- Node.js installed on your machine.
- An account with Neurosity and access to a Neurosity Crown device.
- The device ID for your Neurosity Crown.

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd Crown2OSC
   ```

2. Install the required dependencies:
   ```
   npm install
   ```

## Configuration

Before running the script, ensure you have the following configurations set in `.env`:

DEVICE_ID="..."
EMAIL="..."
PASSWORD="..."

Replace dots with info.

## Running the Script

To start the connection to the Neurosity Crown device and begin receiving focus data, run the following command:

```
node index.js
```

## Usage

Once the script is running, it will log in to the Neurosity device and start sending focus data via OSC to the specified address. You can monitor the output in your terminal.

Address: /focus/probability

## License

This project is licensed under the MIT License.
