// Format for settings: settings = value;arguments
// settings: settings that need to be applied
// value: value for the settings, if value is "executeFunction", execute the settings as a function
// arguments: arguments for the function, if value == "executeFunction"

// Check for arguments
var args = WScript.Arguments;

if(args.length > 1 || args.length == 1 && args(0) != "apply" && args(0) != "restore"){
	WScript.Echo("Usage: Wscript zoomtextScript.js <settings>\nsettings: apply, restore; default: apply");
	WScript.Quit(1);
}

// Decide whether you are restoring or applying the settings
var restore = false;

if(args.length == 1 && args(0) == "restore"){
	restore = true;
}

// get required library
var fs = new ActiveXObject("Scripting.FileSystemObject");
var Wshell = WScript.CreateObject("WScript.Shell");
var ZT;

// For reading
var settingsFile;

// Open file for writing
if(!restore){
	// Store the settings that needs to be restored
	var originalSettingsFile = fs.OpenTextFile("..\\node_modules\\universal\\testData\\solutions\\zoomtext\\zoomtextOriginalSettings.ini", 2);
}

var restoreArray;
// Open file for reading
if(!restore){
	// Apply settings
	restoreArray = new Array();
	settingsFile = fs.OpenTextFile("..\\node_modules\\universal\\testData\\solutions\\zoomtext\\zoomtextSettings.ini", 1);
}
else{
	// For restoring settings
	settingsFile = fs.OpenTextFile("..\\node_modules\\universal\\testData\\solutions\\zoomtext\\zoomtextOriginalSettings.ini", 1);
}

// Function to remove whitespaces at the beginning and end of a string
function trim(word){
	return word.replace(/^\s+|\s+$/,"");
}

// Increase the magnification by 0.2
function increaseMagnification(){
	ZT.Magnification.PrimaryWindow.Power.Increase();
	// For settings restore
	if(!restore){
		restoreArray.push("ZT.Magnification.PrimaryWindow.Power.Decrease = executeFunction\n");
	}
}

// Decrease the magnification by 0.2
function decreaseMagnification(){
	ZT.Magnification.PrimaryWindow.Power.Decrease();
	// For settings restore
	if(!restore){
		restoreArray.push("ZT.Magnification.PrimaryWindow.Power.Increase = executeFunction\n");
	}
}

// Move the mouse to the coordinates x and y
function moveMouse(x, y){
	var point = ZT.CreateObject("Point");

	// For settings restore
	if(!restore){
		restoreArray.push("moveMouse = executeFunction;" + ZT.Mouse.Location.X + "," + ZT.Mouse.Location.Y + "\n");
	}

	point.Set(x, y);
	ZT.Mouse.Location = point;
	ZT.Magnification.PrimaryWindow.ViewToMouse();
}

//Function to center the mouse and move the primary window to the mouse
function CenterMouse(){
	var point = ZT.CreateObject("Point");

	// Obtain the coordinates of the center of the screen
	var x = ZT.Magnification.PrimaryWindow.Location.Right/2;
	var y = ZT.Magnification.PrimaryWindow.Location.Bottom/2;
	moveMouse(x, y);
}

// Set up array of settings
var allSettings = [
	"ZT.Magnification.PrimaryWindow.Power.Level",
	"ZT.Magnification.PrimaryWindow.Power.Increase",
	"ZT.Magnification.PrimaryWindow.Power.Decrease",
	"ZT.Magnification.PrimaryWindow.Enabled",
	"ZT.Magnification.PrimaryWindow.Type",
	"ZT.Magnification.CaretEnhancements.Enabled",
	"ZT.Magnification.CaretEnhancements.Scheme",
	"ZT.Magnification.CaretEnhancements.Location",
	"ZT.Magnification.CaretEnhancements.Visible",
	"ZT.Magnification.ColorEnhancements.Scheme",
	"ZT.Magnification.ColorEnhancements.Enabled",
	"ZT.Magnification.DualMonitor.Enabled",
	"ZT.Magnification.DualMonitor.Mode",
	"ZT.Magnification.FocusEnhancements.Enabled",
	"ZT.Magnification.FocusEnhancements.Scheme",
	"ZT.Magnification.FontEnhancements.Type",
	"ZT.Magnification.FreezeUsesPrimaryPower",
	"ZT.Magnification.Tracking.AlertsEnabled",
	"ZT.Magnification.Tracking.ControlsEnabled",
	"ZT.Magnification.Tracking.MenusEnabled",
	"ZT.Magnification.Tracking.MousePointerEnabled",
	"ZT.Magnification.Tracking.TextCursorEnabled",
	"ZT.Magnification.Tracking.ToolTipsEnabled",
	"ZT.Magnification.Tracking.WindowsEnabled",
	"ZT.Magnification.ViewLocator.Enabled",
	"ZT.Magnification.ScreenHighlight.Color",
	"ZT.Magnification.ScreenHighlight.Enabled",
	"ZT.Magnification.ScreenHighlight.Invert",
	"ZT.Magnification.ScreenHighlight.Mode",
	"ZT.Magnification.ScreenHighlight.Timeout",
	"ZT.Magnification.ScreenHighlight.Location",
	"ZT.Magnification.ScreenHighlight.Padding",
	"ZT.Magnification.ScreenHighlight.Shape",
	"ZT.Magnification.ScreenHighlight.Thickness",
	"ZT.Magnification.ScreenHighlight.Transparency",
	"ZT.Magnification.PointerEnhancements.Enabled",
	"ZT.Magnification.PointerEnhancements.Scheme",
	"ZT.Magnification.CCTV.Enabled",
	"ZT.Speech.CurrentVoice.Active",
	"ZT.Speech.CurrentVoice.Mute",
	"ZT.Speech.CurrentVoice.Pitch",
	"ZT.Speech.CurrentVoice.Rate",
	"ZT.Speech.CurrentVoice.Volume",
	"ZT.Speech.CurrentVoice.SpellMode",
	"ZT.Speech.CurrentVoice.SpeakImmediate",
	"ZT.Speech.CurrentVoice.AllowInterrupt",
	"ZT.Reader.MouseEcho.Mode",
	"ZT.Reader.MouseEcho.Scope",
	"ZT.Reader.MouseEcho.Time",
	"ZT.Reader.TypingEcho.Mode",
	"ZT.Reader.Verbosity.Level",
	"ZT.Reader.ProgramEcho.AlertsEnabled",
	"ZT.Reader.ProgramEcho.ControlsEnabled",
	"ZT.Reader.ProgramEcho.MenusEnabled",
	"ZT.Reader.ProgramEcho.TextCursorEchosLines",
	"ZT.Reader.ProgramEcho.TextCursorEnabled",
	"ZT.Reader.ProgramEcho.TooltipsEnabled",
	"ZT.Reader.ProgramEcho.WindowTitlesEnabled",
	"CenterMouse",
	"increaseMagnification",
	"decreaseMagnification",
	"moveMouse"
]

// Check if ZoomText has created it's API, if not, keep looping until ZoomText has created it's API
// Script will be terminated after 1 minute (60000ms) if ZoomText API is not created
var defTime = new Date(); // beginning time 
var exist = false;
var timeOut = 60000; //one minute

while(!exist){
	try{
		// check the elapse time of this script
		var currTime = new Date();
		if((currTime.getTime() - defTime.getTime()) >= timeOut){
			WScript.Quit(1);
		}

		ZT = new ActiveXObject("Zoomtext.Application");
		exist = true;
	} catch(e){
		if((e.number & 0xFFFF) == 429){
			// Zoomtext API is not created yet
		}
		else{
			// It is another error
			WScript.Echo(e.number & 0xFFFF + "\n" + e.message + "\n" + e.name);
			exist = true;
			WScript.Quit(1);
		}
	}
}

// Read the settingsFile and apply the settings to ZoomText
while(!settingsFile.AtEndOfStream){
	var arr = settingsFile.ReadLine().split("=");
	var key = trim(arr[0]);
	var args = arr[1].split(";");
	var value = trim(args[0]);
	
	// Loop through all the settings and apply it
	for(var i = 0, j = allSettings.length; i < j; i++){
		if(key == allSettings[i]){
			if(value == "executeFunction"){
				// To execute functions
				if(args.length > 1){
					eval(key + "(" + args[1] + ");");
				}
				else{
					eval(key + "();");
				}
				break;
			}
			else{
				// Write original settings to a file first, for settings restore
				if(!restore){
					restoreArray.push(key + " = " + value + "\n");
				}

				// Set settings value
				eval(key + " = " + value);
			}
			break;
		}
	}
}

// Close the files
settingsFile.Close();

if(!restore){
	while(restoreArray.length > 0){
		// Write the original settings to file
		originalSettingsFile.Write(restoreArray.pop());
	}
	originalSettingsFile.Close();
}
