const { Neurosity } = require("@neurosity/sdk");
require("dotenv").config();
const osc = require("osc"); // Add this line

const deviceId = process.env.DEVICE_ID || "";
const email = process.env.EMAIL || "";
const password = process.env.PASSWORD || "";

const verifyEnvs = (email, password, deviceId) => {
  const invalidEnv = (env) => {
    return env === "";
  };
  if (invalidEnv(email) || invalidEnv(password) || invalidEnv(deviceId)) {
    console.error(
      "Please verify deviceId, email and password are in .env file, quitting..."
    );
    process.exit(0);
  }
};
verifyEnvs(email, password, deviceId);
console.log(`${email} attempting to authenticate with ${deviceId}`);

const neurosity = new Neurosity({
  deviceId,
});

const udpPort = new osc.UDPPort({
  localAddress: "0.0.0.0",
  localPort: 0, 
  remoteAddress: "127.0.0.1", // default
  remotePort: 8000,
});
udpPort.open();

const sendFakeOscData = (port) => {
  setInterval(() => {
    const calmRandomValue = Math.random(); 
    const focusRandomValue = Math.random(); 
    port.send({
      address: "/calm",
      args: [
        {
          type: "f",
          value: calmRandomValue, 
        },
      ],
    });
    port.send({
      address: "/focus",
      args: [
        {
          type: "f",
          value: focusRandomValue, 
        },
      ],
    });
    console.log("OSC data sent:", calmRandomValue);
    console.log("OSC data sent:", focusRandomValue);
  }, 50); // 50 ms interval
};

const main = async () => {
  
  await neurosity
    .login({
      email,
      password,
    })
    .catch((error) => {
      console.log(error);
      throw new Error(error);
    });
  console.log("Logged in");

  neurosity.calm().subscribe((calm) => {
    console.log("calm data:", calm);
    udpPort.send({
      address: "/calm",
      args: [
        {
          type: "f",
          value: calm.probability,
        },
        // ,
        // {
        //   type: "f",
        //   value: calm.timestamp
        // }
      ],
    });
  });

  neurosity.focus().subscribe((focus) => {
    console.log("focus data:", focus);
    udpPort.send({
      address: "/focus",
      args: [
        {
          type: "f",
          value: focus.probability,
        },
        // ,
        // {
        //   type: "f",
        //   value: focus.timestamp
        // }
      ],
    });
  });

};

const args = process.argv.slice(2); // Get arguments after "node <script>"

if (args.includes("-a")) {
  const index = args.indexOf("-a");
  if (index !== -1 && args[index + 1]) {
    ipAddress = args[index + 1]; // Extract the IP address after "-a"
    console.log(`Using custom IP address: ${ipAddress}`);
    udpPort.options.remoteAddress = ipAddress;
  } else {
    console.error("Error: No IP address provided after '-a'.");
    process.exit(1);
  }
}

if (args.includes("-f")) {
  console.log("Fake data mode");
  sendFakeOscData(udpPort); // Call the function to send fake OSC data
} else {
  console.log("Real data mode");
  main(); // Call the main function for normal operation
}
