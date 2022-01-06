const fs = require('fs').promises;
const FILE_NAME = 'words.txt';
const ALL_LETTERS_REGEX = /^[a-zA-Z]+$/;
const UPPER_CASE_LETTERS_REGEX = /[A-Z]+/;
const ALPHA = Array.from(Array(26)).map((e, i) => i + 97);
const ALPHABET = ALPHA.map((x) => String.fromCharCode(x));
const NUM_LETTERS_IN_WORD = 5;
const NUM_WORDS_REPORTED = 5;

const generateLetterDictionary = () => {
  return ALPHABET.reduce((accumulator, letter) => {
    accumulator[letter] = 0;
    return accumulator;
  }, {});
};

const containsDuplicateLetters = word => {
  const letters = word.split('');
  return new Set(letters).size !== letters.length;
};

const scoreWordWithPosition = (word, positionalLetterDictionary) => {
  const scores = word.split('').map((letter, index) => {
    letter = letter.toLowerCase();
    return positionalLetterDictionary[index][letter];
  });

  return scores.reduce((a, b) => a + b, 0);
};

const scoreWordPositionAgnostic = (word, positionalLetterDictionary) => {
  const scores = word.split('').map((letter) => {
    letter = letter.toLowerCase();
    return positionalLetterDictionary
      .map((x) => x[letter])
      .reduce((a, b) => a + b, 0);
  });
  return scores.reduce((a, b) => a + b, 0);
};

const main = async () => {
  const raw = await fs.readFile(FILE_NAME, { encoding: 'utf-8' });
  const allWords = raw.split('\n');
  const validWords = allWords.filter((word) => {
    return word.length === NUM_LETTERS_IN_WORD && ALL_LETTERS_REGEX.test(word);
  });

  console.log(`There are ${allWords.length} words, ` +
    `${validWords.length} of which are ${NUM_LETTERS_IN_WORD} letters.`);

  const wordDictionary = {};
  const positionalLetterDictionary = [
    generateLetterDictionary(),
    generateLetterDictionary(),
    generateLetterDictionary(),
    generateLetterDictionary(),
    generateLetterDictionary()
  ];

  validWords.forEach((word) => {
    wordDictionary[word] = true;
    word.split('').forEach((letter, index) => {
      letter = letter.toLowerCase();
      positionalLetterDictionary[index][letter] += 1;
    });
  });

  const scoredWords = validWords.map((word) => {
    return {
      word, score: scoreWordWithPosition(word, positionalLetterDictionary)
    };
  }).sort((a, b) => a.score < b.score ? 1 : -1);

  const scoredWordsPositionAgnostic = validWords.map((word) => {
    return {
      word, score: scoreWordPositionAgnostic(word, positionalLetterDictionary)
    };
  }).sort((a, b) => a.score < b.score ? 1 : -1);

  const topWords = scoredWords.slice(0, NUM_WORDS_REPORTED);
  const topWordsNoUpperCaseOrDuplicates = scoredWords
    .filter((x) => {
      return !UPPER_CASE_LETTERS_REGEX.test(x.word)  &&
        !containsDuplicateLetters(x.word);
    })
    .slice(0, NUM_WORDS_REPORTED);
  const topWordsPositionAgnostic = scoredWordsPositionAgnostic
    .slice(0, NUM_WORDS_REPORTED);
  const topWordsPositionAgnosticNoUpperCaseOrDuplicates =
    scoredWordsPositionAgnostic
      .filter((x) => {
        return !UPPER_CASE_LETTERS_REGEX.test(x.word)  &&
          !containsDuplicateLetters(x.word);
      })
      .slice(0, NUM_WORDS_REPORTED);
    

  console.log(`\nTop ${NUM_WORDS_REPORTED} words:`);
  console.table(topWords);
  console.log(`\nTop ${NUM_WORDS_REPORTED} words ` +
    '(no upper case or duplicate letters):');
  console.table(topWordsNoUpperCaseOrDuplicates);
  console.log(`\nTop ${NUM_WORDS_REPORTED} words (letter position agnostic):`);
  console.table(topWordsPositionAgnostic);
  console.log(`\nTop ${NUM_WORDS_REPORTED} words ` +
    '(letter position agnostic, no upper case or duplicate letters):');
  console.table(topWordsPositionAgnosticNoUpperCaseOrDuplicates);
};

return main();
