# ✍️ Handwriting Recognition App (HWR App)

A handwriting recognition web application that detects and classifies handwritten characters using deep learning. The model is trained on the IAM and MNIST handwriting datasets and integrated into a Flask-based web app for interactive predictions.



## 🧠 Project Overview

This app allows users to:
- Draw handwritten characters or words in a canvas
- Process the image using OpenCV
- Use a trained deep learning model to predict the handwriting
- Display the prediction in real time

This project demonstrates the combination of computer vision, model training, and full-stack web development.



## 👨🏽‍💻 Tech Stack

| Frontend | Backend | ML & CV |
|----------|---------|---------|
| HTML, JavaScript, Canvas API | Flask (Python) | TensorFlow, OpenCV, NumPy |
|  |  | Trained on IAM & MINT datasets |



## 🚀 How It Works

1. User draws a handwritten character on a canvas element in the browser
2. The canvas is converted to an image and sent to the Flask server
3. OpenCV preprocesses the image (resize, grayscale, normalize)
4. TensorFlow model classifies the character
5. Result is returned to the frontend and displayed




## 📊 Dataset Info

- **IAM Handwriting Dataset**: Real-world handwritten English text samples  
- **MNIST Dataset**: Supplementary dataset for handwritten digits variation

The model was trained on preprocessed and augmented data from both datasets to improve generalization.
Just two datasets were used because of the GPU capacity used to create this project locally.



## 🧠 Model Training

The model architecture is based on a Convolutional Neural Network (CNN) and was trained using TensorFlow/Keras. Training scripts and the final model weights are included in the `/model` directory.




---

## ▶️ Getting Started

### 🔧 Prerequisites

- Python 3.7+
- pip or virtualenv

### 💻 Installation

```bash
git clone https://github.com/x2qui/hwrapp.git
cd hwrapp
pip install -r requirements.txt
python app.py

Then go to your browser AT PORT 5000


