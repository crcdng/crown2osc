# Neurosity Crown Focus 2 OSC

Script adapted by Team Sensvyra for Cyberdelic Hackathon, c-base, Nov 8-9 2025 

crcdng Moritz Federlein Paula Ducatenzeiler Metanoic Vision
Anja Frank Güngör Kocak Sophie Adler Jan Sladecko

This project connects to the Neurosity Crown device, retrieves focus data, and sends it via OSC (Open Sound Control) to a specified address.

sensvyra version

fake data

```
npm start -- -f -a 127.0.0.1 -p 9000   
```

real data (requires Neurosity developer credentials in file `.env`)

```
npm start -- -a 127.0.0.1 -p 9000   
```

- it is now using the latest Neurosity SDK (v 7)
- for this it was necessary to swith from UMD to ES modules

## License

This project is licensed under the MIT License.
