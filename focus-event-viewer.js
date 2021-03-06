// Keyboard event viewer
// Gary Kacmarcik - garykac@{gmail|google}.com

var _focus_table_info = [
	// Unlabeled group
	["", "etype", [
		["#", "etype", "text"],
		["Event type", "etype", "html"],
	], {
		'grouplabel': false,
		'header-background': "#e0e0e0"
	}],

	// Event - Target
	["Target", "target", [
		["A", "target", "text", {'style': 'hilite_target_a'}],
		["B", "target", "text", {'style': 'hilite_target_b'}],
		["Outer", "target", "text", {'style': 'hilite_target_outer'}],
	], {
		'checked': true,
		'header-background': "#ffffc0"
	}],

	// FocusEvent - relatedTarget
	["relatedTarget", "focusevent", [
		["rA", "focusevent", "text", {'style': 'hilite_related_a'}],
		["rB", "focusevent", "text", {'style': 'hilite_related_b'}],
		["rOuter", "focusevent", "text", {'style': 'hilite_related_outer'}],
	], {
		'checked': true,
		'header-background': "#c0ffff"
	}],

	// FocusEvent - Handler
	["Handler", "handler", [
		["hA", "handler", "text", {'style': 'hilite_handler_a'}],
		["hB", "handler", "text", {'style': 'hilite_handler_b'}],
		["hOuter", "handler", "text", {'style': 'hilite_handler_outer'}],
	], {
		'checked': true,
		'header-background': "#c0c0ff"
	}],
];

var _focus_event_info = [
	["blur", {
		'preventDefault': {'checked': false},
		'stopPropagation': {'checked': false},
		'ShowEvents': {},
		'Highlight': {'checked': true},
		},
		"#ffa0a0"],
	["focus", {
		'preventDefault': {'checked': false},
		'stopPropagation': {'checked': false},
		'ShowEvents': {},
		'Highlight': {'checked': true},
		},
		"#a0ffa0"],
	["focusin", {
		'preventDefault': {'checked': false},
		'stopPropagation': {'checked': false},
		'ShowEvents': {},
		'Highlight': {'checked': false},
		},
		"#ccffcc"],
	["focusout", {
		'preventDefault': {'checked': false},
		'stopPropagation': {'checked': false},
		'ShowEvents': {},
		'Highlight': {'checked': false},
		},
		"#ffcccc"],
	["DOMFocusIn", {
		'preventDefault': {'checked': false},
		'stopPropagation': {'checked': false},
		'ShowEvents': {},
		'Highlight': {'checked': false},
		},
		"repeating-linear-gradient(-45deg, #cfc, #cfc 8px, #fff 8px, #fff 16px)"],
	["DOMFocusOut", {
		'preventDefault': {'checked': false},
		'stopPropagation': {'checked': false},
		'ShowEvents': {},
		'Highlight': {'checked': false},
		},
		"repeating-linear-gradient(-45deg, #fcc, #fcc 8px, #fff 8px, #fff 16px)"],
];


function setUserAgentText() {
	var userAgent = navigator.userAgent;
	uaDiv = document.getElementById("useragent");
	setText(uaDiv, userAgent);
}

function resetTable(resetData=true) {
	// Reset focus first so the we clear out the events related to it.
	setInputFocus(resetData);

	clearTable();
	initOutputTable(_focus_table_info);
}

function init() {
	setUserAgentText();

	createOptions(document.getElementById("options"), _focus_event_info, _focus_table_info, []);
	injectCustomCSS(_focus_event_info, _focus_table_info);
	resetTable(false);

	var input_a = document.getElementById("input_a");
	var input_b = document.getElementById("input_b");
	var outer = document.getElementById("outer");
	for (var div of [input_a, input_b, outer]) {
		addEventListener(div, "blur", onBlur.bind(null, div));
		addEventListener(div, "focus", onFocus.bind(null, div));
		addEventListener(div, "focusin", onFocusIn.bind(null, div));
		addEventListener(div, "focusout", onFocusOut.bind(null, div));
		addEventListener(div, "DOMFocusIn", onDomFocusIn.bind(null, div));
		addEventListener(div, "DOMFocusOut", onDomFocusOut.bind(null, div));
	}
}

// =====
// Focus events: blur, focusin, focusout
// =====

function onBlur(handler, e) {
	handleFocusEvent("blur", handler, e);
}

function onFocus(handler, e) {
	handleFocusEvent("focus", handler, e);
}

function onFocusIn(handler, e) {
	handleFocusEvent("focusin", handler, e);
}

function onFocusOut(handler, e) {
	handleFocusEvent("focusout", handler, e);
}

function onDomFocusIn(handler, e) {
	handleFocusEvent("DOMFocusIn", handler, e);
}

function onDomFocusOut(handler, e) {
	handleFocusEvent("DOMFocusOut", handler, e);
}

function handleFocusEvent(etype, handler, e) {
	var show = document.getElementById("show_" + etype);
	if (show.checked) {
		addFocusEvent(etype, handler, e);
	}
	handleDefaultPropagation(etype, e);
}

function addFocusEvent(etype, handler, e) {
	if (!e) {
		e = window.event;
	}
	var target = e.target.id;
	var relatedTarget = e.relatedTarget ? e.relatedTarget.id : "";
	var handler = handler.id;
	var eventinfo = {};

	eventinfo["Event type"] = calcHilightString(etype, e.type);

	eventinfo["A"] = (target == "input_a" ? "A" : "");
	eventinfo["B"] = (target == "input_b" ? "B" : "");
	eventinfo["Outer"] = (target == "outer" ? "Outer" : "");

	eventinfo["rA"] = (relatedTarget == "input_a" ? "A" : "");
	eventinfo["rB"] = (relatedTarget == "input_b" ? "B" : "");
	eventinfo["rOuter"] = (relatedTarget == "outer" ? "Outer" : "");

	eventinfo["hA"] = (handler == "input_a" ? (handler == target ? "-" : "A") : "");
	eventinfo["hB"] = (handler == "input_b" ? (handler == target ? "-" : "B") : "");
	eventinfo["hOuter"] = (handler == "outer" ? (handler == target ? "-" : "Outer") : "");

	addEventToOutput(eventinfo);
}

// =====
// Helper functions
// =====

/* Set the focus to the input box. */
function setInputFocus(resetData) {
	var input = document.getElementById("input_a");

	if (resetData) {
		input.value = "";
	}

	// Set focus.
	input.focus();
}
