URL = window.URL || window.webkitURL;
var c = 0;
var t;
var timer_is_on = 0;
var gumStream;
var rec;
var input;
var globalBlob;
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext;
var filename;

var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");
var displayContent = document.getElementById("displayContent");
var audioLink = document.getElementById("audioLink");
var Transilate = document.getElementById('Transilate');
var transilatedAudio = document.getElementById('transilatedAudio');

Transilate.addEventListener("click", transilate);

recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);

loadingPage();

function startRecording() {
	c = 0;
	timer_is_on = 0;
	var constraints = { audio: true, video: false };
	recordButton.disabled = true;
	stopButton.disabled = false;
	navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
		console.log("getUserMedia() success, stream created, initializing Recorder.js ...");
		audioContext = new AudioContext();
		startCount();
		gumStream = stream;
		input = audioContext.createMediaStreamSource(stream);
		rec = new Recorder(input, { numChannels: 1 });
		rec.record();
		console.log("Recording started");
	}).catch(function (err) {
		recordButton.disabled = false;
		stopButton.disabled = true;
	});
}

function stopRecording() {
	displayContent.style.visibility = "visible";
	stopCount();
	stopButton.disabled = true;
	recordButton.disabled = false;
	rec.stop();
	gumStream.getAudioTracks()[0].stop();
	rec.exportWAV(createDownloadLink);
}

function createDownloadLink(blob) {
	globalBlob = blob;
	var url = URL.createObjectURL(blob);
	var au = document.createElement('audio');
	filename = new Date().toISOString();
	au.controls = true;
	au.src = url;
	audioLink.href = url;
	audioLink.download = filename + ".wav ";
	audioLink.innerHTML = "Listen to your record";
	recordedArea.appendChild(au);
}

function timedCount() {
	document.getElementById("formats").innerHTML = "Format: 1 channel pcm @ " + audioContext.sampleRate / 1000 + "kHz | <span class='red'><b>" + c + "</b> sec </span>";
	c = c + 1;
	t = setTimeout(timedCount, 1000);
}

function startCount() {
	if (!timer_is_on) {
		timer_is_on = 1;
		timedCount();
	}
}

function stopCount() {
	clearTimeout(t);
	timer_is_on = 0;
}

function transilate() {
	transilatedAudio.style.visibility = "visible";
	var formData = new FormData();
	formData.append("audio", globalBlob, filename);
	$.ajax({
		url: 'https://mbaza.dev.cndp.org.rw/deepspeech/api/api/stt/http',
		type: 'post',
		data: formData,
		contentType: false,
		processData: false,
		success: function (response) {
			console.log(response);
			//   if(response != 0){
			// 	 $("#img").attr("src",response); 
			// 	 $(".preview img").show(); // Display image element
			//   }else{
			// 	 alert('file not uploaded');
			//   }
		},
	});

}

function loadingPage() {
	$.ajax({
		url: 'https://mbaza.dev.cndp.org.rw/deepspeech/api/token',
		type: 'post',
		data: {
			"username": "lcdamy",
			"password": "Zudanga@1"
		},
		contentType: false,
		processData: false,
		success: function (response) {
			console.log(response);
			$("div.spanner").removeClass("show");
			$("div.overlay").removeClass("show");
		},
	});

}
