
ERROR: build step 2 "gcr.io/k8s-skaffold/pack" failed: step exited with non-zero status: 1
ERROR
Finished Step #2 - "pack"
ERROR: failed to build: executing lifecycle: failed with status code: 51
ERROR: failed to build: exit status 1
* 13 dependencies were removed: @upstash/redis@^1.35.3, @types/stripe@^8.0.417, @typescript-eslint/eslint-plugin@^8.43.0, @typescript-eslint/parser@^8.43.0, eslint@^8.0.0, eslint-config-prettier@^10.1.8, eslint-plugin-import@^2.32.0, eslint-plugin-jsx-a11y@^6.10.2, eslint-plugin-prettier@^5.5.4, eslint-plugin-react@^7.37.5, eslint-plugin-react-hooks@^5.2.0, prettier@^3.0.0, prettier-plugin-tailwindcss@^0.6.14
* 4 dependencies were added: autoprefixer@^10.4.14, postcss@^8.4.24, @brujula-cripto/types@workspace:*, tailwindcss@^3.4.0
  specifiers in the lockfile don't match specifiers in package.json:
  Failure reason:
Note that in CI environments this setting is true by default. If you still need to run install in such cases, use "pnpm install --no-frozen-lockfile"
ERR_PNPM_OUTDATED_LOCKFILE  Cannot install with "frozen-lockfile" because pnpm-lock.yaml is not up to date with <ROOT>/package.json
installing pnpm dependencies: (error ID: 8622936f):
failed to build: (error ID: a4b27013):
--------------------------------------------------------------------------------
Done "pnpm install (CI=true NODE_ENV=production)" (598.447758ms)
* 13 dependencies were removed: @upstash/redis@^1.35.3, @types/stripe@^8.0.417, @typescript-eslint/eslint-plugin@^8.43.0, @typescript-eslint/parser@^8.43.0, eslint@^8.0.0, eslint-config-prettier@^10.1.8, eslint-plugin-import@^2.32.0, eslint-plugin-jsx-a11y@^6.10.2, eslint-plugin-prettier@^5.5.4, eslint-plugin-react@^7.37.5, eslint-plugin-react-hooks@^5.2.0, prettier@^3.0.0, prettier-plugin-tailwindcss@^0.6.14
* 4 dependencies were added: autoprefixer@^10.4.14, postcss@^8.4.24, @brujula-cripto/types@workspace:*, tailwindcss@^3.4.0
  specifiers in the lockfile don't match specifiers in package.json:
  Failure reason:
Note that in CI environments this setting is true by default. If you still need to run install in such cases, use "pnpm install --no-frozen-lockfile"
 ERR_PNPM_OUTDATED_LOCKFILE  Cannot install with "frozen-lockfile" because pnpm-lock.yaml is not up to date with <ROOT>/package.json
Running "pnpm install (CI=true NODE_ENV=production)"
--------------------------------------------------------------------------------
Setting environment variable PATH=/layers/google.nodejs.pnpm/pnpm_engine/bin:/layers/google.nodejs.runtime/node/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
2025/09/15 20:22:14 [DEBUG] GET https://github.com/pnpm/pnpm/releases/download/v10.16.1/pnpm-linux-x64
Installing pnpm v10.16.1
***** CACHE MISS: "pnpm_engine"
2025/09/15 20:22:14 [DEBUG] GET https://registry.npmjs.org/pnpm
=== Node.js - Pnpm (google.nodejs.pnpm@0.1.0) ===
Installing nextjs adaptor 14.0.18
***** CACHE MISS: "npm_modules"
=== Node.js - Firebasenextjs (google.nodejs.firebasenextjs@0.0.1) ===
2025/09/15 20:22:04 [DEBUG] GET https://dl.google.com/runtimes/ubuntu2204/nodejs/nodejs-20.19.5.tar.gz
Installing Node.js v20.19.5.
2025/09/15 20:22:03 [DEBUG] GET https://dl.google.com/runtimes/ubuntu2204/nodejs/version.json
Adding image label google.runtime-version: nodejs20
2025/09/15 20:22:02 [DEBUG] GET https://dl.google.com/runtimes/ubuntu2204/nodejs/version.json
=== Node.js - Runtime (google.nodejs.runtime@1.0.0) ===
target distro name/version labels not found, reading /etc/os-release file
===> BUILDING
===> RESTORING
google.nodejs.firebasebundle 0.0.1
google.nodejs.pnpm           0.1.0
google.nodejs.firebasenextjs 0.0.1
google.nodejs.runtime        1.0.0
4 of 6 buildpacks participating
target distro name/version labels not found, reading /etc/os-release file
===> DETECTING
Image with name "us-central1-docker.pkg.dev/brujula-cripto/firebaseapphosting-images/backen-brujula-cripto:build-2025-09-15-007" not found
===> ANALYZING
Status: Downloaded newer image for us-central1-docker.pkg.dev/serverless-runtimes/google-22/run/base:public-image-next
Digest: sha256:013f07ad78f08a5c30f4551c892bff7d1cb17e0477928b61e2cfd59259dc3abd
61cee00d3550: Pull complete
61cee00d3550: Download complete
61cee00d3550: Verifying Checksum
d3053ac7c171: Pull complete
d3053ac7c171: Download complete
d3053ac7c171: Verifying Checksum
61cee00d3550: Pulling fs layer
d3053ac7c171: Pulling fs layer
e6fdc8487bfe: Already exists
public-image-next: Pulling from serverless-runtimes/google-22/run/base
Status: Downloaded newer image for us-central1-docker.pkg.dev/serverless-runtimes/google-22-full/builder/nodejs:nodejs_20250907_RC00
Digest: sha256:808fdae5ab701f3161c878710a66a729a4e641b59405bcabfc3f48110895190c
4f4fb700ef54: Pull complete
e6178d2c0976: Pull complete
34ce8ba30961: Pull complete
26be9f471823: Pull complete
32a82df25502: Pull complete
f62498225526: Pull complete
04d64eaa21a1: Pull complete
141e2ce4e516: Pull complete
a5068009acf2: Pull complete
645fc18b48a7: Pull complete
deb16786ef0a: Pull complete
6f2a27843bec: Pull complete
dd90444dd62d: Pull complete
ce6f506b29a7: Pull complete
e221c05b186e: Pull complete
75fd8f34727f: Pull complete
595f49c579de: Pull complete
f9fd97b5f6be: Pull complete
548e8977beab: Pull complete
854baa11db51: Pull complete
1a82443b3661: Pull complete
fe0a88c014e5: Pull complete
154f0f7b14e3: Pull complete
34ce8ba30961: Download complete
34ce8ba30961: Verifying Checksum
4f4fb700ef54: Download complete
4f4fb700ef54: Verifying Checksum
e6178d2c0976: Download complete
e6178d2c0976: Verifying Checksum
32a82df25502: Download complete
32a82df25502: Verifying Checksum
26be9f471823: Download complete
26be9f471823: Verifying Checksum
f62498225526: Download complete
f62498225526: Verifying Checksum
04d64eaa21a1: Download complete
04d64eaa21a1: Verifying Checksum
a5068009acf2: Download complete
a5068009acf2: Verifying Checksum
141e2ce4e516: Download complete
141e2ce4e516: Verifying Checksum
3ddbc9e6bfc5: Pull complete
6f2a27843bec: Download complete
6f2a27843bec: Verifying Checksum
645fc18b48a7: Download complete
645fc18b48a7: Verifying Checksum
deb16786ef0a: Download complete
deb16786ef0a: Verifying Checksum
dd90444dd62d: Download complete
dd90444dd62d: Verifying Checksum
ce6f506b29a7: Download complete
ce6f506b29a7: Verifying Checksum
e221c05b186e: Download complete
e221c05b186e: Verifying Checksum
badea724a8c0: Pull complete
75fd8f34727f: Download complete
75fd8f34727f: Verifying Checksum
595f49c579de: Download complete
595f49c579de: Verifying Checksum
f9fd97b5f6be: Download complete
f9fd97b5f6be: Verifying Checksum
6cafdb7f18e6: Pull complete
1a82443b3661: Download complete
1a82443b3661: Verifying Checksum
548e8977beab: Download complete
548e8977beab: Verifying Checksum
854baa11db51: Download complete
854baa11db51: Verifying Checksum
5838cd6ac79d: Pull complete
3ddbc9e6bfc5: Download complete
3ddbc9e6bfc5: Verifying Checksum
fe0a88c014e5: Download complete
fe0a88c014e5: Verifying Checksum
154f0f7b14e3: Download complete
154f0f7b14e3: Verifying Checksum
327b25842d12: Pull complete
badea724a8c0: Download complete
badea724a8c0: Verifying Checksum
5838cd6ac79d: Download complete
5838cd6ac79d: Verifying Checksum
6cafdb7f18e6: Download complete
6cafdb7f18e6: Verifying Checksum
327b25842d12: Download complete
327b25842d12: Verifying Checksum
4f4fb700ef54: Waiting
e6178d2c0976: Waiting
26be9f471823: Waiting
4f4fb700ef54: Pulling fs layer
32a82df25502: Waiting
f62498225526: Waiting
e6178d2c0976: Pulling fs layer
34ce8ba30961: Pulling fs layer
04d64eaa21a1: Waiting
26be9f471823: Pulling fs layer
141e2ce4e516: Waiting
a5068009acf2: Waiting
645fc18b48a7: Waiting
deb16786ef0a: Waiting
32a82df25502: Pulling fs layer
6f2a27843bec: Waiting
dd90444dd62d: Waiting
ce6f506b29a7: Waiting
e221c05b186e: Waiting
75fd8f34727f: Waiting
595f49c579de: Waiting
f9fd97b5f6be: Waiting
f62498225526: Pulling fs layer
04d64eaa21a1: Pulling fs layer
548e8977beab: Waiting
854baa11db51: Waiting
1a82443b3661: Waiting
fe0a88c014e5: Waiting
154f0f7b14e3: Waiting
3ddbc9e6bfc5: Waiting
141e2ce4e516: Pulling fs layer
badea724a8c0: Waiting
a5068009acf2: Pulling fs layer
645fc18b48a7: Pulling fs layer
deb16786ef0a: Pulling fs layer
6f2a27843bec: Pulling fs layer
dd90444dd62d: Pulling fs layer
ce6f506b29a7: Pulling fs layer
e221c05b186e: Pulling fs layer
75fd8f34727f: Pulling fs layer
595f49c579de: Pulling fs layer
f9fd97b5f6be: Pulling fs layer
548e8977beab: Pulling fs layer
854baa11db51: Pulling fs layer
1a82443b3661: Pulling fs layer
fe0a88c014e5: Pulling fs layer
154f0f7b14e3: Pulling fs layer
3ddbc9e6bfc5: Pulling fs layer
badea724a8c0: Pulling fs layer
6cafdb7f18e6: Pulling fs layer
5838cd6ac79d: Pulling fs layer
327b25842d12: Pulling fs layer
3e8b0467c58f: Already exists
8dcbdb4aec00: Already exists
e27d8d14a9d0: Already exists
nodejs_20250907_RC00: Pulling from serverless-runtimes/google-22-full/builder/nodejs
gcr.io/k8s-skaffold/pack:latest
Status: Downloaded newer image for gcr.io/k8s-skaffold/pack:latest
Digest: sha256:221c0c0d9a90f46f108bb888a1da9e99c82ff631e8b1c63b0223ea951752bd53
52cb9ac3197f: Pull complete
9776b10d5c8c: Pull complete
396c31837116: Pull complete
52cb9ac3197f: Download complete
52cb9ac3197f: Verifying Checksum
396c31837116: Download complete
396c31837116: Verifying Checksum
9776b10d5c8c: Download complete
9776b10d5c8c: Verifying Checksum
52cb9ac3197f: Pulling fs layer
9776b10d5c8c: Pulling fs layer
396c31837116: Pulling fs layer
latest: Pulling from k8s-skaffold/pack
Using default tag: latest
Pulling image: gcr.io/k8s-skaffold/pack
Starting Step #2 - "pack"
Finished Step #1 - "preparer"
  - RUNTIME
  - BUILD
  availability:
  value: production
- variable: NODE_ENV
  - RUNTIME
  - BUILD
  availability:
  value: 1:442091888028:web:3d32e54527f7b784797c59
- variable: NEXT_PUBLIC_FIREBASE_APP_ID
  - RUNTIME
  - BUILD
  availability:
  value: "442091888028"
- variable: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  - RUNTIME
  - BUILD
  availability:
  value: brujula-cripto.firebasestorage.app
- variable: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  - RUNTIME
  - BUILD
  availability:
  value: brujula-cripto
- variable: NEXT_PUBLIC_FIREBASE_PROJECT_ID
  - RUNTIME
  - BUILD
  availability:
  value: brujula-cripto.firebaseapp.com
- variable: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  - RUNTIME
  - BUILD
  availability:
  value: AIzaSyDzJaHoJ4AuNn28nH4v0gZGb4wRD3ZlEMw
- variable: NEXT_PUBLIC_FIREBASE_API_KEY
  - RUNTIME
  - BUILD
  availability:
  value: '{"apiKey":"AIzaSyDzJaHoJ4AuNn28nH4v0gZGb4wRD3ZlEMw","appId":"1:442091888028:web:3d32e54527f7b784797c59","authDomain":"brujula-cripto.firebaseapp.com","databaseURL":"","messagingSenderId":"442091888028","projectId":"brujula-cripto","storageBucket":"brujula-cripto.firebasestorage.app"}'
- variable: FIREBASE_WEBAPP_CONFIG
  - RUNTIME
  - BUILD
  availability:
  value: '{"databaseURL":"","projectId":"brujula-cripto","storageBucket":"brujula-cripto.firebasestorage.app"}'
- variable: FIREBASE_CONFIG
env:
  cpuAlwaysAllocated: null
  vpcAccess: null
  minInstances: 0
  maxInstances: 10
  concurrency: 80
  memoryMiB: 512
  cpu: 1
runConfig:
2025/09/15 20:21:50 Final app hosting schema:
  - RUNTIME
  - BUILD
  availability:
  value: production
- variable: NODE_ENV
  - RUNTIME
  - BUILD
  availability:
  value: 1:442091888028:web:3d32e54527f7b784797c59
- variable: NEXT_PUBLIC_FIREBASE_APP_ID
  - RUNTIME
  - BUILD
  availability:
  value: "442091888028"
- variable: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  - RUNTIME
  - BUILD
  availability:
  value: brujula-cripto.firebasestorage.app
- variable: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  - RUNTIME
  - BUILD
  availability:
  value: brujula-cripto
- variable: NEXT_PUBLIC_FIREBASE_PROJECT_ID
  - RUNTIME
  - BUILD
  availability:
  value: brujula-cripto.firebaseapp.com
- variable: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  - RUNTIME
  - BUILD
  availability:
  value: AIzaSyDzJaHoJ4AuNn28nH4v0gZGb4wRD3ZlEMw
- variable: NEXT_PUBLIC_FIREBASE_API_KEY
  - RUNTIME
  - BUILD
  availability:
  value: '{"apiKey":"AIzaSyDzJaHoJ4AuNn28nH4v0gZGb4wRD3ZlEMw","appId":"1:442091888028:web:3d32e54527f7b784797c59","authDomain":"brujula-cripto.firebaseapp.com","databaseURL":"","messagingSenderId":"442091888028","projectId":"brujula-cripto","storageBucket":"brujula-cripto.firebasestorage.app"}'
- variable: FIREBASE_WEBAPP_CONFIG
  - RUNTIME
  - BUILD
  availability:
  value: '{"databaseURL":"","projectId":"brujula-cripto","storageBucket":"brujula-cripto.firebasestorage.app"}'
- variable: FIREBASE_CONFIG
env:
  cpuAlwaysAllocated: null
  vpcAccess: null
  minInstances: 0
  maxInstances: 10
  concurrency: 80
  memoryMiB: 512
  cpu: 1
runConfig:
2025/09/15 20:21:50 Final app hosting schema:
us-central1-docker.pkg.dev/serverless-runtimes/utilities/preparer:base_20250803_18_04_RC00
Status: Downloaded newer image for us-central1-docker.pkg.dev/serverless-runtimes/utilities/preparer:base_20250803_18_04_RC00
Digest: sha256:74f45144ae5f4403279d881e73acf9eb6198e88aa7737e15cd7bd6dc528ed5a2
8486ffade544: Pull complete
8486ffade544: Download complete
8486ffade544: Verifying Checksum
8486ffade544: Pulling fs layer
base_20250803_18_04_RC00: Pulling from serverless-runtimes/utilities/preparer
Pulling image: us-central1-docker.pkg.dev/serverless-runtimes/utilities/preparer:base_20250803_18_04_RC00
Starting Step #1 - "preparer"
Finished Step #0 - "ubuntu"
docker.io/library/ubuntu:latest
Status: Downloaded newer image for ubuntu:latest
Digest: sha256:9cbed754112939e914291337b5e554b07ad7c392491dba6daf25eef1332a22e8
latest: Pulling from library/ubuntu
Using default tag: latest
Pulling image: ubuntu
Starting Step #0 - "ubuntu"
BUILD
550742b40e5782d6b31979306f7f950ec28e1602
GitCommit:
HEAD is now at 550742b 3 configuracion despliegue
 * branch            550742b40e5782d6b31979306f7f950ec28e1602 -> FETCH_HEAD
From https://github.com/JUANLU45/Brujula-Cripto
Initialized empty Git repository in /workspace/.git/
hint: 	git branch -m <name>
hint: 
hint: 'development'. The just-created branch can be renamed via this command:
hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and
hint: 
hint: 	git config --global init.defaultBranch <name>
hint: 
hint: of your new repositories, which will suppress this warning, call:
hint: is subject to change. To configure the initial branch name to use in all
hint: Using 'master' as the name for the initial branch. This default branch name
FETCHSOURCE
starting build "52a1b3d6-b079-4429-9c91-db8536b70d16"