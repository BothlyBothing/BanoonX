export const caesarCipher = (text: string, shift: number, decrypt: boolean = false): string => {
  const s = decrypt ? (26 - (shift % 26)) % 26 : shift % 26;
  return text
    .split("")
    .map((char) => {
      if (char.match(/[a-z]/i)) {
        const code = char.charCodeAt(0);
        let base = 0;
        if (code >= 65 && code <= 90) base = 65;
        else if (code >= 97 && code <= 122) base = 97;

        if (base !== 0) {
          return String.fromCharCode(((code - base + s) % 26) + base);
        }
      }
      // Handle Cyrillic
      if (char.match(/[а-я]/i)) {
        const code = char.charCodeAt(0);
        let base = 0;
        if (code >= 1040 && code <= 1071) base = 1040; // А-Я
        else if (code >= 1072 && code <= 1103) base = 1072; // а-я

        if (base !== 0) {
          return String.fromCharCode(((code - base + s) % 32) + base);
        }
      }
      return char;
    })
    .join("");
};
