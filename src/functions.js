import { VALIDGUESSES } from './ValidWords.js';
import { WORDLIST } from './WordList.js';
export const WORD_LEN = 5;
export const N_TRIES = 6;
export const getWord = () => WORDLIST[Math.floor(Math.random() * WORDLIST.length)];

export function validWord(word) {
	return VALIDGUESSES.includes(word);							 
}

export function isLetter(str) {
 	return str && str.length === 1 && str.match(/[a-z]/i);
}

export function getColors(guess, targetWord) {
  const colors = Array(WORD_LEN).fill(null);
  const indicesOfIncorrectLettersInGuess = [];
  // Tracks the letters (and counts of those letters)
  // in `targetWord` that were not used up by `guess`
  const targetLetters = {};

  for (let i = 0; i < WORD_LEN; ++i) {
    let targetLetter = targetWord[i];

    if (targetLetter in targetLetters) {
      targetLetters[targetLetter]++;
    } else {
      targetLetters[targetLetter] = 1;
    }

    if (guess[i] === targetLetter) {
      colors[i] = "#538d4e";
      targetLetters[targetLetter]--;
    } else {
      indicesOfIncorrectLettersInGuess.push(i);
    }
  }
												
  for (const i of indicesOfIncorrectLettersInGuess) {
    let guessLetter = guess[i];

    if (guessLetter in targetLetters && targetLetters[guessLetter] > 0) {
      colors[i] = "#b59f3b";
      targetLetters[guessLetter]--;
    } else {
      colors[i] = "#3a3a3c";
    }
  }
	return colors;
}