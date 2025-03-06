from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoImageProcessor, AutoModelForImageClassification
from PIL import Image
import torch
import os

app = Flask(__name__)
CORS(app)  # Allows all origins

# Load the model and processor
model_name = "prithivMLmods/Deep-Fake-Detector-Model"
processor = AutoImageProcessor.from_pretrained(model_name)  # ViT uses ImageProcessor
model = AutoModelForImageClassification.from_pretrained(model_name)
model.eval()  # Set model to evaluation mode

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    img_file = request.files['image']
    img_path = "temp_image.jpg"
    img_file.save(img_path)

    try:
        # Load and preprocess the image
        img = Image.open(img_path).convert("RGB")
        inputs = processor(images=img, return_tensors="pt")  # ViT processing

        # Perform inference
        with torch.no_grad():
            logits = model(**inputs).logits
            probs = torch.nn.functional.softmax(logits, dim=-1)
            confidence, predicted_class = torch.max(probs, dim=-1)

        # Convert class index to label (Assumption: 0 = "Real", 1 = "Fake")
        result = "No Manipulation Detected..!!" if predicted_class.item() == 0 else "Fake Image Detected..!!"
        accuracy = round(confidence.item() * 100, 2)

        return jsonify({'result': result, 'accuracy': accuracy})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        # Clean up temp image
        if os.path.exists(img_path):
            os.remove(img_path)

if __name__ == '__main__':
    app.run(debug=True)
