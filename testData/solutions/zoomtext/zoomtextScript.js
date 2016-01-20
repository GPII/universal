var exist = false;

var Wshell = WScript.CreateObject("WScript.Shell");


while(!exist){
	try{
		var ZT = new ActiveXObject("Zoomtext.Application");
		var mag = ZT.Magnification.PrimaryWindow.Power;
		var speech = ZT.Speech.CurrentVoice;
		exist = true;
	} catch(e){
		if((e.number & 0xFFFF) == 429){
		}
		else{
			WScript.Echo(e.number & 0xFFFF);
			WScript.Echo(e.message);
			WScript.Echo(e.name);
			exist = true;
		}
	}
}

function trim(word){
	return word.replace(/^\s+|\s+$/,"");
}

var fs = new ActiveXObject("Scripting.FileSystemObject");

var file = fs.OpenTextFile("..\\node_modules\\universal\\testData\\solutions\\zoomtext\\zoomtextSettings.ini");

var line;//temp string to store line
var arr;//temp array for split line
var key;//temp for key
var value;//temp for value

while(!file.AtEndOfStream){
	line = file.ReadLine();
	arr = line.split("=");

	key = trim(arr[0]);
	value = trim(arr[1]);

	switch(key){
		case "Magnification":
			mag.Level = value;
			break;
		case "Speed":
			speech.Rate = value;
			break;
		case "Volume":
			speech.Volume = value;
			break;
		case "Enabled":
			ZT.Enabled = value;
			break;
	}
}
