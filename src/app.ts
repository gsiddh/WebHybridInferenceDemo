import {
    getVertexAI,
    getGenerativeModel,
    GenerativeModel,
    GenerateContentRequest,
    Part
} from "firebase/vertexai";


import { initializeApp } from "firebase/app";


const firebaseConfig = {
    apiKey: "AIzaSyBkbX6tPnHiVPU93FgfXdWHUDpcHp01tOc",
    authDomain: "sid-test-web-hybrid.firebaseapp.com",
    projectId: "sid-test-web-hybrid",
    storageBucket: "sid-test-web-hybrid.firebasestorage.app",
    messagingSenderId: "638382767496",
    appId: "1:638382767496:web:5c0388e8a91f583c02ce3d",
    measurementId: "G-Q6GFKMSFBC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize the Vertex AI service
const vertexAI = getVertexAI(app);

const inCloudOnlyModel = getGenerativeModel(vertexAI, {
    mode: 'only_in_cloud',
});

const onDeviceOnlyModel = getGenerativeModel(vertexAI, {
    mode: 'only_on_device',
});

const hybridModel = getGenerativeModel(vertexAI, {
    mode: 'prefer_on_device',
});


async function textOnlyInference(model: GenerativeModel) {
    const inputField = document.getElementById('textOnlyInputField') as HTMLInputElement;
    const outputField = document.getElementById('textOnlyOutputArea') as HTMLInputElement;
    outputField.value = "";

    const txt = inputField.value;

    console.log("inference running for:", txt);
    const inferenceRes = await model.generateContentStream(txt);
    
    for await (const chunk of inferenceRes.stream) {
        outputField.value += chunk.text();
        outputField.scrollTop = outputField.scrollHeight;   
    }

    outputField.value += "\n\n ------ Stream response completed ------ ";
    outputField.scrollTop = outputField.scrollHeight; 
}

// Converts a File object to a Part object.
async function fileToGenerativePart(file: Blob) {
    const base64EncodedDataPromise = new Promise((resolve) => {
      const reader = new FileReader();
      //reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
            return resolve(reader.result.split(',')[1]);
        } else {
            throw new Error ("failed to read image file");
        }
      }
      reader.readAsDataURL(file);
    });
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
  }

async function textAndImageInference(model: GenerativeModel) {
    const inputField = document.getElementById('textAndImageInputField') as HTMLInputElement;
    const outputField = document.getElementById('textAndImageOutputArea') as HTMLInputElement;
    outputField.value = ""

    // Load image
    const testImage = document.getElementById('testImage') as HTMLImageElement;
    const imageContent = await fetch(testImage.src);
    if (!imageContent) {
        console.error("failed to load image...");
        return;
    }
    const imageBlob = await imageContent.blob();
    const inlineImageData = await fileToGenerativePart(imageBlob);
    const txt = inputField.value;

    const request = { contents: [{ role: 'user', parts: [{ text: txt }, inlineImageData] }] } as GenerateContentRequest

    console.log("inference running for:", request);
    const inferenceRes = await model.generateContentStream(request);
    
    for await (const chunk of inferenceRes.stream) {
        outputField.value += chunk.text();
        outputField.scrollTop = outputField.scrollHeight;   
    }

    outputField.value += "\n\n ------ Stream response completed ------ ";
    outputField.scrollTop = outputField.scrollHeight;
}

// --- Event Listener Setup ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("initializing event listeners ...")
    const bTextOnlyOnDevice = document.getElementById('bTextOnlyOnDevice') as HTMLButtonElement;
    const bTextOnlyInCloud = document.getElementById('bTextOnlyInCloud') as HTMLButtonElement;
    const bTextOnlyHybrid = document.getElementById('bTextOnlyHybrid') as HTMLButtonElement;

    const bTextAndImageOnDevice = document.getElementById('bTextAndImageOnDevice') as HTMLButtonElement;
    const bTextAndImageInCloud = document.getElementById('bTextAndImageInCloud') as HTMLButtonElement;
    const bTextAndImageHybrid = document.getElementById('bTextAndImageHybrid') as HTMLButtonElement;

    // Add textOnly listeners
    bTextOnlyOnDevice.addEventListener('click', () => {
        console.log("Text Only On Device Only Inference.")
        textOnlyInference(onDeviceOnlyModel);
    });
    bTextOnlyInCloud.addEventListener('click', () => {
        console.log("Text Only In Cloud Only Inference.")
        textOnlyInference(inCloudOnlyModel);
    });
    bTextOnlyHybrid.addEventListener('click', () => {
        console.log("Text Only Hybrid Inference.")
        textOnlyInference(hybridModel);
    });

    bTextAndImageOnDevice.addEventListener('click', () => {
        console.log("Text And Image On Device Only Inference.")
        textAndImageInference(onDeviceOnlyModel);
    });
    bTextAndImageInCloud.addEventListener('click', () => {
        console.log("Text And Image In Cloud Only Inference.")
        textAndImageInference(inCloudOnlyModel);
    });
    bTextAndImageHybrid.addEventListener('click', () => {
        console.log("Text And Image Hybrid Inference.")
        textAndImageInference(hybridModel);
    });


});

// Note: We are not exporting 'runInference' because this script is directly
// included via <script> tag and will execute in the global scope (or module scope
// depending on exact setup). For more complex apps, you'd use modules.



// SCRATCH CODE
// const model = getGenerativeModel(vertexAI, { 
//     mode: 'prefer_on_device' // NEW
//   });  

// const model = getGenerativeModel(vertexAI, { model: "gemini-2.0-flash" });

// --- The TypeScript Function ---
// Type annotation ': string' specifies inputText must be a string.
// Type annotation ': void' specifies the function doesn't return a value.
// async function runInference(inputText: string): Promise<void> {
//     console.log("Inference invoked.....")
//     // Get the output textarea element
//     // Use type assertion 'as HTMLTextAreaElement' after checking it exists.
//     const outputArea = document.getElementById('outputArea') as HTMLTextAreaElement | null;

//     if (!outputArea) {
//         console.error("Output area element not found!");
//         return; // Exit if the element doesn't exist
//     }

//     // --- Placeholder Logic ---
//     // This is where you would put your actual inference logic.
//     // For now, it just displays what it received and a timestamp.
//     console.log("runInference (TS) called with:", inputText); // Log for debugging

//     // const timestamp = new Date().toLocaleTimeString();

//     const inferenceResult = await model.generateContent(inputText);
//     const result = inferenceResult.response.text()

//     // const result = `( ${timestamp} ) TS Inference received: "${inputText}"\n(Replace this with actual result)`;

//     // Display the result in the output textarea
//     // Type safety ensures 'outputArea' has a 'value' property because we asserted its type.
//     outputArea.value = result;

//     // Future complex logic (API calls, etc.) would go here.
// }

// async function textOnlyInference(model: GenerativeModel) {
//     const inputField = document.getElementById('textOnlyInputField') as HTMLInputElement;
//     const outputField = document.getElementById('textOnlyOutputArea') as HTMLInputElement;
//     outputField.value = "Output will appear here..."

//     const txt = inputField.value;

//     console.log("inference running for:", txt);
//     const inferenceResult = await model.generateContent(txt);
//     outputField.value = inferenceResult.response.text();
// }


// async function textAndImageInference(model: GenerativeModel) {
//     const inputField = document.getElementById('textAndImageInputField') as HTMLInputElement;
//     const outputField = document.getElementById('textAndImageOutputArea') as HTMLInputElement;

//     // Load image
//     const testImage = document.getElementById('testImage') as HTMLImageElement;
//     const imageContent = await fetch(testImage.src);
//     if (!imageContent) {
//         console.error("failed to load image...");
//         return;
//     }
//     const imageBlob = await imageContent.blob();
//     console.log("file type", imageBlob.type);
//     const inlineImageData = await fileToGenerativePart(imageBlob);
//     const txt = inputField.value;

//     outputField.value = "Output will appear here..."

//     console.log( "imageData", inlineImageData);
//     const request = { contents: [{ role: 'user', parts: [{ text: txt }, inlineImageData] }] } as GenerateContentRequest

//     console.log("inference running for image");
//     const inferenceResult = await model.generateContent(request);
//     outputField.value = inferenceResult.response.text();
// }