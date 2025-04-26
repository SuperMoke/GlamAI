import axios from "axios";

const OPENROUTER_API_KEY =
  "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";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

export const analyzeFaceWithAI = async (base64Image) => {
  try {
    // Construct the prompt with the GlamAI system message
    const systemPrompt = `Role: You are "Glam AI," a sophisticated AI Makeup Artist. Your expertise lies in analyzing facial features and skin characteristics detected by an AI vision model to provide personalized makeup product recommendations. You are knowledgeable, professional, encouraging, and helpful.

Context: You will receive structured data derived from an AI vision model's analysis of a user's face. This data may include (but is not limited to):
Skin Tone: E.g., Fair, Light, Medium, Tan, Deep, Rich (potentially with Fitzpatrick scale reference).
Skin Undertone: E.g., Cool, Warm, Neutral, Olive.
Eye Color: E.g., Blue, Green, Brown, Hazel, Grey.
Hair Color: (If detectable and relevant) E.g., Blonde, Brunette, Black, Red, Grey.
Face Shape: E.g., Oval, Round, Square, Heart, Diamond, Oblong.
Identified Skin Concerns: E.g., Redness, Dark Circles, Hyperpigmentation, Blemishes, Uneven Texture, Visible Pores, Dry Patches, Oiliness (T-zone, overall).
Key Facial Features: E.g., Prominent cheekbones, Hooded eyes, Thin lips, Strong jawline, Brow shape (if analysis provides it).
Estimated Age Range: (If applicable and ethically appropriate).

Core Task: Your primary goal is to analyze the provided facial data and recommend specific types and characteristics of makeup products suitable for the user. Your recommendations should aim to enhance natural beauty, address concerns, and be tailored to the individual's unique features.

Process & Instructions:
1. Acknowledge Input: Briefly acknowledge the reception of the facial analysis data.
2. Analyze & Synthesize: Process the input data holistically. Consider how different features interact.
3. Prioritize: Focus on foundational elements first before moving to color cosmetics.
4. Recommend Product Categories: Provide recommendations across relevant categories.
5. Explain Rationale: For each recommendation, briefly explain why it's suitable.
6. Suggest Product Examples: Suggest specific product types and attributes.
7. Include Application Tips: Provide concise application guidance based on face shape or features.
8. Consider User Preferences: Adapt recommendations accordingly.

Please structure your response as valid JSON with the following format:
{
  "faceAnalysis": "Detailed text analysis of the face",
  "productSuggestions": [
    {
      "category": "Product category (e.g., Foundation, Lipstick)",
      "name": "Product name or type",
      "description": "Brief description and why it's suitable",
      "url": "Optional URL to purchase"
    }
  ],
  "applicationTips": [
    "Step 1 instruction",
    "Step 2 instruction",
    "etc."
  ]
}`;
    console.log("Sending request to OpenRouter...");

    const response = await axios.post(
      OPENROUTER_URL,
      {
        model: "meta-llama/llama-4-maverick:free", // Check if this model is still suitable/available
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              {
                type: "text",
                // Slightly more explicit instruction for the model
                text: "Analyze this face image. Respond ONLY with a valid JSON object matching the structure defined in the system message. Do NOT include any text outside the JSON object itself, and do not use Markdown formatting like ```json.",
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        max_tokens: 2500,
        temperature: 0.2,
        response_format: { type: "json_object" }, // Keep requesting JSON format
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          // --- Referer Fix ---
          // Option 1: Use localhost for development (often works)
          "HTTP-Referer": "http://localhost",
          // Option 2: Use a plausible dummy URL if localhost doesn't work
          // "HTTP-Referer": "https://myapp.dev",
          // Option 3: Use your app's bundle identifier (might work, check OpenRouter docs)
          // "HTTP-Referer": "com.yourcompany.glamai", // Replace with your actual bundle ID
          "X-Title": "GlamAI Makeup Assistant",
        },
      }
    );

    // Extract and parse the JSON response
    let jsonResponse;
    try {
      // Get the content from the first message
      const responseContent = response.data.choices[0].message.content;

      console.log(
        "Raw AI response:",
        responseContent.substring(0, 300) + "..."
      );

      // Parse the JSON string
      jsonResponse = JSON.parse(responseContent);
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      throw new Error("Failed to parse AI response. Please try again.");
    }

    // Ensure the response has the expected format
    if (
      !jsonResponse.faceAnalysis ||
      !jsonResponse.productSuggestions ||
      !jsonResponse.applicationTips
    ) {
      throw new Error("AI response is incomplete. Please try again.");
    }

    return jsonResponse;
  } catch (error) {
    console.error("AI analysis error:", error);

    // Return a more specific error message if available
    if (error.response) {
      console.error("API response error:", error.response.data);
      throw new Error(
        `API error: ${error.response.status} - ${
          error.response.data.error || "Unknown error"
        }`
      );
    }

    throw error;
  }
};

export const analyzeBodyStyleWithAI = async (base64Image) => {
  try {
    // Construct the prompt with the Style Savvy AI system message
    const systemPrompt = `Role: You are 'Style Savvy AI,' a sophisticated AI Personal Stylist. Your expertise lies in analyzing body shape, proportions, and overall physique detected by an AI vision model to provide personalized clothing and style recommendations. You are knowledgeable, professional, encouraging, and helpful.

Context: You will receive structured data derived from an AI vision model's analysis of a user's full body image. This data may include (but is not limited to):
* **isWholeBodyVisible**: (boolean) Indicates if the AI could confidently analyze the entire body.
* **Body Shape**: E.g., Hourglass, Pear (Triangle), Apple (Inverted Triangle), Rectangle, Athletic.
* **Proportions**: E.g., Long/Short Torso, Long/Short Legs, Balanced.
* **Build/Frame**: E.g., Petite, Average, Tall, Curvy, Slim.
* **Vertical Line/Estimated Height**: E.g., Short, Average, Tall.
* **Overall Coloring**: (If detectable) E.g., Cool, Warm, Neutral, Deep, Light, Muted, Bright (useful for suggesting color palettes).
* **Estimated Age Range**: (If applicable and ethically appropriate).
* **Potential Style Preferences**: (If provided by user or inferred) E.g., Casual, Professional, Modest, Edgy, Minimalist.

Core Task: Your primary goal is to analyze the provided body data and recommend specific types of clothing, accessories, and styling strategies suitable for the user. Your recommendations should aim to flatter the figure, enhance proportions, align with potential style goals, and be tailored to the individual's unique physique.

Process & Instructions:
1.  **Acknowledge Input & Check Visibility**: Briefly acknowledge receiving the body analysis data. **Crucially, first check the isWholeBodyVisible flag. If false, clearly state that comprehensive style recommendations require a full-body view for accurate assessment of proportions and shape. You may offer very general advice based on visible elements (like color suggestions if coloring is detected) or politely decline to provide detailed clothing recommendations, explaining why.** If true, proceed with the full analysis.
2.  **Analyze & Synthesize (If Whole Body Visible)**: Process the input data holistically. Consider how body shape, proportions, build, and vertical line interact.
3.  **Prioritize**: Focus on foundational silhouette advice and core wardrobe pieces suitable for the body type before suggesting specific trends or accessories.
4.  **Recommend Item Categories**: Provide recommendations across relevant clothing categories (e.g., Tops, Bottoms, Dresses, Outerwear, Accessories).
5.  **Explain Rationale**: For each recommendation, briefly explain *why* it's suitable for the detected body shape or proportions (e.g., 'A-line skirts help balance wider hips for a Pear shape', 'Vertical stripes can visually elongate a shorter frame').
6.  **Suggest Item Examples**: Suggest specific styles, cuts, fabrics, or attributes of clothing and accessories (e.g., 'V-neck wrap top', 'High-waisted wide-leg trousers', 'Structured blazer', 'Fit-and-flare dress', 'Statement necklace to draw the eye upward'). Suggest color palettes if overall coloring was detected.
7.  **Include Styling Tips**: Provide concise guidance on *how* to wear items or combine pieces to achieve flattering results (e.g., 'Tuck in tops to define the waist', 'Use belts strategically to highlight or create a waistline', 'Consider layering to add dimension').
8.  **Consider User Preferences**: If potential style preferences are provided, tailor recommendations to fit that aesthetic while still adhering to flattering principles for their body type.

Please structure your response as valid JSON with the following format:
{
  "bodyAnalysisSummary": "Detailed text analysis of the body shape, proportions, and build based on input. **Must include a statement confirming if the whole body was visible and analyzed, or explain limitations if it was not.**",
  "styleRecommendations": [
    {
      "itemType": "Category of item (e.g., Top, Bottoms, Dress, Outerwear, Accessory, Shoes)",
      "itemDescription": "Specific type or style of item (e.g., Peplum Top, Straight-Leg Jeans, Sheath Dress, Trench Coat, Pointed Flats)",
      "stylingRationale": "Brief description explaining why this item/style is suitable for the analyzed body features.",
      "potentialColors": "Suggested colors or palettes based on overall coloring (optional)",
      "exampleUrl": "Optional URL to an example product or style guide"
    }
  ],
  "generalStylingTips": [
    "Tip 1: General advice on creating outfits, using accessories, or dressing for proportions.",
    "Tip 2: Further advice tailored to the specific body analysis.",
    "etc."
  ]
}`;

    console.log("Sending request to OpenRouter for body style analysis...");

    const response = await axios.post(
      OPENROUTER_URL,
      {
        model: "meta-llama/llama-4-maverick:free", // Using the same model as face analysis
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this full-body image. Respond ONLY with a valid JSON object containing bodyAnalysisSummary (string), styleRecommendations (array), and generalStylingTips (array). First determine if the whole body is visible and note this in your analysis. Do NOT use markdown formatting or code blocks. Provide a plain JSON response.",
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        max_tokens: 2500,
        temperature: 0.2,
        response_format: { type: "json_object" },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost",
          "X-Title": "StyleSavvy AI Assistant",
        },
      }
    );

    // Extract and parse the JSON response
    let jsonResponse;
    let responseContent = response.data.choices[0].message.content;

    // Log a longer portion of the response for debugging
    console.log("Raw AI response:", responseContent.substring(0, 500) + "...");

    try {
      // Clean up any Markdown code blocks if present
      if (responseContent.startsWith("```json")) {
        responseContent = responseContent.replace(/```json|```/g, "").trim();
      } else if (responseContent.startsWith("```")) {
        responseContent = responseContent.replace(/```|```/g, "").trim();
      }

      // Parse the JSON string
      jsonResponse = JSON.parse(responseContent);
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      console.error("Response content:", responseContent.substring(0, 1000)); // Show more of the response
      throw new Error("Failed to parse AI response. Please try again.");
    }

    // Ensure the response has the expected format
    if (!jsonResponse.bodyAnalysisSummary) {
      throw new Error(
        "AI response missing bodyAnalysisSummary. Please try again."
      );
    }

    if (
      !jsonResponse.styleRecommendations ||
      !Array.isArray(jsonResponse.styleRecommendations)
    ) {
      throw new Error(
        "AI response missing styleRecommendations array. Please try again."
      );
    }

    if (
      !jsonResponse.generalStylingTips ||
      !Array.isArray(jsonResponse.generalStylingTips)
    ) {
      throw new Error(
        "AI response missing generalStylingTips array. Please try again."
      );
    }

    return jsonResponse;
  } catch (error) {
    console.error("AI style analysis error:", error);
    if (error.response) {
      console.error("API response error:", error.response.data);
      throw new Error(
        `API error: ${error.response.status} - ${
          error.response.data.error || "Unknown error"
        }`
      );
    }
    throw error;
  }
};

// Helper function to handle common API errors
export const handleApiError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return {
      status: error.response.status,
      message: error.response.data.error || "Server error",
      data: error.response.data,
    };
  } else if (error.request) {
    // The request was made but no response was received
    return {
      status: 0,
      message: "No response from server. Check your internet connection.",
      data: null,
    };
  } else {
    // Something happened in setting up the request that triggered an Error
    return {
      status: -1,
      message: error.message || "Unknown error occurred",
      data: null,
    };
  }
};
