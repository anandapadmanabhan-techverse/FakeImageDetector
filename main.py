from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# CORS(app)  # Enable CORS

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    image = request.files['image']

    # Mock prediction logic (replace with real model later)
    result = random.choice(['Fake', 'Real'])
    accuracy = round(random.uniform(80, 99), 2)  # Random accuracy between 80% and 99%

    return jsonify({
        'result': result,
        'accuracy': accuracy
    })

if __name__ == '__main__':
    app.run(debug=True)