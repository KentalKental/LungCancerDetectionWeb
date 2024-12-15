from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from PIL import Image
import numpy as np
import tensorflow as tf
import os
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)
model = tf.keras.models.load_model('CNN_LCDetect.keras')

def preprocess(img):
    img = img.resize((256,256))
    img_arr = np.array(img)/255.0
    return np.expand_dims(img_arr,axis=0)

@app.post('/predict')
async def predict(file: UploadFile = File(...)):
    try:
        img = Image.open(file.file).convert('RGB')
        processed_img = preprocess(img)

        prediction = model.predict(processed_img)
        class_index = np.argmax(prediction,axis=1)[0]

        classes = ['Benign','Malignant','Normal']
        result = classes[class_index]
        
        return JSONResponse(content={'result':result})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)