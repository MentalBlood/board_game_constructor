function downloadFile(filename, text) {
	const element = document.createElement("a");
	element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
	element.setAttribute("download", filename);

	element.style.display = "none";
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}

function uploadFile(fileExtension, onUploaded) {
	const fileElement = document.createElement("input");
	fileElement.type = "file";
	fileElement.accept = "." + fileExtension;

	fileElement.addEventListener("change", event => {
		const file = event.target.files[0];
		const fileReader = new FileReader();
		fileReader.onload = () => {
			fileElement.remove();
			onUploaded(fileReader.result);
		};
		fileReader.readAsText(file);
	});
	fileElement.click();
}