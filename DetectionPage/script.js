var inputImg = document.getElementById('CT-input');
var previewImg = document.getElementById('CT-preview');
var form = document.getElementById('CT-form');
var output = document.getElementById('output');
var valid = document.getElementById('validation');
var dropArea = document.getElementById('drop-area');
var changeButton = document.getElementById('change-btn');
var historyList = document.getElementById('history-list'); 
var resultContainer = document.querySelector('.result-container');
var defaultMessage = document.querySelector('.default-message');
var descContainer = document.getElementById('caption');
var normalDesc = 'A normal lung is characterized by its uniform pink color, spongy texture, and smooth surface. This appearance reflects its healthy tissue and absence of disease. Normal lungs contain millions of tiny air sacs called alveoli, which are critical for gas exchange. These alveoli, along with clear airways and bronchi, facilitate the seamless intake of oxygen and expulsion of carbon dioxide. Functionally, a normal lung performs its duties efficiently, supplying the body with sufficient oxygen for cellular activity while maintaining a stable internal environment. There is no inflammation, scarring, or abnormal growth, and the tissue remains thin and elastic, adapting seamlessly to the body’s respiratory demands.';
var benignDesc = 'A benign lung, while not as severe as a malignant one, may still show abnormalities in the form of non-cancerous growths or nodules. These benign nodules are generally smooth, well-defined, and rounded. Unlike malignant growths, they do not invade surrounding tissue or spread to other parts of the body. Benign nodules are typically slow-growing and may arise from infections, scar tissue, or inflammation. In most cases, they are asymptomatic and do not affect lung function. However, if a benign nodule becomes large, it can exert pressure on surrounding structures, potentially causing mild symptoms such as localized discomfort or difficulty breathing. Despite their harmless nature, benign nodules are often monitored closely to ensure they do not develop into malignancies or interfere with lung function.';
var malignantDesc = 'A malignant lung, affected by cancer, exhibits abnormal growths or tumors that can significantly alter its structure and functionality. These tumors are often visible on imaging scans as dense, irregular, or white masses that disrupt the lung’s uniform appearance. Malignant tumors arise from the rapid and uncontrolled division of abnormal cells, which infiltrate surrounding healthy tissue and, in advanced stages, spread to other parts of the body (a process known as metastasis). The presence of these tumors hampers the lung’s ability to exchange gases, often causing symptoms such as chronic cough, shortness of breath, and chest pain. The tissue within a malignant lung may appear hardened and discolored, and the airways may become obstructed, leading to reduced oxygen delivery to the body. Left untreated, lung cancer is life-threatening, emphasizing the critical importance of early detection and treatment.';

function addToHistory(fileName, result) {
    const li = document.createElement('li');
    li.classList.add(result);
    li.innerHTML = `
        <strong>File:</strong> ${fileName} <br>
        <strong>Prediciton Result:</strong> ${result}
    `;
    if (historyList.firstChild) {
        historyList.insertBefore(li, historyList.firstChild);
    } else {
        historyList.appendChild(li);
    }
}

valid.style.display = 'none';
previewImg.style.display = 'none'; 
changeButton.style.display = 'none'; 

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const file = inputImg.files[0];
    if (!file) {
        valid.style.display = 'block'; 
        return;
    }

    valid.style.display = 'none'; 

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('http://127.0.0.1:8000/predict', {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();

        if (data.result) {
            defaultMessage.style.display = 'none'; 
            resultContainer.style.display = 'block'; 
            updateResultClass(resultContainer, data.result);
            if(data.result === 'Normal') descContainer.innerHTML = normalDesc;
            if(data.result === 'Malignant') descContainer.innerHTML = malignantDesc;
            if(data.result === 'Benign') descContainer.innerHTML = benignDesc;
            resultContainer.innerHTML = `Prediction: ${data.result} <br><br> ${descContainer.innerHTML}`;

            addToHistory(file.name , data.result);
        } else {
            defaultMessage.style.display = 'none';
            resultContainer.style.display = 'block';
            updateResultClass(resultContainer, 'error');
            resultContainer.textContent = 'Error: Could not predict the image.';
        }
    } catch (error) {
        console.error('Error:', error);

        const resultContainer = document.querySelector('.result-container');
        const defaultMessage = document.querySelector('.default-message');

        defaultMessage.style.display = 'none';
        resultContainer.style.display = 'block';
        updateResultClass(resultContainer, 'error');
        resultContainer.textContent = 'An error occurred while processing your request.';
    }
});

function updateResultClass(element, newClass) {
    const resultClasses = ['Malignant', 'Benign', 'Normal', 'error'];

    resultClasses.forEach(className => {
        if (element.classList.contains(className)) {
            element.classList.remove(className);
        }
    });

    element.classList.add(newClass);
}


['dragenter', 'dragover', 'dragleave', 'drop'].forEach(event => {
    dropArea.addEventListener(event, (e) => {
        e.preventDefault();
        e.stopPropagation();
    });
});

dropArea.addEventListener('dragenter', () => dropArea.classList.add('highlight'));
dropArea.addEventListener('dragleave', () => dropArea.classList.remove('highlight'));
dropArea.addEventListener('drop', (event) => {
    dropArea.classList.remove('highlight');

    const file = event.dataTransfer.files[0];
    handleFile(file);
});

dropArea.addEventListener('click', () => {
    inputImg.click(); 
});

function handleFile(file) {
    if (file && file.type.startsWith('image/')) {
        valid.style.display = 'none';
        dropArea.style.display = 'none';
        previewImg.style.display = 'block'; 
        changeButton.style.display = 'inline-block'; 

        const reader = new FileReader();
        reader.onload = (event) => {
            previewImg.src = event.target.result; 
        };
        reader.readAsDataURL(file);
    } else {
        alert('Please upload a valid image file.');
        valid.style.display = 'block';
    }
}

changeButton.addEventListener('click', () => {
    inputImg.value = ''; 
    previewImg.src = ''; 
    previewImg.style.display = 'none'; 
    changeButton.style.display = 'none'; 
    dropArea.style.display = 'block'; 
    defaultMessage.style.display = 'block';
    resultContainer.style.display = 'none';
});

inputImg.addEventListener('change', () => {
    const file = inputImg.files[0];

    if(file){
        handleFile(file);
    }
    else{
        valid.style.display = 'block';
    }
   
});
