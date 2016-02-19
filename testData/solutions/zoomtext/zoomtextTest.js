// Test script to test the solution for Zoomtext
var fs = new ActiveXObject("Scripting.FileSystemObject");
var Wshell = WScript.CreateObject("WScript.Shell");
var ZT;

// Function to remove whitespaces at the beginning and end of a string
function trim(word){
	return word.replace(/^\s+|\s+$/,"");
}

//Function to center the mouse and move the primary window to the mouse
function CenterMouse(){
	var point = ZT.CreateObject("Point");
	point.Set(ZT.Magnification.PrimaryWindow.Location.Right/2, ZT.Magnification.PrimaryWindow.Location.Bottom/2);
	ZT.Mouse.Location = point;
	ZT.Magnification.PrimaryWindow.ViewToMouse();
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
	"CenterMouse"
]

// Check if ZoomText has created it's API, if not, keep looping until ZoomText has created it's API
// Script will be terminated after 1 minute (60000ms) if ZoomText API is not created
var defTime = new Date(); // beginning time 
var exist = false;
var timeOut = 5000; //one minute

while(!exist){
	try{
		// check the elapse time of this script
		var currTime = new Date();
		if((currTime.getTime() - defTime.getTime()) >= timeOut){
			WScript.Echo(0);
			WScript.Quit(1);
		}

		ZT = new ActiveXObject("Zoomtext.Application");
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
var file = fs.OpenTextFile("zoomtextTestSettings.ini");

// Compare the test cases with the actual value
while(!file.AtEndOfStream){
	var arr = file.ReadLine().split("=");
	var key = trim(arr[0]);
	var value = trim(arr[1]);
	for(var i = 0, j = allSettings.length; i < j; i++){
		if(key == allSettings[i]){
			if(eval(key).toString() != value){
				WScript.Echo(0);
				WScript.Quit(0);
			}
		}
	}
}

WScript.Echo(1);