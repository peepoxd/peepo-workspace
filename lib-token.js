/**
 * Token Management Library
 * 
 * A utility library for managing tokenization and optimizing token usage
 * in large language model interactions.
 */

class TokenManager {
  constructor() {
    this.cache = new Map();
    this.compressionRules = new Map();
    this.initializeCompressionRules();
  }

  /**
   * Initialize common compression rules for reducing token usage
   */
  initializeCompressionRules() {
    // Common code patterns that can be compressed
    this.compressionRules.set(/\s+/g, ' '); // Multiple whitespace to single space
    this.compressionRules.set(/\/\*[\s\S]*?\*\//g, ''); // Remove block comments
    this.compressionRules.set(/\/\/.*$/gm, ''); // Remove line comments
    this.compressionRules.set(/^\s*[\r\n]/gm, ''); // Remove empty lines
    
    // Common word replacements for technical content
    this.compressionRules.set(/function/g, 'fn');
    this.compressionRules.set(/return/g, 'ret');
    this.compressionRules.set(/console\.log/g, 'log');
    this.compressionRules.set(/document/g, 'doc');
    this.compressionRules.set(/element/g, 'el');
    this.compressionRules.set(/parameter/g, 'param');
    this.compressionRules.set(/variable/g, 'var');
  }

  /**
   * Estimate token count for text (rough approximation)
   * Rule of thumb: 1 token ≈ 4 characters for English text
   */
  estimateTokenCount(text) {
    if (!text || typeof text !== 'string') return 0;
    
    // Cache check
    if (this.cache.has(text)) {
      return this.cache.get(text);
    }

    // Simple estimation: characters / 4 + word count adjustment
    const charCount = text.length;
    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
    const estimated = Math.ceil((charCount / 4) + (wordCount * 0.1));
    
    this.cache.set(text, estimated);
    return estimated;
  }

  /**
   * Compress text to reduce token usage
   */
  compressText(text, options = {}) {
    if (!text || typeof text !== 'string') return text;

    let compressed = text;
    const { 
      removeComments = true, 
      removeExtraWhitespace = true, 
      useAbbreviations = false,
      preserveFormatting = false
    } = options;

    if (removeComments) {
      compressed = compressed.replace(/\/\*[\s\S]*?\*\//g, '');
      compressed = compressed.replace(/\/\/.*$/gm, '');
    }

    if (removeExtraWhitespace && !preserveFormatting) {
      compressed = compressed.replace(/\s+/g, ' ');
      compressed = compressed.replace(/^\s*[\r\n]/gm, '');
    }

    if (useAbbreviations) {
      for (const [pattern, replacement] of this.compressionRules) {
        if (pattern !== /\s+/g && pattern !== /\/\*[\s\S]*?\*\//g && pattern !== /\/\/.*$/gm && pattern !== /^\s*[\r\n]/gm) {
          compressed = compressed.replace(pattern, replacement);
        }
      }
    }

    return compressed.trim();
  }

  /**
   * Split text into chunks with specified token limits
   */
  chunkText(text, maxTokensPerChunk = 1000, overlapTokens = 100) {
    if (!text || typeof text !== 'string') return [];

    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const chunks = [];
    let currentChunk = '';
    let currentTokens = 0;

    for (const sentence of sentences) {
      const sentenceTokens = this.estimateTokenCount(sentence);
      
      if (currentTokens + sentenceTokens <= maxTokensPerChunk) {
        currentChunk += sentence + '. ';
        currentTokens += sentenceTokens;
      } else {
        if (currentChunk.trim()) {
          chunks.push(currentChunk.trim());
        }
        
        // Handle overlap
        if (overlapTokens > 0 && chunks.length > 0) {
          const words = currentChunk.split(' ');
          const overlapWords = words.slice(-Math.floor(overlapTokens / 4));
          currentChunk = overlapWords.join(' ') + ' ' + sentence + '. ';
        } else {
          currentChunk = sentence + '. ';
        }
        currentTokens = this.estimateTokenCount(currentChunk);
      }
    }

    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  }

  /**
   * Optimize prompt by removing unnecessary tokens
   */
  optimizePrompt(prompt, options = {}) {
    const {
      maxTokens = 4000,
      preserveStructure = true,
      aggressiveCompression = false
    } = options;

    let optimized = prompt;
    let currentTokens = this.estimateTokenCount(optimized);

    if (currentTokens <= maxTokens) {
      return optimized;
    }

    // Apply compression
    const compressionOptions = {
      removeComments: true,
      removeExtraWhitespace: !preserveStructure,
      useAbbreviations: aggressiveCompression,
      preserveFormatting: preserveStructure
    };

    optimized = this.compressText(optimized, compressionOptions);
    currentTokens = this.estimateTokenCount(optimized);

    // If still too long, truncate intelligently
    if (currentTokens > maxTokens) {
      const targetLength = Math.floor(optimized.length * (maxTokens / currentTokens));
      const sentences = optimized.split(/[.!?]+/);
      let truncated = '';
      
      for (const sentence of sentences) {
        if (truncated.length + sentence.length <= targetLength) {
          truncated += sentence + '. ';
        } else {
          break;
        }
      }
      
      optimized = truncated.trim();
    }

    return optimized;
  }

  /**
   * Create a summary to reduce token usage while preserving key information
   */
  summarizeForTokens(text, maxTokens = 500) {
    if (!text || typeof text !== 'string') return '';

    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const importantSentences = [];
    
    // Score sentences by importance (simple heuristic)
    const scoredSentences = sentences.map(sentence => {
      let score = 0;
      const words = sentence.toLowerCase().split(/\s+/);
      
      // Boost score for sentences with important keywords
      const importantWords = ['important', 'key', 'main', 'primary', 'essential', 'critical', 'note', 'warning', 'error'];
      const technicalWords = ['function', 'method', 'class', 'variable', 'return', 'if', 'else', 'for', 'while'];
      
      words.forEach(word => {
        if (importantWords.includes(word)) score += 3;
        if (technicalWords.includes(word)) score += 2;
        if (word.length > 6) score += 1;
      });
      
      return { sentence: sentence.trim(), score };
    }).sort((a, b) => b.score - a.score);

    // Select top sentences within token limit
    let tokenCount = 0;
    for (const { sentence } of scoredSentences) {
      const sentenceTokens = this.estimateTokenCount(sentence);
      if (tokenCount + sentenceTokens <= maxTokens) {
        importantSentences.push(sentence);
        tokenCount += sentenceTokens;
      }
    }

    return importantSentences.join('. ') + '.';
  }

  /**
   * Get token usage statistics for analysis
   */
  getTokenStats(text) {
    if (!text || typeof text !== 'string') {
      return {
        originalTokens: 0,
        compressedTokens: 0,
        savings: 0,
        compressionRatio: 0
      };
    }

    const originalTokens = this.estimateTokenCount(text);
    const compressed = this.compressText(text);
    const compressedTokens = this.estimateTokenCount(compressed);
    const savings = originalTokens - compressedTokens;
    const compressionRatio = originalTokens > 0 ? (compressedTokens / originalTokens) : 0;

    return {
      originalTokens,
      compressedTokens,
      savings,
      compressionRatio: Math.round(compressionRatio * 100) / 100,
      text: {
        original: text.length,
        compressed: compressed.length
      }
    };
  }

  /**
   * Clear the token estimation cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Add custom compression rule
   */
  addCompressionRule(pattern, replacement) {
    this.compressionRules.set(pattern, replacement);
  }
}

// Utility functions for quick access
const tokenManager = new TokenManager();

const tokenUtils = {
  /**
   * Quick token count estimation
   */
  count: (text) => tokenManager.estimateTokenCount(text),

  /**
   * Quick text compression
   */
  compress: (text, options) => tokenManager.compressText(text, options),

  /**
   * Quick text chunking
   */
  chunk: (text, maxTokens, overlap) => tokenManager.chunkText(text, maxTokens, overlap),

  /**
   * Quick prompt optimization
   */
  optimize: (prompt, options) => tokenManager.optimizePrompt(prompt, options),

  /**
   * Quick summarization
   */
  summarize: (text, maxTokens) => tokenManager.summarizeForTokens(text, maxTokens),

  /**
   * Quick stats
   */
  stats: (text) => tokenManager.getTokenStats(text)
};

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TokenManager, tokenUtils };
} else if (typeof window !== 'undefined') {
  window.TokenManager = TokenManager;
  window.tokenUtils = tokenUtils;
}