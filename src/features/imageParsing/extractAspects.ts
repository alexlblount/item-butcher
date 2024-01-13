import aspectData from '@src/assets/aspects.master.json';

export interface Aspect {
  aspect: string;
  text: string;
}

export interface AspectDetails {
  imprinted: boolean;
  text: string;
  type: string;
  values: (number | string)[];
}

const aspects = aspectData as Aspect[];
aspects.sort((a, b) => b.text.length - a.text.length);

function convertToNumberOrDefault(value: string): number | string {
  const parsedValue = parseFloat(value);
  return isNaN(parsedValue) ? value : parsedValue;
}

function cleanTextForMatching(text: string): string {
  // Remove all non-letter/number characters except %, collapse spaces, and trim
  return text
    .replace(/[^a-zA-Z0-9%#.\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function removeBracketsAndContents(text: string): string {
  return (
    text
      // Remove brackets and their contents, and any percent sign immediately following
      .replace(/\[.*?\]%?/g, '')
      // Collapse consecutive spaces into one space
      .replace(/\s+/g, ' ')
  );
}

function correctBracketErrors(text: string): string {
  // Regex to find "[number1%" or "[number - number1%" and replace with correct bracket and percent sign
  return text.replace(/\[(\d+\.?\d*( - \d+\.?\d*)?)1%/g, '[$1]%');
}

function extractAspectsAndCleanText(combinedText: string): [AspectDetails | null, string] {
  // const unmodifiedText = combinedText;
  combinedText = cleanTextForMatching(removeBracketsAndContents(correctBracketErrors(combinedText)));

  let extractedAspect = null;

  for (const aspect of aspects) {
    const regexPattern = cleanTextForMatching(aspect.text)
      .replace(/#\.#%|#|(\d+\.\d+%|\d+%|\d+\.\d+|\d+)/g, '(\\d+\\.\\d+|\\d+)%?')
      .replace(/\s+/g, '\\s*');
    const regex = new RegExp(regexPattern, 'gi');

    const match = regex.exec(combinedText);
    if (match) {
      const values = match.slice(1).map(convertToNumberOrDefault);
      const imprinted = combinedText.toLowerCase().includes('imprinted');
      extractedAspect = { text: match[0] || '', type: aspect.aspect, values, imprinted };
      combinedText = combinedText.replace(match[0], '');
      break; // Exit after the first match
    }
  }

  return [extractedAspect, combinedText];
}

export { extractAspectsAndCleanText };
