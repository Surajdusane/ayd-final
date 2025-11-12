import mammoth from 'mammoth';

export const extractDocxVariablesFromFile = async (file: File): Promise<string[]> => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    const fullText = result.value;

    const variableRegex = /{{\s*(\w+)\s*}}/g;
    const tagRegex = /{%\s*(?:if|for)\s+(\w+)/g;

    const variablesSet = new Set<string>();
    let match;

    while ((match = variableRegex.exec(fullText)) !== null) {
      variablesSet.add(match[1]);
    }

    while ((match = tagRegex.exec(fullText)) !== null) {
      variablesSet.add(match[1]);
    }

    return Array.from(variablesSet).sort();
  };