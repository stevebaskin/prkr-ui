const fs = require('fs');
const path = require('path');

const placeholder = '__GOOGLE_MAPS_API_KEY__';
const projectRoot = path.resolve(__dirname, '..');
const sourcePath = path.join(projectRoot, 'src', 'index.html');
const outputPath = path.join(projectRoot, 'src', 'index.generated.html');
const envPath = path.join(projectRoot, '.env');

function readDotEnvValue(name) {
    if (!fs.existsSync(envPath)) {
        return '';
    }

    const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
    const prefix = `${name}=`;
    const line = lines.find((entry) => entry.trim().startsWith(prefix));

    if (!line) {
        return '';
    }

    return line.trim().slice(prefix.length).replace(/^['"]|['"]$/g, '').trim();
}

const apiKey = (process.env.GOOGLE_MAPS_API_KEY || readDotEnvValue('GOOGLE_MAPS_API_KEY')).trim();

if (!apiKey) {
    console.error('GOOGLE_MAPS_API_KEY is required in the environment or ui/.env to generate src/index.generated.html.');
    process.exit(1);
}

const source = fs.readFileSync(sourcePath, 'utf8');

if (!source.includes(placeholder)) {
    console.error(`Expected ${sourcePath} to contain ${placeholder}.`);
    process.exit(1);
}

const output = source.replace(placeholder, encodeURIComponent(apiKey));

fs.writeFileSync(outputPath, output);
console.log('Generated src/index.generated.html with Google Maps API key from GOOGLE_MAPS_API_KEY.');
