# Simple Fix for Render Deployment Issues

To fix both the duplicate questions and answers always appearing in the top-left corner, add this simple code to your Render deployment.

## Step 1: Go to your Render Dashboard

1. Log into your Render dashboard
2. Select your TriviaPaws web service
3. Go to the "Environment" tab

## Step 2: Add a new Environment Variable

Add a new environment variable with:
- **Key**: `RENDER_FIX_SCRIPT`
- **Value**: Copy and paste the entire code below:

```javascript
// ==== FIX SCRIPT START ====
// Patch the server routes to fix shuffling and duplicates

// Store the original Express methods
const originalPost = express.Router.prototype.post;
const originalGet = express.Router.prototype.get;

// Override the post method
express.Router.prototype.post = function(path, ...handlers) {
  // If this is the start endpoint, patch the handler
  if (path === "/api/trivia/start") {
    const originalHandler = handlers[handlers.length - 1];
    
    // Replace with our fixed handler
    handlers[handlers.length - 1] = async function(req, res) {
      try {
        // Call the original handler
        await originalHandler.call(this, req, res);
        
        // After it runs, find the active game that was just created
        const gameId = res.locals.gameId;
        if (!gameId) return;
        
        const gameState = activeGames.get(gameId);
        if (!gameState) return;
        
        // Fix duplicates
        const uniqueQuestions = [];
        const seenQuestions = new Set();
        
        for (const q of gameState.questions) {
          // Clean question text for better duplicate detection
          let cleanText = q.question;
          cleanText = cleanText.replace(/\d+/g, ''); // Remove numbers
          cleanText = cleanText.replace(/\s+/g, ' ').trim().toLowerCase();
          
          if (!seenQuestions.has(cleanText)) {
            seenQuestions.add(cleanText);
            uniqueQuestions.push(q);
          }
        }
        
        gameState.questions = uniqueQuestions;
        
        // Fix answer positions
        gameState.questions = gameState.questions.map(question => {
          // Get the correct answer
          const correctIndex = typeof question.correctIndex === 'number' ? question.correctIndex : 0;
          const correctAnswer = question.options[correctIndex];
          
          // Shuffle options
          const shuffledOptions = [...question.options];
          for (let i = shuffledOptions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
          }
          
          // Find where the correct answer ended up
          const newCorrectIndex = shuffledOptions.findIndex(opt => opt === correctAnswer);
          
          return {
            ...question,
            options: shuffledOptions,
            correctIndex: newCorrectIndex
          };
        });
      } catch (err) {
        console.error("Error in patched start handler:", err);
      }
    };
  }
  
  // Call the original post method
  return originalPost.call(this, path, ...handlers);
};

// Add middleware to save gameId
app.use((req, res, next) => {
  const originalJson = res.json;
  
  res.json = function(data) {
    if (data && data.gameId) {
      res.locals.gameId = data.gameId;
    }
    return originalJson.call(this, data);
  };
  
  next();
});

console.log("✅ Applied fixes for shuffling and duplicates");
// ==== FIX SCRIPT END ====
```

## Step 3: Modify your Start Command

In the "Settings" tab, change your "Start Command" to:

```
node -e "eval(process.env.RENDER_FIX_SCRIPT); require('./server.js')"
```

## Step 4: Save Changes and Deploy

Click "Save Changes" and your app will redeploy with the fixes applied.

## What This Fix Does

1. It patches the `/api/trivia/start` endpoint to:
   - Remove duplicate questions
   - Properly shuffle answer options and track the new correct position

2. It does this without modifying your existing code or database connection.

This is a minimally invasive solution that should fix both issues.