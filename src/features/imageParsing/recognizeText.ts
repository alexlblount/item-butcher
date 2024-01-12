import Tesseract from 'tesseract.js';

async function recognizeTextFromImage(imageFile: File | string): Promise<string> {
  try {
    const result = await Tesseract.recognize(imageFile, 'eng');
    return cleanLines(result.data.text);
  } catch (error) {
    console.error('OCR error:', error);
    return '';
  }
}

function correctBracketErrors(text: string): string {
  // Regex to find "[number1%" or "[number - number1%" and replace with correct bracket and percent sign
  return text.replace(/\[(\d+\.?\d*( - \d+\.?\d*)?)1%/g, '[$1]%');
}

function cleanLines(ocrText: string): string {
  const validCharsRegex = /[a-zA-Z0-9\s.,:%'*©®()/[\]+-]/;

  return ocrText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) =>
      line
        .split('')
        .filter((char) => validCharsRegex.test(char))
        .join(''),
    )
    .filter((line) => line.replace(/\s/g, '').length > 3)
    .reduce((acc: string[], line: string) => {
      if (line.replace(/\s/g, '').length < 7) {
        if (acc.length > 0) {
          acc[acc.length - 1] += ' ' + line;
        } else {
          acc.push(line);
        }
      } else {
        acc.push(line);
      }
      return acc;
    }, [])
    .map((line) => {
      let str = /^(©|®|\+|\*)\s/.test(line) ? line.substring(2) : line.replace(/©|®/g, 'O');

      str = str
        // "OF" in the exocent font often gets transformed to "OFf"
        // the reduce sometimes creates a beginning or ending space
        .replace(/OFf/g, 'OF')
        // thorns often gets transformed to thoms
        .replace(/Thoms/g, 'Thorns')
        // Reduce consecutive spaces to a single space
        .replace(/\s+/g, ' ')
        // remove leading and trailing spaces
        .trim();

      // correct bracket errors
      return correctBracketErrors(str);
    })
    .join('\n');
}

export { recognizeTextFromImage };
