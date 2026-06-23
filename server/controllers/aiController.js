// =============================================
// controllers/aiController.js
// NLP-powered Academic Q&A Assistant
// Uses the 'natural' library (no API key needed)
// =============================================

import natural from 'natural';
import AILog from '../models/AILog.js';
import Resource from '../models/Resource.js';

const tokenizer = new natural.WordTokenizer();
const TfIdf = natural.TfIdf;

// ── Subject keyword mappings ─────────────────
const subjectKeywords = {
  'Mathematics': ['math', 'algebra', 'geometry', 'calculus', 'equation', 'trigonometry', 'fraction', 'quadratic', 'polynomial', 'derivative', 'integral', 'matrix', 'vector', 'probability', 'statistics', 'number', 'angle', 'triangle', 'circle', 'function', 'graph', 'gradient', 'pythagoras', 'theorem', 'formula', 'calculation', 'factorize', 'simplify', 'solve'],
  'Physical Sciences': ['physics', 'chemistry', 'force', 'energy', 'motion', 'velocity', 'acceleration', 'atom', 'molecule', 'element', 'compound', 'reaction', 'bond', 'electricity', 'magnetism', 'wave', 'light', 'gravity', 'newton', 'coulomb', 'pressure', 'temperature', 'gas', 'liquid', 'solid', 'periodic', 'oxidation', 'electron', 'proton', 'neutron'],
  'Life Sciences': ['biology', 'cell', 'organism', 'photosynthesis', 'evolution', 'genetics', 'dna', 'rna', 'protein', 'enzyme', 'ecosystem', 'species', 'reproduction', 'respiration', 'digestion', 'circulatory', 'nervous', 'immune', 'hormone', 'mutation', 'chromosome', 'mitosis', 'meiosis', 'ecology', 'biome', 'adaptation'],
  'English': ['grammar', 'essay', 'poem', 'novel', 'verb', 'noun', 'adjective', 'adverb', 'punctuation', 'sentence', 'paragraph', 'comprehension', 'vocabulary', 'language', 'literature', 'writing', 'reading', 'speech', 'tense', 'clause', 'metaphor', 'simile', 'theme', 'character', 'plot', 'narrative'],
  'Geography': ['geography', 'climate', 'weather', 'continent', 'country', 'ocean', 'river', 'mountain', 'map', 'latitude', 'longitude', 'population', 'urbanisation', 'erosion', 'soil', 'vegetation', 'earthquake', 'volcano', 'plate', 'tectonic', 'biome', 'rainfall', 'drought', 'global warming', 'development'],
  'History': ['history', 'apartheid', 'war', 'revolution', 'colonialism', 'independence', 'government', 'democracy', 'rights', 'africa', 'mandela', 'struggle', 'treaty', 'empire', 'colonisation', 'protest', 'strike', 'election', 'constitution', 'nationalism'],
  'Accounting': ['accounting', 'debit', 'credit', 'balance sheet', 'income statement', 'journal', 'ledger', 'trial balance', 'asset', 'liability', 'equity', 'revenue', 'expense', 'profit', 'loss', 'depreciation', 'cash flow', 'vat', 'budget', 'financial'],
  'Computer Applications Technology': ['computer', 'software', 'hardware', 'internet', 'spreadsheet', 'database', 'word processing', 'excel', 'word', 'powerpoint', 'network', 'operating system', 'file', 'data', 'processing', 'output', 'input', 'storage', 'cat']
};

// ── Knowledge base for each subject ─────────
const knowledgeBase = {
  'Mathematics': {
    'quadratic formula': 'The quadratic formula is x = (-b ± √(b²-4ac)) / 2a. It solves any equation in the form ax² + bx + c = 0. First calculate the discriminant (b²-4ac): if positive, two real solutions; if zero, one solution; if negative, no real solutions.',
    'pythagoras': 'The Pythagorean theorem states that in a right-angled triangle: a² + b² = c², where c is the hypotenuse (longest side). To find a missing side: c = √(a²+b²), or a = √(c²-b²).',
    'gradient': 'The gradient (slope) of a line is calculated as: m = (y₂-y₁)/(x₂-x₁). It tells you how steep the line is. A positive gradient goes up left-to-right; negative goes down.',
    'factorize': 'To factorize a quadratic ax²+bx+c: find two numbers that multiply to give ac and add to give b. For example, x²+5x+6 = (x+2)(x+3) because 2×3=6 and 2+3=5.',
    'probability': 'Probability = (number of favourable outcomes) / (total number of outcomes). It ranges from 0 (impossible) to 1 (certain). P(A or B) = P(A) + P(B) - P(A and B).'
  },
  'Physical Sciences': {
    'newton laws': "Newton's Three Laws: 1) An object stays at rest or in motion unless acted on by a force (inertia). 2) Force = mass × acceleration (F=ma). 3) Every action has an equal and opposite reaction.",
    'ohm law': "Ohm's Law: Voltage (V) = Current (I) × Resistance (R). So I = V/R and R = V/I. Used to calculate electrical circuit values.",
    'photosynthesis equation': '6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂. Plants use carbon dioxide and water with sunlight to produce glucose and oxygen.',
    'atom': 'An atom has a nucleus (containing protons and neutrons) surrounded by electrons in shells. Atomic number = number of protons. Mass number = protons + neutrons.'
  },
  'Life Sciences': {
    'cell': 'Animal cells have: nucleus, cytoplasm, cell membrane, mitochondria, ribosomes. Plant cells also have: cell wall (cellulose), chloroplasts, large central vacuole.',
    'dna': 'DNA (deoxyribonucleic acid) is a double helix made of nucleotides. Each nucleotide has a sugar, phosphate, and a base (A, T, G, C). A pairs with T; G pairs with C.',
    'mitosis': 'Mitosis produces 2 identical daughter cells for growth/repair. Stages: Prophase → Metaphase → Anaphase → Telophase → Cytokinesis.',
    'meiosis': 'Meiosis produces 4 genetically unique gametes (sex cells). It involves two divisions and results in cells with half the chromosomes (haploid).'
  },
  'English': {
    'essay structure': 'A good essay has: Introduction (hook + thesis), Body paragraphs (topic sentence + evidence + explanation), Conclusion (restate thesis + final thought). Each body paragraph covers one main idea.',
    'figure of speech': 'Common figures of speech: Simile (comparing using like/as), Metaphor (direct comparison), Personification (giving human traits to objects), Hyperbole (exaggeration), Alliteration (repeated consonant sounds).',
    'tenses': 'Key tenses: Simple Present (I walk), Present Continuous (I am walking), Simple Past (I walked), Past Continuous (I was walking), Present Perfect (I have walked), Future (I will walk).'
  }
};

// ── Detect subject from question ─────────────
function detectSubject(question) {
  const words = tokenizer.tokenize(question.toLowerCase());
  const scores = {};

  for (const [subject, keywords] of Object.entries(subjectKeywords)) {
    scores[subject] = keywords.filter(kw => {
      const kwWords = kw.toLowerCase().split(' ');
      return kwWords.every(w => words.includes(w) || question.toLowerCase().includes(kw));
    }).length;
  }

  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return best[1] > 0 ? best[0] : 'General';
}

// ── Find answer from knowledge base ─────────
function findAnswer(question, subject) {
  const q = question.toLowerCase();

  if (knowledgeBase[subject]) {
    for (const [key, answer] of Object.entries(knowledgeBase[subject])) {
      const keyWords = key.split(' ');
      if (keyWords.every(w => q.includes(w))) {
        return answer;
      }
    }
  }

  // Search all subjects if not found in detected subject
  for (const [, entries] of Object.entries(knowledgeBase)) {
    for (const [key, answer] of Object.entries(entries)) {
      const keyWords = key.split(' ');
      if (keyWords.every(w => q.includes(w))) {
        return answer;
      }
    }
  }

  return null;
}

// ── Generate a contextual fallback answer ───
function generateFallback(question, subject) {
  const studyTips = {
    'Mathematics': 'For Maths questions, always: 1) Write down what you know, 2) Identify the formula needed, 3) Substitute values carefully, 4) Show all working.',
    'Physical Sciences': 'For Sciences: recall the relevant law or principle, write the formula, substitute your values, and include units in your answer.',
    'Life Sciences': 'For Life Sciences: use diagrams to help remember processes, and learn key definitions — examiners award marks for correct terminology.',
    'English': 'For English: read the question carefully, plan before writing, use topic sentences for each paragraph, and always refer back to the text with evidence.',
    'General': 'Great question! To answer this well, I\'d suggest: breaking it into smaller parts, checking your textbook for definitions, and asking your tutor for a worked example.'
  };

  const tip = studyTips[subject] || studyTips['General'];
  return `I understand you're asking about "${question.substring(0, 60)}..." in the area of ${subject}.\n\n${tip}\n\nFor a more detailed explanation, try posting a Study Request — one of our tutors can walk you through it step by step!`;
}

// POST /api/ai/ask
export const askQuestion = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || question.trim().length < 3) {
      return res.status(400).json({ success: false, message: 'Please enter a valid question.' });
    }

    // Detect subject
    const subject = detectSubject(question);

    // Try to find a direct answer
    let answer = findAnswer(question, subject);
    if (!answer) {
      answer = generateFallback(question, subject);
    }

    // Find related resources from database
    const keywords = tokenizer.tokenize(question.toLowerCase()).filter(w => w.length > 3);
    const relatedResources = await Resource.find({
      $or: [
        { subject: subject },
        { title: { $regex: keywords.slice(0, 3).join('|'), $options: 'i' } }
      ]
    }).limit(3).select('title subject grade type');

    // Log the Q&A interaction
    const log = await AILog.create({
      question,
      answer,
      subject,
      askedBy: req.user ? req.user._id : null,
      relatedResources: relatedResources.map(r => r._id)
    });

    res.json({
      success: true,
      data: {
        question,
        answer,
        subject,
        relatedResources
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/ai/popular — get most asked subjects
export const getPopularTopics = async (req, res) => {
  try {
    const topics = await AILog.aggregate([
      { $group: { _id: '$subject', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    res.json({ success: true, data: topics });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
