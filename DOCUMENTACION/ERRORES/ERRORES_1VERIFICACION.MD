ERROR: build step 2 "gcr.io/k8s-skaffold/pack" failed: step exited with non-zero status: 1
ERROR
Finished Step #2 - "pack"
ERROR: failed to build: executing lifecycle: failed with status code: 51
ERROR: failed to build: exit status 1
{"reason":"Missing Lock File","code":"fah/missing-lock-file","userFacingMessage":"Missing dependency lock file at path '/workspace'. Please run your package manager's install command and redeploy.","rawLog":""}
failed to build: (error ID: d54d8837):
--------------------------------------------------------------------------------
=== Node.js - Firebasenextjs (google.nodejs.firebasenextjs@0.0.1) ===
2025/09/15 19:12:50 [DEBUG] GET https://dl.google.com/runtimes/ubuntu2204/nodejs/nodejs-22.19.0.tar.gz
Installing Node.js v22.19.0.
2025/09/15 19:12:50 [DEBUG] GET https://dl.google.com/runtimes/ubuntu2204/nodejs/version.json
Adding image label google.runtime-version: nodejs22
2025/09/15 19:12:50 [DEBUG] GET https://dl.google.com/runtimes/ubuntu2204/nodejs/version.json
=== Node.js - Runtime (google.nodejs.runtime@1.0.0) ===
target distro name/version labels not found, reading /etc/os-release file
===> BUILDING
===> RESTORING
google.nodejs.firebasebundle 0.0.1
google.nodejs.npm            1.1.0
google.nodejs.firebasenextjs 0.0.1
google.nodejs.runtime        1.0.0
4 of 6 buildpacks participating
target distro name/version labels not found, reading /etc/os-release file
===> DETECTING
Image with name "us-central1-docker.pkg.dev/brujula-cripto/firebaseapphosting-images/backen-brujula-cripto:build-2025-09-15-005" not found
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
4f4fb700ef54: Download complete
e6178d2c0976: Download complete
e6178d2c0976: Verifying Checksum
34ce8ba30961: Download complete
34ce8ba30961: Verifying Checksum
26be9f471823: Download complete
26be9f471823: Verifying Checksum
f62498225526: Download complete
f62498225526: Verifying Checksum
32a82df25502: Download complete
32a82df25502: Verifying Checksum
141e2ce4e516: Download complete
141e2ce4e516: Verifying Checksum
04d64eaa21a1: Download complete
04d64eaa21a1: Verifying Checksum
a5068009acf2: Download complete
a5068009acf2: Verifying Checksum
3ddbc9e6bfc5: Pull complete
645fc18b48a7: Download complete
645fc18b48a7: Verifying Checksum
6f2a27843bec: Download complete
6f2a27843bec: Verifying Checksum
deb16786ef0a: Download complete
deb16786ef0a: Verifying Checksum
dd90444dd62d: Download complete
dd90444dd62d: Verifying Checksum
e221c05b186e: Download complete
e221c05b186e: Verifying Checksum
ce6f506b29a7: Download complete
ce6f506b29a7: Verifying Checksum
75fd8f34727f: Download complete
75fd8f34727f: Verifying Checksum
f9fd97b5f6be: Download complete
f9fd97b5f6be: Verifying Checksum
badea724a8c0: Pull complete
595f49c579de: Download complete
595f49c579de: Verifying Checksum
6cafdb7f18e6: Pull complete
1a82443b3661: Download complete
1a82443b3661: Verifying Checksum
854baa11db51: Download complete
854baa11db51: Verifying Checksum
548e8977beab: Download complete
548e8977beab: Verifying Checksum
5838cd6ac79d: Pull complete
154f0f7b14e3: Download complete
154f0f7b14e3: Verifying Checksum
fe0a88c014e5: Download complete
fe0a88c014e5: Verifying Checksum
3ddbc9e6bfc5: Download complete
3ddbc9e6bfc5: Verifying Checksum
327b25842d12: Pull complete
badea724a8c0: Download complete
badea724a8c0: Verifying Checksum
6cafdb7f18e6: Download complete
6cafdb7f18e6: Verifying Checksum
5838cd6ac79d: Download complete
5838cd6ac79d: Verifying Checksum
327b25842d12: Download complete
327b25842d12: Verifying Checksum
4f4fb700ef54: Waiting
e6178d2c0976: Waiting
34ce8ba30961: Waiting
26be9f471823: Waiting
32a82df25502: Waiting
f62498225526: Waiting
04d64eaa21a1: Waiting
141e2ce4e516: Waiting
a5068009acf2: Waiting
645fc18b48a7: Waiting
deb16786ef0a: Waiting
6f2a27843bec: Waiting
dd90444dd62d: Waiting
ce6f506b29a7: Waiting
e221c05b186e: Waiting
75fd8f34727f: Waiting
595f49c579de: Waiting
f9fd97b5f6be: Waiting
548e8977beab: Waiting
854baa11db51: Waiting
1a82443b3661: Waiting
fe0a88c014e5: Waiting
154f0f7b14e3: Waiting
3ddbc9e6bfc5: Waiting
badea724a8c0: Waiting
4f4fb700ef54: Pulling fs layer
e6178d2c0976: Pulling fs layer
34ce8ba30961: Pulling fs layer
26be9f471823: Pulling fs layer
32a82df25502: Pulling fs layer
f62498225526: Pulling fs layer
04d64eaa21a1: Pulling fs layer
141e2ce4e516: Pulling fs layer
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
2025/09/15 19:12:37 Final app hosting schema:
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
2025/09/15 19:12:37 Final app hosting schema:
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
3d99c4113d5f44bd2ec1bdf7e5ca81ad8c0cd39c
GitCommit:
HEAD is now at 3d99c41 REPARACION RAIZ PARA DESPLIGUE
 * branch            3d99c4113d5f44bd2ec1bdf7e5ca81ad8c0cd39c -> FETCH_HEAD
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
starting build "c671aacb-d60c-46a7-90de-fc8ed2d3b150"
