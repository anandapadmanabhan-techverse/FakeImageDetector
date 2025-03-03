document.getElementById("imageInput").addEventListener("change", previewImage);

function previewImage() {
    let input = document.getElementById('imageInput');
    if (input.files.length === 0) {
        alert("Please select an image first.");
        return;
    }

    let file = input.files[0];
    let reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById("imagePreview").innerHTML = 
            '<img src="' + e.target.result + '" alt="Uploaded Image" class="uploaded-image">';
        
        document.getElementById("uploadBox").style.display = "none";
        document.getElementById("actionButtons").style.display = "flex";
    }
    reader.readAsDataURL(file);
}

function resetUpload() {
    document.getElementById("imageInput").value = "";
    document.getElementById("imagePreview").innerHTML = "";
    document.getElementById("uploadBox").style.display = "block";
    document.getElementById("actionButtons").style.display = "none";
    document.getElementById("output").innerText = "";
    document.getElementById("accuracy").innerText = "";
    document.getElementById("toolUsed").innerText = "";
}

function uploadImage() {
    document.getElementById("output").innerText = "Processing image...";
    
    setTimeout(() => {
        let isFake = Math.random() < 0.5; // Simulating a 50% chance
        document.getElementById("output").innerText = isFake ? "Fake Image Detected!" : "No Manipulation Detected.";
        document.getElementById("accuracy").innerText = "Accuracy: " + (Math.random() * 10 + 90).toFixed(2) + "%";
        document.getElementById("toolUsed").innerText = "Tool Used: AI-based Analysis";
    }, 2000);
}
