document.getElementById("StringInput").addEventListener("input", displayBuffer);
document.getElementById("MalwareCheckbox").addEventListener("input", toggleMalware);
document.getElementById("CanaryCheckbox").addEventListener("input", toggleCanary);
const STRLEN = 7; // size of char array (including null char)
const SIZE_PADDING = 4;
let displayMalware = false;
const MALWARE_ADDRESS = (Math.floor(Math.random() * (16 ** 4))).toString(16).toUpperCase().padStart(4, '0');
let displayCanary = false;
const NULL_CHAR_DISPLAY = '\u25AA'; // FilledVerySmallSquare
const MISC_VALUE_DISPLAY = '\u25A1'; // Square
const STACK_BASE_POINTER_DISPLAY = 'base';
const INSTRUCTION_POINTER_DISPLAY = 'inst';
const CANARY_DISPLAY = '?';
const CANARY = String.fromCharCode(Math.floor(Math.random() * (127 - 32)) + 32).replace(' ', '\u23B5');
document.getElementById("Legend").innerHTML = `<div>Null Character: <span class="visual">${NULL_CHAR_DISPLAY}</span></div>
											   <div>Misc. Value: <span class="visual">${MISC_VALUE_DISPLAY}</span></div>
											   <div>Canary: <span class="visual canary">${CANARY_DISPLAY}</span></div>`;

displayBuffer();

function displayBuffer() {
	let inputBox = document.getElementById("StringInput");
	let inputString = inputBox.value;
	let inputSize = inputString.length;
	document.getElementById("StringInputSize").innerText = (inputSize + 1 /* to include the null char*/) + '/' + STRLEN;
	let displayParts = document.getElementById("MemoryVisual").children;
	let displayPartIndex = 0;
	let i = -1;
	let displayString = "";
	
	displayParts.item(0).innerHTML = "";
	displayParts.item(1).innerHTML = "";
	displayParts.item(2).innerHTML = "";
	displayParts.item(3).innerHTML = "";
	
	// add chars to memory visualization
	for (i in inputString) {
		displayString += inputString.charAt(i).replace(' ', '\u23B5');
		if (i == STRLEN - 1 ||
				i == STRLEN - 1 + SIZE_PADDING ||
				i == STRLEN - 1 + SIZE_PADDING + 4 ||
				i == STRLEN - 1 + SIZE_PADDING + 8
				) {
			displayParts.item(displayPartIndex++).innerText = displayString;
			displayString = "";
		}
	}
	
	// add null char to memory visualization
	displayString += NULL_CHAR_DISPLAY;
	
	// fill buffer and padding with misc. values if necessary
	if (displayPartIndex < 2) {
		while (++i < STRLEN - 1 + SIZE_PADDING) {
			if (i == STRLEN - 1) {
				// buffer filled; fill padding
				displayParts.item(displayPartIndex++).innerText = displayString;
				displayString = "";
				if (displayCanary) {
					displayParts.item(displayPartIndex).innerHTML = `<span class="canary" title="Canary">${CANARY_DISPLAY}</span>`;
					continue;
				}
			}
			displayString += MISC_VALUE_DISPLAY;
		}
		
		displayParts.item(displayPartIndex++).appendChild(document.createTextNode(displayString));
		displayString = "";
	}
	
	if (displayPartIndex < 3) {
		displayString += STACK_BASE_POINTER_DISPLAY.substring(inputSize - (STRLEN - 1 + SIZE_PADDING));
		displayParts.item(displayPartIndex++).innerText = displayString;
		displayString = "";
	}
	
	if (displayPartIndex < 4) {
		displayString += INSTRUCTION_POINTER_DISPLAY.substring(inputSize - (STRLEN - 1 + SIZE_PADDING + 4));
		displayParts.item(displayPartIndex++).innerText = displayString;
	}
	
	let malwareElement = document.getElementById("MalwareMemory");
	if (displayMalware) {
		malwareElement.innerText = `MALWARE (at ${MALWARE_ADDRESS})`;
		malwareElement.style.setProperty("margin-left", "0.5em");
	} else {
		malwareElement.innerText = "";
		malwareElement.style.setProperty("margin-left", "0");
	}
	
	let messageElement = document.getElementById("Message");
	let instructionAddress = displayParts.item(3).innerText;
	if (instructionAddress !== INSTRUCTION_POINTER_DISPLAY) {
		if (displayMalware && instructionAddress === MALWARE_ADDRESS) {
			messageElement.innerText = "MALWARE EXECUTED!";
		} else {
			messageElement.innerText = "INVALID MEMORY ADDRESS! CODE EXECUTION HALTED!";
		}
	} else if (displayCanary && inputSize >= STRLEN && document.getElementById("MemoryPadding").innerText.charAt(0) !== CANARY) {
		messageElement.innerText = "CANARY OVERWRITTEN! CODE EXECUTION HALTED!";
	} else {
		messageElement.innerText = "";
	}
}

function toggleMalware() {
	displayMalware = !displayMalware;
	displayBuffer();
}

function toggleCanary() {
	displayCanary = !displayCanary;
	displayBuffer();
}
