/**
 * Test file for Token Management Library
 */

const { TokenManager, tokenUtils } = require('./lib-token.js');

// Test data
const sampleCode = `
/**
 * This is a sample function that demonstrates
 * token management and optimization techniques
 */
function calculateUserMetrics(userData, options) {
  // Initialize variables
  const metrics = {};
  const defaultOptions = { includeHistory: true, detailed: false };
  
  // Merge options
  const config = { ...defaultOptions, ...options };
  
  // Process user data
  if (userData && userData.length > 0) {
    userData.forEach(user => {
      console.log('Processing user:', user.name);
      
      // Calculate metrics
      metrics[user.id] = {
        score: user.actions.length * 10,
        engagement: user.lastActive ? calculateEngagement(user.lastActive) : 0,
        status: user.isActive ? 'active' : 'inactive'
      };
    });
  }
  
  return metrics;
}
`;

const sampleText = `
Tokenization is a critical process in natural language processing and machine learning. 
It involves breaking down text into smaller units called tokens, which can be words, 
subwords, or characters. Effective tokenization is essential for reducing computational 
costs and improving model performance. Large language models consume significant amounts 
of tokens during processing, making token optimization crucial for cost-effective operations.
Modern tokenization techniques include byte-pair encoding (BPE), WordPiece, and SentencePiece.
Each method has its own advantages and trade-offs in terms of vocabulary size and token efficiency.
`;

function runTests() {
  console.log('=== Token Management Library Tests ===\n');

  // Test 1: Token counting
  console.log('1. Token Counting:');
  console.log(`Code tokens: ${tokenUtils.count(sampleCode)}`);
  console.log(`Text tokens: ${tokenUtils.count(sampleText)}`);
  console.log();

  // Test 2: Text compression
  console.log('2. Text Compression:');
  const compressed = tokenUtils.compress(sampleCode, { 
    removeComments: true, 
    useAbbreviations: true 
  });
  console.log('Original length:', sampleCode.length);
  console.log('Compressed length:', compressed.length);
  console.log('Compressed preview:', compressed.substring(0, 200) + '...');
  console.log();

  // Test 3: Token statistics
  console.log('3. Token Statistics:');
  const stats = tokenUtils.stats(sampleCode);
  console.log('Stats:', JSON.stringify(stats, null, 2));
  console.log();

  // Test 4: Text chunking
  console.log('4. Text Chunking:');
  const chunks = tokenUtils.chunk(sampleText, 50, 10);
  console.log(`Split into ${chunks.length} chunks:`);
  chunks.forEach((chunk, i) => {
    console.log(`  Chunk ${i + 1} (${tokenUtils.count(chunk)} tokens): ${chunk.substring(0, 60)}...`);
  });
  console.log();

  // Test 5: Prompt optimization
  console.log('5. Prompt Optimization:');
  const longPrompt = sampleText + ' ' + sampleCode + ' ' + sampleText;
  console.log('Original prompt tokens:', tokenUtils.count(longPrompt));
  
  const optimized = tokenUtils.optimize(longPrompt, { 
    maxTokens: 100,
    aggressiveCompression: true 
  });
  console.log('Optimized prompt tokens:', tokenUtils.count(optimized));
  console.log('Optimized preview:', optimized.substring(0, 150) + '...');
  console.log();

  // Test 6: Summarization
  console.log('6. Summarization:');
  const summary = tokenUtils.summarize(sampleText, 30);
  console.log('Original tokens:', tokenUtils.count(sampleText));
  console.log('Summary tokens:', tokenUtils.count(summary));
  console.log('Summary:', summary);
  console.log();

  // Test 7: Custom TokenManager instance
  console.log('7. Custom TokenManager:');
  const customManager = new TokenManager();
  customManager.addCompressionRule(/tokenization/g, 'token');
  customManager.addCompressionRule(/machine learning/g, 'ML');
  
  const customCompressed = customManager.compressText(sampleText, { useAbbreviations: true });
  console.log('Custom compression preview:', customCompressed.substring(0, 150) + '...');
  console.log();

  console.log('=== All tests completed! ===');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = { runTests };