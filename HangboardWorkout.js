var totalTime = 0;
var currentTime = 0;
var isPaused = true;

var hangsLeft = 0;
var restsLeft = 0;
var setsLeft = 0;

var mainSeconds = 0;
var readyTime = 10;

var soundOn = false;

// 0:get ready, 1:hang, 2:rest, 3:recover, 4:done
var currentInterval = 0;
var timerId;
var customTimerId;

const totalTimer = document.getElementById('totalTimer');
const mainTimer = document.getElementById('mainTimer');

const intervalName = document.getElementById('intervalName');
const currentSetRep = document.getElementById('currentSetRep');

const startButton = document.getElementById('startBtn');
const resetButton = document.getElementById('resetBtn');
const soundCheckbox = document.getElementById('soundCheckbox');

const hangInput = document.getElementById('hangInput');
const restInput = document.getElementById('restInput');
const repInput = document.getElementById('repsInput');
const setInput = document.getElementById('setsInput');
const recoveryInput = document.getElementById('recoveryInput');

var hangTime, restTime, repNum, setNum, recoveryTime = 0;

const workout1Button = document.getElementById('beginnerBtn');
const workout2Button = document.getElementById('maxWeightBtn');
const workout3Button = document.getElementById('strengthRepeatersBtn');
const workout4Button = document.getElementById('repeatersBtn');
const workout5Button = document.getElementById('noHangsBtn');

workout1Button.addEventListener('click', workout1);
workout2Button.addEventListener('click', workout2);
workout3Button.addEventListener('click', workout3);
workout4Button.addEventListener('click', workout4);
workout5Button.addEventListener('click', workout5);

var customWorkoutText = "";
var currentTime = 0;
var nextTime = 0;
var letterIndex = 0;
var customFlag = 0;

const customInput = document.getElementById('customInput');
const customButton = document.getElementById('customBtn');
//const customButton2 = document.getElementById('customBtn2');
customButton.addEventListener('click', customWorkout);
//customButton2.addEventListener('click', startCustomWorkout);

function startWorkout() {
	isPaused = !isPaused;
	startButton.value = isPaused ? 'Start' : 'Pause';
	if (customFlag == 0)
	{
		setsLeft = (setsLeft == setNum) ? (setNum - 1) : setsLeft;
	}
}

function calculateWorkout() {
	customFlag = 0;
	clearInterval(timerId);
	clearInterval(customTimerId);
	hangTime = hangInput.valueAsNumber;
	restTime = restInput.valueAsNumber;
	repNum = repInput.valueAsNumber;
	setNum = setInput.valueAsNumber;
	recoveryTime = recoveryInput.valueAsNumber;
	recoveryTime = recoveryTime >= 11 ? recoveryTime : 11;
	
	const totalSetTime = (hangTime * repNum) + (restTime *(repNum-1));
	totalTime = 10 + (totalSetTime * setNum) + recoveryTime * (setNum - 1);
	
	hangsLeft = repNum;
	restsLeft = repNum - 1;
	setsLeft = setNum;
	currentInterval = 0;
	mainSeconds = readyTime;
	
	isPaused = false;
	updateTimer();
	isPaused = true;
	startButton.value = 'Start';
	getReady();
	currentSetRep.innerHTML = "Set: " + "0/" + setNum + ", Rep: " + "0/" + repNum;
	timerId = setInterval(updateTimer, 1000);
	
}

function updateMainTimer() {
	//time orders should go as follows:
	// 1. 10s 'Get Ready'
	// 2. Hang Time
	// 3. Rest Time
	// 4. Repeat 2-3 for # of hang reps
	// 5. Recovery Time
	// 6. Repeat 1-5 for # of sets
	
	if (mainSeconds < 0) {
		// current interval is done
		if (currentInterval == 0) {
			//if current interval is 'get ready', next is hang
			currentInterval = 1;
			mainSeconds = hangTime-1;
			hang();
			hangsLeft--;
			currentSetRep.innerHTML = "Set: " + (setNum - setsLeft) + "/" + setNum + ", Rep: " + (repNum - restsLeft) + "/" + repNum;
			
		} else if (currentInterval == 1) {
			//if current interval is hang, next is rest OR recover OR Done
			if (restsLeft > 0) {
				currentInterval = 2;
				mainSeconds = restTime-1;
				rest();
				restsLeft--;
			} else if (setsLeft > 0) {
				currentInterval = 3;
				mainSeconds = recoveryTime-readyTime-1;
				recover();
			} else {
				//workout is complete
				totalTime = 0;
				isPaused = true;
				done();
				clearInterval(timerId);
				
			}
			
		} else if (currentInterval == 2) {
			//if current interval is rest, next is hang
			currentInterval = 1;
			mainSeconds = hangTime-1;
			hang();
			hangsLeft--;
			currentSetRep.innerHTML = "Set: " + (setNum - setsLeft) + "/" + setNum + ", Rep: " + (repNum - restsLeft) + "/" + repNum;
			
		} else if (currentInterval == 3) {
			//if current interval is recovery, next is 'get ready'
			currentInterval = 0;
			mainSeconds = readyTime-1;
			hangsLeft = repNum;
			restsLeft = repNum - 1;
			setsLeft--;
			getReady();
		}
	}
	
	mainTimer.innerHTML = mainSeconds;
	if (soundCheckbox.checked && (currentInterval == 0 || currentInterval == 2) && (mainSeconds < 2)) {
		beep();
	}
	mainSeconds--;
}

//Event Handlers
startButton.addEventListener('click', startWorkout);
resetButton.addEventListener('click', calculateWorkout);

document.addEventListener('keyup', event => {
	if (event.code == 'Space') {
		startWorkout();
	}
});

function updateTimer() {
	if(!isPaused) {
		const minutes = Math.floor(totalTime/60);
		let seconds = totalTime % 60;
	
		seconds = seconds < 10 ? '0' + seconds : seconds;
		
		updateMainTimer();
		totalTimer.innerHTML = minutes + ":" + seconds;
		totalTime--;
		
		if (totalTime < 0) {
			//workout is complete
			totalTime = 0;
			isPaused = true;
			done();
			clearInterval(timerId);
		}
	}
}

function beep() {
	var audio = new Audio('https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3');
	audio.volume = 0.08;
	audio.play();
}

// Beginner strength/endurance
function workout1() {
	hangInput.value = 10;
	restInput.value = 30;
	repInput.value = 4;
	setInput.value = 3;
	recoveryInput.value = 120;
	
	calculateWorkout();
}

// Max Weight (Finger Strength)
function workout2() {
	hangInput.value = 6;
	restInput.value = 0;
	repInput.value = 1;
	setInput.value = 6;
	recoveryInput.value = 180;
	
	calculateWorkout();
}

// Strength Repeaters (power endurance)
function workout3() {
	hangInput.value = 7;
	restInput.value = 53;
	repInput.value = 3;
	setInput.value = 3;
	recoveryInput.value = 180;
	
	calculateWorkout();
}

// Repeaters (Endurance)
function workout4() {
	hangInput.value = 7;
	restInput.value = 3;
	repInput.value = 24;
	setInput.value = 3;
	recoveryInput.value = 300;
	
	calculateWorkout();
}

// No Hangs (quick and easy)
function workout5() {
	hangInput.value = 10;
	restInput.value = 50;
	repInput.value = 10;
	setInput.value = 1;
	recoveryInput.value = 0;
	
	calculateWorkout();
}

function customWorkout() {
	clearInterval(customTimerId);
	clearInterval(timerId);
	totalTimer.innerHTML = "";
	isPaused = true;
	startButton.value = 'Start';
	customWorkoutText = customInput.value;
	
	currentTime = 10;
	customFlag = 1;
	
	getReady();
	currentSetRep.innerHTML = customWorkoutText;
	mainTimer.innerHTML = currentTime;
	customTimerId = setInterval(iterateCustomWorkout, 1000);
}

function iterateCustomWorkout() {
	if (!isPaused) {
	
		if (currentTime >= 1 ) {
			currentTime -= 1;
			mainTimer.innerHTML = currentTime;
		} else {
			letterIndex = customWorkoutText.indexOf(" ");
			nextTime = Number(customWorkoutText.slice(0, letterIndex - 1));
			currentTime = nextTime - 1;
			if ( customWorkoutText[letterIndex-1] == 'h') {
				hang();
			} else if (customWorkoutText[letterIndex-1] == 'r') {
				rest();
			} else {
				done();
				clearInterval(customTimerId);
			}
			customWorkoutText = customWorkoutText.slice(letterIndex + 1);
			mainTimer.innerHTML = currentTime;
			currentSetRep.innerHTML = customWorkoutText;
		}
	}
}

function hang() {
	intervalName.innerHTML = "HANG";
	mainTimer.style.backgroundColor = 'tomato';
}

function rest() {
	intervalName.innerHTML = "REST";
	mainTimer.style.backgroundColor = 'lawngreen';
}

function done() {
	intervalName.innerHTML = "DONE";
	mainTimer.style.backgroundColor = 'gold';
}

function getReady() {
	mainTimer.style.backgroundColor = 'skyblue';
	intervalName.innerHTML = "GET READY";
}

function recover() {
	intervalName.innerHTML = "RECOVERY";
	mainTimer.style.backgroundColor = 'orange';
}
