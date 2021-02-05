function Decoder(bytes, port) {
	// TO-DO: 
  // > verify checksum
  // > add other message types
	
	//helper function to convert lat,long to double floats
	function bytesToFloat(bytes) {
		var buffer = new ArrayBuffer(8);
		var view = new Uint8Array(buffer,0,8);
		var float = new Float64Array(buffer,0,1);
		view[0] = bytes[0];
		view[1] = bytes[1];
		view[2] = bytes[2];
		view[3] = bytes[3];
		view[4] = bytes[4];
		view[5] = bytes[5];
		view[6] = bytes[6];
		view[7] = bytes[7];
		return float[0];
	}
	
	//decode message type
	var messageType = bytes[4];

	//output decoded message depending on the time
	switch(messageType){
		case 0xF6: //power level message
			return {
				message:"power",
				batV: (bytes[6] << 8 | bytes[5] * 20) + "%",
				steps: bytes[10] << 24 | bytes[9] << 16 | bytes[8] << 8 | bytes[7]
			};
		case 0x03: //location uplink
			var lon = bytesToFloat(bytes.slice(5,13));
			var lat = bytesToFloat(bytes.slice(13,21));
			return {
				message:"gps",
				longitude: (String.fromCharCode(bytes[22]) == 'E')?lon:-1*lon,
				latitude: (String.fromCharCode(bytes[21]) == 'N')?lat:-1*lat
			};
		case 0xC7: //uplink when no gpd fix
			return {message:"no_gps"};
		default:
			return {message:"unknown"};
	}
}
