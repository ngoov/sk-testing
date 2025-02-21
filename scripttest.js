import { promises as fs } from 'fs';
import { importPKCS8 } from 'jose';

async function testImportKey() {
    try {
        const clientSecret = await fs.readFile('./src/private_key_test.pem', { encoding: 'utf8' });
        console.log('Buffer length:', clientSecret.length);
		console.log('Key data (base64):', clientSecret.toString('base64'));
        const secret = await importPKCS8(
            clientSecret,
            'RS256'
        );
        console.log('Key imported successfully:', secret.algorithms);
    } catch (error) {
        console.error('Error importing key:', error);
    }
}

testImportKey();
