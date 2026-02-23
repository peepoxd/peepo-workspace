# Token Management Library Usage Guide

## Overview

The Token Management Library (`lib-token.js`) is a utility for optimizing token usage in large language model interactions. It provides functions for counting, compressing, chunking, and optimizing text to reduce token consumption.

## Quick Start

### Basic Usage

```javascript
const { tokenUtils } = require('./lib-token.js');

// Count tokens in text
const tokenCount = tokenUtils.count("Hello, world!");
console.log(`Token count: ${tokenCount}`);

// Compress text to reduce tokens
const compressed = tokenUtils.compress(yourCode, {
  removeComments: true,
  useAbbreviations: true
});

// Get compression statistics
const stats = tokenUtils.stats(yourText);
console.log(`Saved ${stats.savings} tokens (${(1 - stats.compressionRatio) * 100}% reduction)`);
```

### Advanced Usage

```javascript
const { TokenManager } = require('./lib-token.js');

const manager = new TokenManager();

// Optimize a prompt for specific token limit
const optimizedPrompt = manager.optimizePrompt(longPrompt, {
  maxTokens: 2000,
  preserveStructure: true,
  aggressiveCompression: false
});

// Split text into manageable chunks
const chunks = manager.chunkText(longDocument, 1000, 100);

// Summarize text to fit token budget
const summary = manager.summarizeForTokens(article, 500);
```

## Core Functions

### Token Counting
- `tokenUtils.count(text)` - Estimate token count for text
- Uses ~4 characters per token heuristic with word count adjustment

### Text Compression
- `tokenUtils.compress(text, options)` - Reduce token usage through compression
- Options:
  - `removeComments: true` - Remove code comments
  - `removeExtraWhitespace: true` - Normalize whitespace
  - `useAbbreviations: false` - Replace common words with shorter forms
  - `preserveFormatting: false` - Keep original formatting

### Text Chunking
- `tokenUtils.chunk(text, maxTokens, overlapTokens)` - Split text into chunks
- Useful for processing long documents that exceed model token limits
- Maintains sentence boundaries and optional overlap

### Prompt Optimization
- `tokenUtils.optimize(prompt, options)` - Optimize prompts for token limits
- Options:
  - `maxTokens: 4000` - Target token limit
  - `preserveStructure: true` - Keep formatting structure
  - `aggressiveCompression: false` - Use aggressive compression techniques

### Summarization
- `tokenUtils.summarize(text, maxTokens)` - Create intelligent summaries
- Scores sentences by importance using keyword analysis
- Preserves most valuable content within token budget

### Statistics
- `tokenUtils.stats(text)` - Get detailed token usage statistics
- Returns original vs compressed token counts, savings, and compression ratio

## Use Cases

### 1. Code Documentation
```javascript
// Compress code for including in prompts
const compressedCode = tokenUtils.compress(sourceCode, {
  removeComments: true,
  removeExtraWhitespace: true,
  useAbbreviations: true
});
```

### 2. Long Document Processing
```javascript
// Split large documents into processable chunks
const documentChunks = tokenUtils.chunk(longDocument, 2000, 200);
for (const chunk of documentChunks) {
  // Process each chunk with LLM
  await processWithLLM(chunk);
}
```

### 3. Prompt Engineering
```javascript
// Ensure prompts fit within model limits
const optimizedPrompt = tokenUtils.optimize(complexPrompt, {
  maxTokens: 3000,
  aggressiveCompression: true
});
```

### 4. Cost Optimization
```javascript
// Analyze token usage to optimize costs
const stats = tokenUtils.stats(prompt);
console.log(`This prompt will cost ~${stats.originalTokens * 0.001}$ in tokens`);
console.log(`After optimization: ~${stats.compressedTokens * 0.001}$`);
console.log(`Savings: ${(stats.savings * 0.001).toFixed(3)}$ (${((1 - stats.compressionRatio) * 100).toFixed(1)}%)`);
```

## Custom Compression Rules

```javascript
const manager = new TokenManager();

// Add domain-specific abbreviations
manager.addCompressionRule(/artificial intelligence/g, 'AI');
manager.addCompressionRule(/natural language processing/g, 'NLP');
manager.addCompressionRule(/machine learning/g, 'ML');

const customCompressed = manager.compressText(text, { useAbbreviations: true });
```

## Testing

Run the test suite to verify functionality:

```bash
node lib-token-test.js
```

The test file demonstrates all major features and provides performance benchmarks.

## Performance Tips

1. **Cache Results**: The library caches token counts - reuse TokenManager instances
2. **Batch Processing**: Process multiple texts with the same manager instance  
3. **Incremental Optimization**: Start with light compression, increase as needed
4. **Domain Adaptation**: Add custom compression rules for your specific use case

## Token Estimation Accuracy

The library uses a simplified estimation method (~4 chars per token). For more accurate counts with specific models, consider integrating with:
- OpenAI's tiktoken library
- HuggingFace tokenizers  
- Model-specific tokenization APIs

## Integration Examples

### With Claude Code
```javascript
// Optimize context before sending to Claude
const optimizedContext = tokenUtils.optimize(context, { maxTokens: 8000 });
```

### With API Calls
```javascript
// Ensure API payload fits within limits
if (tokenUtils.count(payload) > maxTokens) {
  payload = tokenUtils.optimize(payload, { maxTokens });
}
```

### With Documentation
```javascript
// Create token-efficient code documentation
const summary = tokenUtils.summarize(codeDocumentation, 200);
```