var fs = new ActiveXObject("Scripting.FileSystemObject");
var Wshell = WScript.CreateObject("WScript.Shell");

// Function to remove whitespaces at the beginning and end of a string
function trim(word){
	return word.replace(/^\s+|\s+$/,"");
}

// Set up array of settings
var allSettings = [
	"ZT.Magnification.PrimaryWindow.Power.Level",
	"ZT.Speech.CurrentVoice.Rate",
	"ZT.Speech.CurrentVoice.Volume",
	"ZT.Enabled"
]

// Check if ZoomText has created it's API, if not, keep looping until ZoomText has created it's API
// Script will be terminated after 10 minutes (600000ms) if ZoomText API is not created
var defTime = new Date(); // beginning time 
var exist = false;

while(!exist){
	try{
		// check the elapse time of this script
		var currTime = new Date();
		if((currTime.getTime() - defTime.getTime()) >= 600000){
			WScript.Quit(1);
		}

		var ZT = new ActiveXObject("Zoomtext.Application");
		exist = true;
	} catch(e){
		if((e.number & 0xFFFF) == 429){
		}
		else{
			WScript.Echo(e.number & 0xFFFF + "\n" + e.message + "\n" + e.name);
			exist = true;
		}
	}
}

// Open the settings file
var file = fs.OpenTextFile("..\\node_modules\\universal\\testData\\solutions\\zoomtext\\zoomtextSettings.ini");

// Read the file and apply the settings to ZoomText

while(!file.AtEndOfStream){
	var arr = file.ReadLine().split("=");
	var key = trim(arr[0]);
	var value = trim(arr[1]);
	for(var i = 0, j = allSettings.length; i < j; i++){
		if(key == allSettings[i]){
			eval(key + " =" + value);
			break;
		}
	}
}
