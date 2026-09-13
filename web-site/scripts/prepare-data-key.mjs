import {randomBytes} from 'node:crypto';
import {writeFileSync,existsSync} from 'node:fs';
const path=process.argv[2];if(!path)throw Error('Supply an absolute private key file path outside the repository');
if(existsSync(path))throw Error('Key file already exists; refusing to overwrite');
writeFileSync(path,JSON.stringify({active:'k1',keys:{k1:randomBytes(32).toString('base64')}}),{flag:'wx',mode:0o600});
console.log('Encryption key created; key material was not printed.');
