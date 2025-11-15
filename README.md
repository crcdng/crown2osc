# Neurosity Crown 2 OSC

Script adapted by Team Sensvyra for Cyberdelic Hackathon, c-base, Nov 8-9 2025 

crcdng Moritz Federlein Paula Ducatenzeiler Metanoic Vision
Anja Frank Güngör Kocak Sophie Adler Jan Sladecko

This project connects to the [Neurosity Crown](https://neurosity.co/) device, retrieves focus data, and sends it via OSC (Open Sound Control) to a specified address.

sensvyra version

```
npm start -- -f -s -a 127.0.0.1 -p 9000   
```

-a target address (default: 127.0.0.1)   
-p target port (default: 9000)    
-s silent (no logging of data, default: logging)    
-f fake data (default: device data) 

receiving device data requires Neurosity developer credentials in file `.env`:     
DEVICE_ID="\<YOUR DEVICE ID\>"    
EMAIL="\<YOUR NEUROSITY EMAIL\>"      
PASSWORD="\<YOUR NEUROSITY PASSWORD\>"    

CTRL-C to stop

## Updates

- adding various command line switches for convenience
- the script is now using the latest Neurosity SDK (v 7)
- for this it was necessary to switch from UMD to ES modules

## License

This project is licensed under the MIT License.
