// multiverse-life-backend/index.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } = require("@google/generative-ai");
const { VertexAI } = require('@google-cloud/vertexai');

// Initialize Firebase Admin SDK (if not already initialized)
// This is typically done automatically when deployed to Firebase Functions
// but might be needed for local testing or specific configurations.
// if (!admin.apps.length) {
//   admin.initializeApp();
// }

// TODO: Replace 'YOUR_GEMINI_API_KEY' with your actual Gemini API Key
// In a production environment, use Firebase environment configuration:
// firebase functions:config:set gemini.apikey="YOUR_API_KEY"
// const GEMINI_API_KEY = functions.config().gemini.apikey;
const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY"; // Placeholder for development

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const textModel = genAI.getGenerativeModel({ model: "gemini-pro" });

// TODO: Replace with your actual Google Cloud Project ID and Location for Vertex AI
// In a production environment, use Firebase environment configuration:
// firebase functions:config:set vertexai.projectid="YOUR_PROJECT_ID" vertexai.location="YOUR_LOCATION"
const PROJECT_ID = process.env.GCLOUD_PROJECT || "YOUR_GOOGLE_CLOUD_PROJECT_ID"; // Replace with your GCP Project ID
const LOCATION = "us-central1"; // Replace with your desired region for Vertex AI
const IMAGE_GENERATION_MODEL = "imagegeneration@006"; // Or your specific Imagen model version

// Only initialize VertexAI if PROJECT_ID is not the placeholder
let vertex_ai = null;
let imageModel = null;
if (PROJECT_ID !== "YOUR_GOOGLE_CLOUD_PROJECT_ID") {
  vertex_ai = new VertexAI({ project: PROJECT_ID, location: LOCATION });
  imageModel = vertex_ai.getGenerativeModel({ model: IMAGE_GENERATION_MODEL });
}


/**
 * Helper to format simulation results into a readable text string.
 * @param {object} results The simulation results object.
 * @returns {string} Formatted text content.
 */
function formatResultsForFile(results) {
  let content = "--- Multiverse Life Simulation Report ---\n\n";

  for (const timeframe in results) {
    const data = results[timeframe];
    const displayTimeframe = timeframe === '5years' ? '5년 후' : timeframe === '10years' ? '10년 후' : '20년 후';
    content += `## ${displayTimeframe} 시뮬레이션 결과\n`;
    content += `스토리: ${data.story}\n`;
    content += `직업: ${data.job}\n`;
    content += `예상 연봉: ${data.salary}\n`;
    content += `거주 지역: ${data.residence}\n`;
    content += `라이프스타일: ${data.lifestyle}\n`;
    content += `연애 및 결혼 스토리: ${data.relationships}\n`;
    
    if (data.fateIndex) {
      content += `\n[운명 지수]\n`;
      for (const key in data.fateIndex) {
        content += `${key}: ${data.fateIndex[key]}\n`;
      }
    }
    
    if (data.actionGuideline) {
      content += `\n[행동 지침]\n`;
      data.actionGuideline.forEach(line => {
        content += `- ${line}\n`;
      });
    }

    content += `\n인생 주요 이벤트 타임라인:\n`;
    data.timeline.forEach(item => {
      content += `  - ${item.year}: ${item.event}\n`;
    });
    
    if (data.imageUrl) {
      content += `\n운명의 이미지 URL: ${data.imageUrl}\n`;
    }
    
    content += "\n";
  }
  content += "--- 리포트 끝 ---\n";
  return content;
}

/**
 * Generates an image based on a text prompt using Vertex AI Imagen.
 * Currently returns a dummy image URL for testing.
 * @param {string} prompt The text prompt for image generation.
 * @returns {Promise<string>} A promise that resolves to the image URL.
 */
async function generateImageFromPrompt(prompt) {
  if (PROJECT_ID === "YOUR_GOOGLE_CLOUD_PROJECT_ID") {
     console.warn("Vertex AI Project ID not configured. Returning dummy image URL.");
     return "https://via.placeholder.com/600x400?text=AI+Generated+Image+Placeholder";
  }

  // TODO: Implement actual Vertex AI Imagen API call here
  /*
  const requestPayload = {
    prompt: {
      text: prompt,
    },
    number_of_images: 1,
  };

  try {
    const resp = await imageModel.generateContent(requestPayload);
    const content = resp.response;

    if (content.candidates && content.candidates.length > 0) {
      const imageData = content.candidates[0].image; 
      // Need to convert imageData to a public URL (e.g., upload to Cloud Storage)
      // For now, return a placeholder
      return "https://via.placeholder.com/600x400?text=Real+AI+Image+Coming+Soon";
    } else {
      console.error("No image candidates returned from Imagen API.");
      return "https://via.placeholder.com/600x400?text=Image+Generation+Failed";
    }
  } catch (error) {
    console.error("Error calling Vertex AI Imagen API:", error);
    return "https://via.placeholder.com/600x400?text=Image+Generation+Error";
  }
  */

  // Dummy image URL
  const seed = Math.floor(Math.random() * 1000); // For different placeholder images
  return `https://picsum.photos/seed/${seed}/600/400`;
}


/**
 * HTTP function that simulates a parallel life path based on user input using Gemini LLM.
 * @param {object} data The data object passed to the function.
 * @param {object} context The context object.
 */
exports.simulateLife = functions.https.onCall(async (data, context) => {
  // if (!context.auth) {
  //   throw new functions.https.HttpsError(
  //     'unauthenticated',
  //     'The function must be called while authenticated.'
  //   );
  // }

  const { age, gender, majorJob, personality, currentWorries, scenario, conversationHistory = [] } = data; // Receive conversationHistory

  if (!GEMINI_API_KEY || GEMINI_API_KEY === "YOUR_GEMINI_API_KEY") {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Gemini API Key is not configured. Please replace YOUR_GEMINI_API_KEY with your actual key.'
    );
  }

  let fullPrompt = `당신은 사용자의 입력에 따라 평행세계의 인생 경로를 시뮬레이션해주는 AI 운명 시뮬레이터입니다.
사용자의 현재 정보와 선택지를 바탕으로, 다른 선택을 했을 경우 펼쳐질 5년, 10년, 20년 후의 삶을 상세한 스토리와 데이터 리포트 형태로 생성해주세요.
추가적으로 다음 사항들을 반드시 포함해야 합니다:
1. 각 5년, 10년, 20년 후의 시뮬레이션 결과에 대해 "재물운", "연애운", "건강운" 세 가지 운명 지수를 XX% 형식으로 포함해주세요.
2. 각 5년, 10년, 20년 후의 시뮬레이션 결과에 대해 사용자의 현재 고민(${currentWorries})과 선택(${scenario})을 반영한 3가지 구체적인 "행동 지침"을 포함해주세요.
3. 타임라인 이벤트는 최소 5개 이상 상세하게 작성해주세요.

결과는 반드시 JSON 형식으로 반환해야 하며, 다음 형식을 엄격히 준수해주세요:

{
  "5years": {
    "story": "5년 후의 인생 스토리",
    "job": "예상 직업",
    "salary": "예상 연봉",
    "residence": "예상 거주 지역",
    "lifestyle": "예상 라이프스타일",
    "relationships": "예상 연애 및 결혼 스토리",
    "fateIndex": {
      "재물운": "XX%",
      "연애운": "YY%",
      "건강운": "ZZ%"
    },
    "actionGuideline": [
      "행동 지침 1",
      "행동 지침 2",
      "행동 지침 3"
    ],
    "timeline": [
      {"year": "1년차", "event": "주요 이벤트"},
      {"year": "2년차", "event": "주요 이벤트"}
    ]
  },
  "10years": {
    // 10년 후의 유사한 데이터
  },
  "20years": {
    // 20년 후의 유사한 데이터
  }
}

사용자 정보:
나이: ${age}세
성별: ${gender}
전공 또는 직업: ${majorJob}
성격: ${personality}
현재 고민: ${currentWorries}

선택한 인생 분기: ${scenario}

`;

  // Append conversation history to the prompt for context
  if (conversationHistory && conversationHistory.length > 0) {
    fullPrompt += "\n이전 대화 맥락:\n";
    conversationHistory.forEach(entry => {
      fullPrompt += `${entry.role}: ${entry.text}\n`;
    });
  }

  fullPrompt += "\nJSON 형식 외에 다른 설명은 일절 포함하지 마세요.";


  console.log("Sending prompt to Gemini:", fullPrompt);

  try {
    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
    ];

    const result = await textModel.generateContent(
      {
        contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
        generationConfig,
        safetySettings,
      }
    );
    
    const response = result.response;
    const text = response.text();
    console.log("Gemini raw response:", text);

    // Attempt to parse JSON. Gemini might wrap it in markdown.
    let jsonResponse = text;
    if (text.startsWith('```json')) {
      jsonResponse = text.substring(7, text.lastIndexOf('```'));
    }

    const parsedResults = JSON.parse(jsonResponse);

    // Generate image for the 5-year result (or a relevant one)
    const imagePrompt = `Generate a realistic image of a ${age}-year-old ${gender} ${parsedResults['5years'].job} living in ${parsedResults['5years'].residence} in a ${parsedResults['5years'].lifestyle} setting. Reflect the scenario "${scenario}".`;
    const imageUrl = await generateImageFromPrompt(imagePrompt);
    parsedResults['5years'].imageUrl = imageUrl;


    return {
      success: true,
      results: parsedResults,
    };

  } catch (error) {
    console.error("Error calling Gemini API or parsing response:", error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to get simulation results from AI.',
      error.message
    );
  }
});

/**
 * HTTP function to save simulation results to a text file.
 * Returns the content as a base64 encoded string for download.
 * @param {object} data The data object containing simulation results.
 * @param {object} context The context object.
 */
exports.saveResultsToFile = functions.https.onCall(async (data, context) => {
  // if (!context.auth) {
  //   throw new functions.https.HttpsError(
  //     'unauthenticated',
  //     'The function must be called while authenticated.'
  //   );
  // }

  const simulationResults = data.results;
  if (!simulationResults) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Simulation results are required.'
    );
  }

  const fileContent = formatResultsForFile(simulationResults);
  const base64Content = Buffer.from(fileContent).toString('base64');

  return {
    success: true,
    fileName: 'multiverse_life_report.txt',
    fileContent: base64Content,
    fileType: 'text/plain',
  };
});
