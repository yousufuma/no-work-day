var newDate = '';
getLangDate();

function dateFilter(date) { 
	if (date < 10) {
		return "0" + date;
	}
	return date;
}

function getLangDate() {
	var dateObj = new Date(); 						
	var day = dateObj.getDay(); 
	var weeks = ["SUN", "MON", "TUE", "WEN", "THU", "FRI", "STA"];
	var hour = dateObj.getHours(); 
	var minute = dateObj.getMinutes(); 
	var second = dateObj.getSeconds(); 
	newDate = dateFilter(hour) + ":" +
		dateFilter(minute) + ":" + dateFilter(second);
	document.getElementById("nowTime").innerHTML = newDate;
	setTimeout(getLangDate, 1000);
}

var h = 24 - new Date().getHours(); 
document.getElementById("nowTime2").innerHTML = "TIME LEFT" + h + "hour";



const fileInp = document.getElementById('fileInp');
const avator = document.getElementById("avator");
avator.onclick = function() {
	fileInp.click();
};
