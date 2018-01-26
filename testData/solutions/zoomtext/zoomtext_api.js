var fs = new ActiveXObject("Scripting.FileSystemObject");

/*
 * Return <word> with whitespaces removed from the front and end
 */
function trim(word){
	return word.replace(/^\s+|\s+$/,"");
}

/*
 * Parse a line of ini settings into its name and value
 * <line>: "<setting_name> = <value>"
 * Returns an object
 *	{
 *		"Key": settings_name,
 *		"Value": value
 *	}
 */
function parse_settings_line(line){
	try{
		words = line.split("=");

		return {
			"Key" : trim(words[0]),
			"Value" : trim(words[1])
		}
	} catch(e) {
		if((e.number & 0xFFFF) == 5007){
			WScript.Echo("This line: \"" + line + "\" is not a valid ini settings");
			WScript.Quit(1);
		}
		else{
			throw(e);
		}
	}
}

/*
 *	Open the ini <filename> and parse the settings into an array of objects
 *	Returns an array of objects
 * 	[
 * 		{
 *			"Key": setting_name,
 *			"Value": value
 *  	},
 *		...
 * 	]
 */
function load_settings_file(filename){
	try{
		var settings_file = fs.OpenTextFile(filename, 1, false);
	} catch(e) {
		if((e.number & 0xFFFF) == 76 || (e.number & 0xFFFF) == 53){
			WScript.Echo("File \"" + filename + "\" is not found.");
			WScript.Quit(1);
		}
		else{
			throw(e);
		}
	}

	settings = new Array();

	while(!settings_file.AtEndOfStream){
		var line = settings_file.ReadLine();
		var parsed_line = parse_settings_line(line);
		settings.push(parsed_line);
	}

	return settings;
}

/*
 * Write the <settings> to <filename>
 * <filename>: String
 * <settings>: Array of String
 *
 * Each element in <settings> is written as a line to <filename>
 */
function write_settings_file(filename, settings){
	var file = fs.CreateTextFile(filename, true, false);

	while(settings.length > 0){
		var line = settings.pop();

		if(line != undefined){
			file.WriteLine(line);
		}
	}

	file.Close();
}

/**
 * Gets the location of the APPLOCALDATA folder.
 */
function zoomtext_folder() {
	var WSHShell = new ActiveXObject("WScript.Shell");
	var Env = WSHShell.Environment("PROCESS");
	var zoomTextFolder = "";
	var enVars = new Enumerator(Env);
	
	for(; !enVars.atEnd(); enVars.moveNext())
	{
		if (enVars.item().indexOf("LOCALAPPDATA") == 0) {
			zoomTextFolder += enVars.item().split("=")[1] + "\\GPII\\ZoomText";
		}
	}
	return zoomTextFolder;
}

var zoomtext_data_folder = zoomtext_folder();

/*
 * Parse the arguments for this script
 * Usage:
 * Return [SETTINGS_FILE_NAME, SCRIPT_TIME_OUT]
 */
function parse_arguments(){
	// Default Values
	var SETTINGS_FILE_NAME = zoomtext_data_folder + "\\zoomtext_settings.ini";
	var SCRIPT_TIME_OUT = 0; // In seconds

	var args = WScript.Arguments;

	if(args.length > 2){
		WScript.Echo("Usage: Wscript zoomtextScript.js <SCRIPT_TIME_OUT> <SETTINGS_FILE_NAME>\n");
		WScript.Echo("<SCRIPT_TIME_OUT>: Timeout in seconds for this script if ZoomText's API is not available");
		WScript.Echo("DEFAULT = 0\n");
		WScript.Echo("<SETTINGS_FILE_NAME>: Path to the ini settings file");
		WScript.Echo("DEFAULT = \"" + SETTINGS_FILE_NAME+ "\"");
		WScript.Quit(1);
	}

	// First argument
	if(args.length >= 1){
		SCRIPT_TIME_OUT = parseInt(args(0));

		if(isNaN(SCRIPT_TIME_OUT)){
			WScript.Echo("<SCRIPT_TIME_OUT> argument is not an integer");
			WScript.Quit(1);
		}
	}

	// Second argument
	if(args.length >= 2){
		SETTINGS_FILE_NAME = args(1);
	}

	return [SETTINGS_FILE_NAME, SCRIPT_TIME_OUT];
}

/*
 * Beginning of the main program
 * Apply the settings from <SETTINGS_FILE_NAME> to ZoomText by using ZoomText's API
 * Then, save the inverted settings to the same file <SETTINGS_FILE_NAME>.
 * By running the inverted settings using this script will restore ZoomText's original settings.
 *
 * Note: This script will terminate after <SCRIPT_TIME_OUT> seconds if ZoomText's API is not available
 * The default value of <SCRIPT_TIME_OUT> is 0 seconds.
 * The default file path for <SETTINGS_FILE_NAME> is
 * ".\\node_modules\\universal\\testData\\solutions\\zoomtext\\zoomtext_settings.ini"
 */

// Get arguments
args = parse_arguments();
// Removed in favor of using GPII data folder
// ==========================================
// var SETTINGS_FILE_NAME = args[0];
// ==========================================
var SCRIPT_TIME_OUT = args[1];
var SETTINGS_FILE_TO_RESTORE = zoomtext_data_folder + "\\zoomtext_settings_restore.ini";

// Obtain settings to applu
var settings_to_apply = load_settings_file(args[0]);

// Access ZoomText's API
var ZT = null;
var begin_time = new Date();

do{
	try{
		ZT = new ActiveXObject("ZoomText.Application");
		break;
	} catch(e) {
		if((e.number & 0xFFFF) == 429){
			// ZoomText's API is not available yet, sleep for 0.5s before checking again
			WScript.Sleep(500);
		}
		else{
			// Some other error
			throw(e);
		}
	}
}
while((new Date()).getTime() - begin_time.getTime() <= SCRIPT_TIME_OUT * 1000)

// Exit if ZoomText's API is not available
if(ZT == null){
	WScript.Echo("Fail to detect ZoomText's API, try again after making sure ZoomText is running.")
	WScript.Quit(1);
}

var valid_monitor_types = {
	Full: "full",
	Overlay: "overlay",
	Lens: "lens",
	Line: "line",
	DockedLeft: "docked left",
	DockedTop: "docked top",
	DockedRight: "docked right",
	DockedBottom: "docked bottom"
};

var supported_voices = {
	Product: {
		Zira: "Microsoft Zira Desktop - English (United States) English, American",
		David: "Microsoft David Desktop - English (United States) English, American"
	},
	Person: {
		Paul: "Paul",
		Kate: "Kate"
	}
};

// These functions apply the settings using ZoomText API if the settings are valid
// Then return the inverted settings that can be used to restore the original settings
map_settings_to_API = {
	"ZT.Enabled":
		function (args){
			var retVal = "ZT.Enabled = " + ZT.Enabled;

			if(args == "true"){
				ZT.Enabled = true;
				return retVal;
			}
			else if(args == "false"){
				ZT.Enabled = false;
				return retVal;
			}
		},

	"ZT.Magnification.PrimaryWindow.Power.Level":
		function (args){
			var retVal = "ZT.Magnification.PrimaryWindow.Power.Level = " + ZT.Magnification.PrimaryWindow.Power.Level;

			if(!isNaN(parseFloat(args))){
				ZT.Magnification.PrimaryWindow.Power.Level = parseFloat(args);
				return retVal;
			}
		},

	"ZT.Speech.CurrentVoice.Voice":
		function (args) {
			for (var product in supported_voices.Product) {
				if (product === args) {
					var person = ZT.Speech.FindVoice(supported_voices.Product[product], undefined);
					ZT.Speech.CurrentVoice = person;

					return "ZT.Speech.CurrentVoice.Voice = " + args;
				}
			}
			for (var person in supported_voices.Person) {
				if (person ===  args) {
					var voice = ZT.Speech.FindVoice(undefined, supported_voices.Person[person]);
					ZT.Speech.CurrentVoice = voice;

					return "ZT.Speech.CurrentVoice.Voice = " + args;
				}
			}

			return "ZT.Speech.CurrentVoice.Voice = " + "Paul";
		},

	"ZT.Speech.CurrentVoice.Rate":
		function (args){
			var retVal = "ZT.Speech.CurrentVoice.Rate = " + ZT.Speech.CurrentVoice.Rate;

			if(!isNaN(parseFloat(args))){
				var wpm = parseFloat(args);
				if (wpm <= 60) {
					ZT.Speech.CurrentVoice.Rate = 0;
				} else if (wpm >= 360) {
					ZT.Speech.CurrentVoice.Rate = 100;
				} else {
					ZT.Speech.CurrentVoice.Rate = (wpm - 60) / 3;
				}
				return retVal;
			}

		},

	"ZT.Speech.CurrentVoice.Volume":
		function (args){
			var retVal = "ZT.Speech.CurrentVoice.Volume = " + ZT.Speech.CurrentVoice.Volume;

			if(!isNaN(parseFloat(args))){
				ZT.Speech.CurrentVoice.Volume = parseFloat(args);
				return retVal;
			}
		},

	"ZT.Magnification.PrimaryWindow.Power.Increase":
		function (args){
			if(args == "true"){
				ZT.Magnification.PrimaryWindow.Power.Increase();
				return "ZT.Magnification.PrimaryWindow.Power.Decrease = true";
			}
		},

	"ZT.Magnification.PrimaryWindow.Type":
		function (args) {
			var reverse_v_m = {};
			for (var key in valid_monitor_types) {
				reverse_v_m[valid_monitor_types[key]] = key;
			}

			var retVal = "ZT.Magnification.PrimaryWindow.Type = " + reverse_v_m[ZT.Magnification.PrimaryWindow.Type];

			for (var type in valid_monitor_types) {
				if (type === args) {
					ZT.Magnification.PrimaryWindow.Type = valid_monitor_types[args];
				}
			}

			return retVal;
		},

	"ZT.Magnification.PrimaryWindow.Power.Decrease":
		function (args){
			if(args == "true"){
				ZT.Magnification.PrimaryWindow.Power.Decrease();
				return "ZT.Magnification.PrimaryWindow.Power.Increase = true";
			}
		},

	"ZT.Mouse.Location.X":
		function (args){
			var retVal = "ZT.Mouse.Location.X = " + ZT.Mouse.Location.X;
			var x = parseFloat(args);

			if(!isNaN(x)){
				var point = ZT.CreateObject("Point");

				if(x >= 0 && x <= ZT.Magnification.PrimaryWindow.Location.Right){
					point.Set(x, ZT.Mouse.Location.Y);
					ZT.Mouse.Location = point;
					ZT.Magnification.PrimaryWindow.ViewToMouse();
					return retVal;
				}
			}
		},

	"ZT.Mouse.Location.Y":
		function (args){
			var retVal = "ZT.Mouse.Location.Y = " + ZT.Mouse.Location.Y;
			var y = parseFloat(args);

			if(!isNaN(y)){
				var point = ZT.CreateObject("Point");

				if(y >= 0 && y <= ZT.Magnification.PrimaryWindow.Location.Bottom){
					point.Set(ZT.Mouse.Location.X, y);
					ZT.Mouse.Location = point;
					ZT.Magnification.PrimaryWindow.ViewToMouse();
					return retVal;
				}
			}
		},

	"ZT.Mouse.Location.XY":
		function (args){
			var retVal = "ZT.Mouse.Location.XY = " + ZT.Mouse.Location.X + "," + ZT.Mouse.Location.Y;

			args = args.split(",");
			var x = parseFloat(args[0]);
			var y = parseFloat(args[1]);

			if(!isNaN(x) && !isNaN(y)){
				var point = ZT.CreateObject("Point");

				if(x >= 0 && x <= ZT.Magnification.PrimaryWindow.Location.Right){
					if(y >= 0 && y <= ZT.Magnification.PrimaryWindow.Location.Bottom){
						point.Set(x, y);
						ZT.Mouse.Location = point;
						ZT.Magnification.PrimaryWindow.ViewToMouse();
						return retVal;
					}
				}
			}
		},

	"ZT.GPII.CenterMouse":
		function (args){
			if(args == "true"){
				var retVal = "ZT.Mouse.Location.XY = " + ZT.Mouse.Location.X + "," + ZT.Mouse.Location.Y;
				var point = ZT.CreateObject("Point");
				var x = ZT.Magnification.PrimaryWindow.Location.Right/2;
				var y = ZT.Magnification.PrimaryWindow.Location.Bottom/2;

				point.Set(x, y);
				ZT.Mouse.Location = point;
				ZT.Magnification.PrimaryWindow.ViewToMouse();
				return retVal;
			}
		}
};

// Applying the settings
var settings_to_restore = new Array();

for (i in settings_to_apply){
	var item = settings_to_apply[i];

	try {
		var setting_func = map_settings_to_API[item.Key];

		if (setting_func !== undefined) {
			settings_to_restore.push(setting_func(item.Value));
		}
	} catch(e) {
		if((e.number & 0xFFFF) == 438){
			// This settings does not exist in ZoomText's API or its mapping is not implemented yet
			continue;
		}
		else{
			throw(e);
		}
	}
}

// Write the settings to be restore to the file
write_settings_file(SETTINGS_FILE_TO_RESTORE, settings_to_restore);


