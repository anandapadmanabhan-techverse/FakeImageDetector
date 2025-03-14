// When an image is selected, show the preview, hide the upload button, and reveal the action buttons.
document.getElementById("imageInput").addEventListener("change", previewImage);

function previewImage() {
    let input = document.getElementById("imageInput");
    if (input.files.length === 0) {
        alert("Please select an image first.");
        return;
    }
    let file = input.files[0];
    let reader = new FileReader();
    reader.onload = function(e) {
        let imageElement = document.getElementById("uploadedImage");
        imageElement.src = e.target.result;
        imageElement.style.display = "block";
        // Hide the upload button (upload box)
        document.querySelector(".upload-box").style.display = "none";
        // Show the action buttons (Back and Check)
        document.getElementById("actionButtons").style.display = "block";
    };
    reader.readAsDataURL(file);
}

function uploadImage() {
    let input = document.getElementById("imageInput");
    if (input.files.length === 0) {
        alert("Please select an image first.");
        return;
    }
    let file = input.files[0];
    let formData = new FormData();
    formData.append("image", file);

    // Optionally, clear previous messages
    document.getElementById("output").innerText = "Processing image...";
    document.getElementById("accuracy").innerText = "";
    document.getElementById("toolUsed").innerText = "";

    fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("output").innerText = "Result: " + data.result;
        document.getElementById("accuracy").innerText = "Accuracy: " + data.accuracy + "%";

        if (data.result === "Fake") {
            fetchDeepseekAPI(file);
        }
    })
    .catch(error => {
        console.error("Error:", error);
        document.getElementById("output").innerText = "Error processing image.";
    });
}

function fetchDeepseekAPI(image) {
    let formData = new FormData();
    formData.append("image", image);

    fetch("https://api.deepseek.com/detect", {
        method: "POST",
        headers: { "Authorization": "Bearer sk-1f552dafd999454d9c565de55edd6067" },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("toolUsed").innerText = "Generated By: " + data.tool;
    })
    .catch(error => {
        console.error("Error:", error);
        document.getElementById("toolUsed").innerText = "Could not detect generation tool.";
    });
}

function resetUpload() {
    // Clear the file input
    document.getElementById("imageInput").value = "";
    
    // Hide the uploaded image
    let imageElement = document.getElementById("uploadedImage");
    imageElement.src = "";
    imageElement.style.display = "none";
    
    // Show the upload box (upload button) again
    document.querySelector(".upload-box").style.display = "block";
    
    // Hide the action buttons
    document.getElementById("actionButtons").style.display = "none";
    
    // Clear any output messages
    document.getElementById("output").innerText = "";
    document.getElementById("accuracy").innerText = "";
    document.getElementById("toolUsed").innerText = "";
}
