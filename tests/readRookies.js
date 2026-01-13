import { readFile } from 'fs/promises';
import { join } from 'path';

export async function getRookiePlayers() {
    // Use process.cwd() to get the project root, then navigate to tests/rookies.txt
    const rookiesFilePath = join(process.cwd(), 'tests', 'rookies.txt');
    const fileContent = await readFile(rookiesFilePath, 'utf-8');
    return fileContent
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
}
