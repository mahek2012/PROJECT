const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "YOUR_KEY");

/**
 * Analyzes product reviews to generate sentiment, highlights, and summary.
 * @param {Array} reviews - Array of review objects
 * @returns {Promise<Object>} - Analysis results
 */
module.exports.analyzeReviews = async (reviews) => {
  if (!reviews || reviews.length === 0) {
    return {
      summary: "No reviews yet.",
      sentiment: "Neutral",
      highlights: [],
      pros: [],
      cons: []
    };
  }

  // Try Real AI if key exists
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "YOUR_KEY") {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const reviewTexts = reviews.map(r => r.comment).join("\n");
      
      const prompt = `Analyze these product reviews and return a JSON object with:
      - summary: A 2-line summary of what users think.
      - sentiment: 'Positive', 'Negative', or 'Mixed'.
      - pros: Top 3 positive things mentioned.
      - cons: Top 2-3 complaints or issues.
      
      Reviews:
      ${reviewTexts}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{.*\}/s);
      if (jsonMatch) {
        return JSON.parse(text);
      }
    } catch (error) {
      console.error("Gemini Review Analysis Failed:", error);
      return null;
    }
  }

  // Fallback: Keyword Based Analysis (Simple AI)
  return performKeywordAnalysis(reviews);
};

/**
 * Generate Product Description using AI
 */
module.exports.generateProductDescription = async (productData) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert e-commerce copywriter. Generate a professional, engaging, and SEO-friendly product description.
      
      Product Name: ${productData.name}
      Category: ${productData.category}
      Brand: ${productData.brand}
      
      Format:
      1. A catchy 2-sentence introduction.
      2. Key features (bullet points).
      3. A persuasive closing sentence.
      
      Tone: Professional and persuasive.
      Return only the description text.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Description Generation Failed:", error);
    // Fallback template
    return `Discover the amazing ${productData.name} from ${productData.brand}. This premium ${productData.category} is designed for quality and style. Perfect for daily use and highly recommended by our customers.`;
  }
};

/**
 * Simple keyword-based analysis fallback.
 */
function performKeywordAnalysis(reviews) {
  const positiveWords = ['good', 'great', 'awesome', 'excellent', 'love', 'best', 'quality', 'fast', 'satisfied', 'nice', 'mast', 'acha', 'sahi'];
  const negativeWords = ['bad', 'worst', 'poor', 'slow', 'broken', 'small', 'expensive', 'hate', 'issue', 'problem', 'bakwas', 'bekar'];
  
  let posCount = 0;
  let negCount = 0;
  let pros = new Set();
  let cons = new Set();

  reviews.forEach(r => {
    const text = r.comment.toLowerCase();
    
    // Sentiment detection
    positiveWords.forEach(w => {
      if (text.includes(w)) {
        posCount++;
        if (w === 'quality') pros.add("Good Quality");
        if (w === 'fast') pros.add("Fast Delivery");
        if (w === 'price' || text.includes('sasta')) pros.add("Value for Money");
      }
    });

    negativeWords.forEach(w => {
      if (text.includes(w)) {
        negCount++;
        if (w === 'small' || text.includes('size')) cons.add("Size Issues");
        if (w === 'slow' || text.includes('late')) cons.add("Late Delivery");
        if (w === 'quality' && (text.includes('bad') || text.includes('poor'))) cons.add("Quality Concerns");
      }
    });
  });

  const sentiment = posCount > negCount * 1.5 ? "Positive" : (negCount > posCount ? "Negative" : "Mixed");
  
  // Basic Highlights
  const defaultPros = ["Genuine Product", "Safe Packaging"];
  const finalPros = Array.from(pros).concat(defaultPros).slice(0, 3);
  const finalCons = Array.from(cons).slice(0, 2);

  return {
    summary: sentiment === "Positive" 
      ? "Most users are highly satisfied with the product quality and performance." 
      : "Users have shared mixed feedback, with some concerns regarding size or delivery speed.",
    sentiment,
    pros: finalPros,
    cons: finalCons.length > 0 ? finalCons : ["None reported"]
  };
}
