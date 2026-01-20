import { readFile } from 'fs/promises';
import { join } from 'path';

export async function getRookiePlayers() {
    // Use process.cwd() to get the project root, then navigate to tests/rookies.txt
    const rookiesFilePath = join(process.cwd(), 'tests', 'rookies.txt');
    const fileContent = await readFile(rookiesFilePath, 'utf-8');
    const lines = fileContent.split('\n');
    const result = [];
    
    // Process lines until we hit the first line starting with //
    for (const line of lines) {
        const trimmedLine = line.trim();
        
        // Stop processing if we encounter a comment line
        if (trimmedLine.startsWith('//')) {
            break;
        }
        
        // Add non-empty lines to the result
        if (trimmedLine.length > 0) {
            result.push(trimmedLine);
        }
    }
    
    return result;
}
