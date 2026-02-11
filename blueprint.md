# Multiverse Life: AI Parallel World Life Simulator - Blueprint

## Project Overview

**Service Name:** 멀티버스 라이프 : AI 평행세계 인생 시뮬레이터 (Multiverse Life: AI Parallel World Life Simulator)

**Core Concept:** An interactive web service that allows users to experience hypothetical alternate life paths based on different choices, simulated by AI. It aims to provide a unique "parallel world experience" that encourages self-reflection and highlights the impact of life choices.

**Key Differentiator:** Unlike simple classification tests, this service generates a narrative-driven, personalized life simulation, offering a highly immersive and potentially viral experience. Inspired by high-quality interactive services like `mycolor.kr`, it will focus on deep personalization, rich content, interactive feedback, and demonstrating advanced AI capabilities.

## Detailed Outline: Style, Design, and Features

### 1. User Input (Current Information & Choices)

*   **User Profile:**
    *   Age
    *   Gender
    *   Major/Job
    *   Personality (e.g., via simple questionnaire or keyword input)
    *   Current Worries/Concerns
*   **Deeper Input - Worry Keywords:** Users will select or input relevant worry keywords (e.g., #이직, #짝사랑, #로또) to further personalize the simulation.
*   **Life-Changing Choice Scenarios:** Users will select from predefined "what if" scenarios:
    *   "다른 대학을 갔으면?" (What if I went to a different university?)
    *   "창업을 했으면?" (What if I started a business?)
    *   "해외로 나갔으면?" (What if I went abroad?)
    *   "공무원이 되었으면?" (What if I became a public servant?)
    *   "투자를 시작했으면?" (What if I started investing?)
    *   (Option to suggest a custom scenario - premium feature idea)

### 2. AI Simulation Output & Presentation

*   **Diversified Outcome:** Results will not be limited to simple text but will include:
    *   **Narrative Storyline:** A personalized, natural-language story of the simulated life path for 5, 10, and 20 years in the future.
    *   **Data Report:**
        *   **Career:** Job, estimated annual salary.
        *   **Lifestyle:** Residential area, daily routine, hobbies.
        *   **Relationships:** Love and marriage story.
        *   **Major Life Events Timeline:** Key milestones and events presented chronologically.
    *   **Fate Index:** Quantified values (e.g., 재물운 80%, 연애운 20%) presented visually.
    *   **Action Guidelines:** Specific, actionable tips related to the simulated destiny (e.g., "오늘 3시 이후에 파란색 옷을 입은 사람을 조심하세요").
*   **Visualizations:**
    *   **Illustrations/Images:** AI-generated visuals for future appearance, living environment, daily scenes to enhance immersion. This includes an **'운명의 이미지' (Image of Destiny)** generated via an image generation API.
    *   **Infographics:** Simple charts/graphs for salary trends, lifestyle metrics, and visual representation of Fate Indices (e.g., bar graphs).
*   **Shareable Content:**
    *   Card-style result image optimized for SNS sharing (Instagram, TikTok, YouTube Shorts), featuring key fate indicators and the Image of Destiny.
*   **Business Model (BM) Suggestion:** Placeholder button/text in the results to demonstrate monetization potential (e.g., "당신의 운명을 바꿀 부적 구매하기").

### 3. Monetization Strategy (Future Expansion)

*   **Freemium Model:**
    *   **Free:** Basic simulation with one scenario and summary report.
    *   **Premium Features:**
        *   Detailed PDF life report.
        *   Multi-parallel world comparison.
        *   Specialized analysis (love, wealth, career).
        *   Longer-term simulations (e.g., 30, 40 years).
*   **B2B Expansion:** School career counseling, corporate HR talent analysis, career consulting.

### 4. Technical Approach

*   **Frontend:** Vite + React (TypeScript), modern HTML/CSS/JavaScript (Web Components, CSS variables, ES Modules, async/await, fetch API). Mobile-responsive design.
*   **Backend (Firebase Functions):**
    *   **LLM Integration (Story Generation & Content Diversification):** Utilize Gemini API for natural story generation, fate indices, and action guidelines based on complex prompts and user inputs.
    *   **Function Calling:** Implement mechanisms for AI to trigger external tools, such as saving results to a file.
    *   **Multimodal Integration (Image Generation):** Connect with an image generation API (e.g., Stable Diffusion, DALL-E) to produce "Images of Destiny."
    *   **Probabilistic/Statistical Models:** For realistic simulation of job, salary, residential area, lifestyle, and relationships.
    *   **Conversation Context (Memory):** Implement a robust system to maintain and utilize previous conversation context for more coherent and personalized responses.
*   **Hosting:** Firebase (for frontend hosting and serverless functions for backend and AI integration).

### 5. UI/UX Principles (Refined with MyColor.kr & New Requirements)

*   **Intuitive & Timeline-Centric:** Easy navigation to view life changes across 5, 10, 20 years. The flow from input to results should be seamless and engaging.
*   **Visually Engaging & Dynamic:** Clean, modern aesthetic with a "multiverse" theme. Use of expressive typography, vibrant color palette, subtle textures, and multi-layered drop shadows. **Crucially, focus on high-quality, personalized visual feedback that immediately shows the impact of choices, including AI-generated images and dynamic data visualizations.**
*   **Interactive & Immersive:** Buttons, sliders, and other UI components with elegant use of color and glow effects. **Introduce interactive elements like subtle screen glitches or sound effects upon result generation to heighten immersion.**
*   **Personalization at Core:** The entire experience will revolve around "my parallel life." User inputs, including worry keywords, should tangibly affect the generated story, data, and visuals, fostering a strong sense of ownership and uniqueness.
*   **Clear Value Proposition:** The service will clearly communicate its unique ability to provide an AI-driven, narrative-based "digital life laboratory" for exploring life choices, emphasizing the advanced AI at its core.
*   **Credibility & Transparency:** Highlight the sophisticated AI/LLM models underpinning the simulations to build trust and demonstrate advanced capabilities.
*   **Simplicity and Focus:** Maintain a streamlined user journey from input to result, minimizing cognitive load and maximizing engagement with the core simulation experience.
*   **Accessibility (A11Y):** Designed to be accessible to a wide range of users.
*   **Social Shareability:** Prominent SNS sharing features to drive virality. The shareable card will be a high-quality, appealing visual summary of the results, incorporating the "Image of Destiny."
*   **Data Visualization:** Present complex "Fate Index" data clearly and engagingly using visual elements like bar graphs (e.g., `|||||-----`).
*   **ASCII Art:** Incorporate creative ASCII art (e.g., crystal ball) during loading or result presentation for stylistic flair.
*   **Responsive Optimization:** Ensure the entire application (CLI-like aesthetic on web) is mobile-responsive and functions flawlessly across different screen sizes.

---

## Current Status

The frontend prototype, including user input forms and a placeholder results display with dummy data, has been successfully implemented and pushed to the remote repository. The backend environment for Firebase Functions has also been set up and pushed.

## Next Steps: Implementing Advanced AI Logic & UI/UX

1.  **Backend - Function Calling for File Download:**
    *   Implement a Firebase Function that generates and serves a `.txt` file containing the simulation results.
    *   Integrate this function via Function Calling with the LLM.
    *   Modify the frontend to trigger this function call and handle the file download.
2.  **Backend - LLM Prompt Engineering for Richer Content:**
    *   Refine the LLM prompts to generate dynamic "Fate Indices" and "Action Guidelines."
    *   Ensure the narrative story is more detailed and incorporates "worry keywords" effectively.
3.  **Backend - Multimodal Integration (Image Generation):**
    *   Integrate a suitable Image Generation API (e.g., through a third-party service or a dedicated Firebase Function).
    *   Develop logic to generate image prompts from the LLM's text output.
    *   Return the image URL as part of the simulation results.
4.  **Backend - Conversation Context (Memory):**
    *   Implement a mechanism to store and retrieve conversation history (e.g., using Firestore or a simple in-memory store for short-term context).
    *   Modify LLM prompts to include previous turns for more coherent responses.
5.  **Frontend - Input UI for Worry Keywords:**
    *   Add UI elements for selecting/inputting "worry keywords."
6.  **Frontend - Result Display Enhancements:**
    *   Display "Fate Indices" visually (e.g., with ASCII bar graphs).
    *   Show "Action Guidelines" prominently.
    *   Display the AI-generated "Image of Destiny."
    *   Add the "BM Suggestion" (e.g., "당신의 운명을 바꿀 부적 구매하기" button).
7.  **Frontend - Interactive UI/UX Elements:**
    *   Implement ASCII art for loading/results.
    *   Add subtle glitch effects and sound effects (beep) for engagement.
8.  **Frontend - Responsive Optimization Testing & Refinements:**
    *   Thoroughly test on various screen sizes and orientations, making adjustments as needed.
