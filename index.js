// Sends /calm and /focus floats via OSC to Unity
// flags: -a 127.0.0.1 -p 9000 -f (fake mode) -s (silent, no data log)

import { Neurosity } from "@neurosity/sdk";
import { Client } from 'node-osc';
import minimist from "minimist";
import 'dotenv/config';

const args = minimist(process.argv.slice(2));

const remoteAddress = args.a || "127.0.0.1";
const remotePort = Number(args.p || 9000);
const fakeMode = !!args.f;
const silentMode = !!args.s;

console.log(`Using OSC target: ${remoteAddress}:${remotePort}`);

if (fakeMode) { console.log("fake data mode"); } else { console.log("device data mode") };
if (silentMode) { console.log("silent, no data is logged"); } else { console.log("data is logged below") };

const client = new Client(remoteAddress, remotePort);

function sendOsc(address, value, silent, realdata) {

  client.send(
    address,
    Number(value));

  if (!silent) { console.log(`OSC ${realdata ? "device" : "fake"} data: ${address} ${value} $` ); }
}

// -------------------- DATA SOURCES --------------------

function clamp01(x) {
  x = Number(x);
  if (Number.isNaN(x)) return 0;
  return x < 0 ? 0 : x > 1 ? 1 : x;
}

if (fakeMode) {
  // Emit values 10x/second

  setInterval(() => {
    // 0..1 with a little easing
    const calm = Math.max(0, Math.min(1, (Math.sin(Date.now() / 900) + 1) / 2));
    const focus = Math.max(0, Math.min(1, (Math.cos(Date.now() / 1100) + 1) / 2));
    sendOsc("/calm", calm, silentMode, false);
    sendOsc("/focus", focus, silentMode, false);
  }, 100);
} else {

  // const { Neurosity } = require("@neurosity/sdk");
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

  const neurosity = new Neurosity();

  (async () => {
    try {
      await neurosity.login({ email, password });
      console.log("Authenticated. Subscribing to focus/calm …");

      // Focus stream
      neurosity.focus().subscribe((f) => {
        const val = clamp01(f.probability ?? f.value ?? f);
        sendOsc("/focus", val, silentMode, true);
      });

      // Calm stream
      neurosity.calm().subscribe((c) => {
        const val = clamp01(c.probability ?? c.value ?? c);
        sendOsc("/calm", val, silentMode, true);
      });
    } catch (e) {
      console.error("Neurosity error:", e);
      process.exit(1);
    }
  })();
}

["SIGINT", "SIGTERM", "SIGHUP", "SIGQUIT"].forEach((sig) =>
  process.on(sig, () => {
    console.error("\nshutting down:", sig);
    client.close();
    process.exit(1);
  })
);
