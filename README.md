# wordle-first-guess

Script to exhaustively determine the best guess for
[Wordle](https://www.powerlanguage.co.uk/wordle/).

## TLDR
_Note:_ A word's "score" is how many words share the same letters at
each of its letter's positions.

```
Top 5 words (letter position agnostic, no upper case or duplicate letters):
┌─────────┬─────────┬───────┐
│ (index) │  word   │ score │
├─────────┼─────────┼───────┤
│    0    │ 'serai' │ 45884 │
│    1    │ 'raise' │ 45884 │
│    2    │ 'arise' │ 45884 │
│    3    │ 'seora' │ 45797 │
│    4    │ 'arose' │ 45797 │
└─────────┴─────────┴───────┘
Top 5 words (no upper case or duplicate letters):
┌─────────┬─────────┬───────┐
│ (index) │  word   │ score │
├─────────┼─────────┼───────┤
│    0    │ 'bares' │ 14878 │
│    1    │ 'cares' │ 14835 │
│    2    │ 'tares' │ 14587 │
│    3    │ 'mares' │ 14548 │
│    4    │ 'pares' │ 14507 │
└─────────┴─────────┴───────┘
```

## Usage
```
nvm use
node index.js
```

_Note:_ Replace `words.txt` with a more up-to-date dictionary of all
words (newline delimited) if desired.

## Algorithm Used

1. Add each word that is exactly 5 characters long to a case-insensitive
   dictionary.

2. For each letter in all valid words, add 1 'point' to a series of parallel
   dictionaries corresponding to the positional index of the letter in the word.

3. Score each valid word by adding up the occurences of each of its letters
   based on the positional letter dictionary at the corresponding index.

```
Example Word: apple
Positional Letter Dictionaries:
[
  {     a: 1, b: 0, c: 0, ... },
  { ... o: 0, p: 1, q: 0, ... },
  { ... o: 0, p: 1, q: 0, ... },
  { ... k: 0, l: 1, m: 0, ... },
  { ... d: 0, e: 1, f: 0, ... }
]
```

## Caveats
- It is difficult to determine the 'cost' of duplicate letters in a guess
- Some words in the dictionary are more likely to be the Wordle than others
- Some of the words in the dictionary are pretty much nonsense
  (see "Aeaea" above)
