import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import admin from 'firebase-admin';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const serviceAccountPath = resolve(repoRoot, 'service-account.json');

function fail(message) {
    console.error(`\n${message}\n`);
    process.exit(1);
}

let serviceAccount;
try {
    serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
} catch (err) {
    console.error(err);
    fail(`Could not read ${serviceAccountPath}. Save a Firebase service account key there first.`);
}

const [identifier, roleArg] = process.argv.slice(2);
const nextRole = (roleArg || '').trim().toLowerCase();

if (!identifier || !nextRole) {
    fail('Usage: node scripts/set-staff-role.mjs <uid-or-email> <staff|admin|clear>');
}

if (!['staff', 'admin', 'clear'].includes(nextRole)) {
    fail('Role must be one of: staff, admin, clear');
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const auth = admin.auth();

async function getUser(id) {
    if (id.includes('@')) return auth.getUserByEmail(id);
    return auth.getUser(id);
}

async function main() {
    const user = await getUser(identifier.trim());
    const claims = { ...(user.customClaims || {}) };

    if (nextRole === 'clear') {
        delete claims.role;
    } else {
        claims.role = nextRole;
    }

    const finalClaims = Object.keys(claims).length > 0 ? claims : null;
    await auth.setCustomUserClaims(user.uid, finalClaims);

    console.log('Updated custom claims successfully.');
    console.log(`uid: ${user.uid}`);
    console.log(`email: ${user.email || '(none)'}`);
    console.log(`role: ${nextRole === 'clear' ? '(removed)' : nextRole}`);
    console.log('The user should refresh auth token or sign out/sign in again.');
}

main().catch((err) => {
    console.error('\nFailed to update custom claims:');
    console.error(err);
    process.exit(1);
});
