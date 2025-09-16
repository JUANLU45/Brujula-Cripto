2025-09-16 12:16:02.647
Step #2 - "pack": Digest: sha256:013f07ad78f08a5c30f4551c892bff7d1cb17e0477928b61e2cfd59259dc3abd
2025-09-16 12:16:02.651
Step #2 - "pack": Status: Downloaded newer image for us-central1-docker.pkg.dev/serverless-runtimes/google-22/run/base:public-image-next
2025-09-16 12:16:04.475
Step #2 - "pack": ===> ANALYZING
2025-09-16 12:16:04.494
Step #2 - "pack": Image with name "us-central1-docker.pkg.dev/brujula-cripto/firebaseapphosting-images/backen-brujula-cripto:build-2025-09-16-003" not found
2025-09-16 12:16:04.494
Step #2 - "pack": ===> DETECTING
2025-09-16 12:16:04.505
Step #2 - "pack": target distro name/version labels not found, reading /etc/os-release file
2025-09-16 12:16:04.600
Step #2 - "pack": 4 of 6 buildpacks participating
2025-09-16 12:16:04.600
Step #2 - "pack": google.nodejs.runtime        1.0.0
2025-09-16 12:16:04.600
Step #2 - "pack": google.nodejs.firebasenextjs 0.0.1
2025-09-16 12:16:04.600
Step #2 - "pack": google.nodejs.pnpm           0.1.0
2025-09-16 12:16:04.600
Step #2 - "pack": google.nodejs.firebasebundle 0.0.1
2025-09-16 12:16:04.601
Step #2 - "pack": ===> RESTORING
2025-09-16 12:16:04.602
Step #2 - "pack": ===> BUILDING
2025-09-16 12:16:04.602
Step #2 - "pack": target distro name/version labels not found, reading /etc/os-release file
2025-09-16 12:16:04.608
Step #2 - "pack": === Node.js - Runtime (google.nodejs.runtime@1.0.0) ===
2025-09-16 12:16:04.608
Step #2 - "pack": 2025/09/16 10:16:04 [DEBUG] GET https://dl.google.com/runtimes/ubuntu2204/nodejs/version.json
2025-09-16 12:16:04.703
Step #2 - "pack": Adding image label google.runtime-version: nodejs20
2025-09-16 12:16:04.704
Step #2 - "pack": 2025/09/16 10:16:04 [DEBUG] GET https://dl.google.com/runtimes/ubuntu2204/nodejs/version.json
2025-09-16 12:16:04.777
Step #2 - "pack": Installing Node.js v20.19.5.
2025-09-16 12:16:04.777
Step #2 - "pack": 2025/09/16 10:16:04 [DEBUG] GET https://dl.google.com/runtimes/ubuntu2204/nodejs/nodejs-20.19.5.tar.gz
2025-09-16 12:16:07.113
Step #2 - "pack": === Node.js - Firebasenextjs (google.nodejs.firebasenextjs@0.0.1) ===
2025-09-16 12:16:07.139
Step #2 - "pack": WARNING: *** You are using a custom build command (your build command is NOT 'next build'), we will accept it as is but will error if output structure is not as expected ***
2025-09-16 12:16:07.759
Step #2 - "pack": ***** CACHE MISS: "npm_modules"
2025-09-16 12:16:07.759
Step #2 - "pack": Installing nextjs adaptor 14.0.18
2025-09-16 12:16:10.292
Step #2 - "pack": === Node.js - Pnpm (google.nodejs.pnpm@0.1.0) ===
2025-09-16 12:16:10.293
Step #2 - "pack": 2025/09/16 10:16:10 [DEBUG] GET https://registry.npmjs.org/pnpm
2025-09-16 12:16:10.450
Step #2 - "pack": ***** CACHE MISS: "pnpm_engine"
2025-09-16 12:16:10.450
Step #2 - "pack": Installing pnpm v10.16.1
2025-09-16 12:16:10.451
Step #2 - "pack": 2025/09/16 10:16:10 [DEBUG] GET https://github.com/pnpm/pnpm/releases/download/v10.16.1/pnpm-linux-x64
2025-09-16 12:16:10.936
Step #2 - "pack": Setting environment variable PATH=/layers/google.nodejs.pnpm/pnpm_engine/bin:/layers/google.nodejs.runtime/node/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
2025-09-16 12:16:10.937
Step #2 - "pack": --------------------------------------------------------------------------------
2025-09-16 12:16:10.937
Step #2 - "pack": Running "pnpm install (CI=true NODE_ENV=development)"
2025-09-16 12:16:11.156
Step #2 - "pack": Scope: all 4 workspace projects
2025-09-16 12:16:11.329
Step #2 - "pack":  ERR_PNPM_OUTDATED_LOCKFILE  Cannot install with "frozen-lockfile" because pnpm-lock.yaml is not up to date with <ROOT>/packages/app/package.json

{
insertId: "9ced4725-e42d-40af-82ac-73bef53ebf96-369"
labels: {
build_step: "Step #2 - "pack""
build_tags: "fah,build-2025-09-16-003,backen-brujula-cripto,09c4feb5d767570be3ba51be81c7fefe9dc55935,p-fah,r-nodejs,b-nodejs_20250907_RC00,bt-PACK"
}
logName: "projects/brujula-cripto/logs/cloudbuild"
receiveTimestamp: "2025-09-16T10:16:12.146409258Z"
resource: {
labels: {
build_id: "9ced4725-e42d-40af-82ac-73bef53ebf96"
build_trigger_id: ""
project_id: "brujula-cripto"
}
type: "build"
}
severity: "INFO"
textPayload: "Step #2 - "pack":  ERR_PNPM_OUTDATED_LOCKFILE  Cannot install with "frozen-lockfile" because pnpm-lock.yaml is not up to date with <ROOT>/packages/app/package.json"
timestamp: "2025-09-16T10:16:11.329956363Z"
}
2025-09-16 12:16:11.329
Step #2 - "pack": 
2025-09-16 12:16:11.329
Step #2 - "pack": Note that in CI environments this setting is true by default. If you still need to run install in such cases, use "pnpm install --no-frozen-lockfile"
2025-09-16 12:16:11.329
Step #2 - "pack": 
2025-09-16 12:16:11.329
Step #2 - "pack":   Failure reason:

{
insertId: "9ced4725-e42d-40af-82ac-73bef53ebf96-373"
labels: {
build_step: "Step #2 - "pack""
build_tags: "fah,build-2025-09-16-003,backen-brujula-cripto,09c4feb5d767570be3ba51be81c7fefe9dc55935,p-fah,r-nodejs,b-nodejs_20250907_RC00,bt-PACK"
}
logName: "projects/brujula-cripto/logs/cloudbuild"
receiveTimestamp: "2025-09-16T10:16:12.146409258Z"
resource: {
labels: {
build_id: "9ced4725-e42d-40af-82ac-73bef53ebf96"
build_trigger_id: ""
project_id: "brujula-cripto"
}
type: "build"
}
severity: "INFO"
textPayload: "Step #2 - "pack":   Failure reason:"
timestamp: "2025-09-16T10:16:11.329969513Z"
}
2025-09-16 12:16:11.329
Step #2 - "pack":   specifiers in the lockfile don't match specifiers in package.json:

{
insertId: "9ced4725-e42d-40af-82ac-73bef53ebf96-374"
labels: {
build_step: "Step #2 - "pack""
build_tags: "fah,build-2025-09-16-003,backen-brujula-cripto,09c4feb5d767570be3ba51be81c7fefe9dc55935,p-fah,r-nodejs,b-nodejs_20250907_RC00,bt-PACK"
}
logName: "projects/brujula-cripto/logs/cloudbuild"
receiveTimestamp: "2025-09-16T10:16:12.146409258Z"
resource: {
labels: {
build_id: "9ced4725-e42d-40af-82ac-73bef53ebf96"
build_trigger_id: ""
project_id: "brujula-cripto"
}
type: "build"
}
severity: "INFO"
textPayload: "Step #2 - "pack":   specifiers in the lockfile don't match specifiers in package.json:"
timestamp: "2025-09-16T10:16:11.329970113Z"
}
2025-09-16 12:16:11.329
Step #2 - "pack": * 2 dependencies were added: eslint@^8.57.0, eslint-config-next@^15.5.3
2025-09-16 12:16:11.329
Step #2 - "pack": 
2025-09-16 12:16:11.376
Step #2 - "pack": Done "pnpm install (CI=true NODE_ENV=development)" (438.616286ms)
2025-09-16 12:16:11.388
Step #2 - "pack": --------------------------------------------------------------------------------
2025-09-16 12:16:11.388
Step #2 - "pack": failed to build: (error ID: b7ee11f5):

{
insertId: "9ced4725-e42d-40af-82ac-73bef53ebf96-379"
labels: {
build_step: "Step #2 - "pack""
build_tags: "fah,build-2025-09-16-003,backen-brujula-cripto,09c4feb5d767570be3ba51be81c7fefe9dc55935,p-fah,r-nodejs,b-nodejs_20250907_RC00,bt-PACK"
}
logName: "projects/brujula-cripto/logs/cloudbuild"
receiveTimestamp: "2025-09-16T10:16:12.146409258Z"
resource: {
labels: {
build_id: "9ced4725-e42d-40af-82ac-73bef53ebf96"
build_trigger_id: ""
project_id: "brujula-cripto"
}
type: "build"
}
severity: "INFO"
textPayload: "Step #2 - "pack": failed to build: (error ID: b7ee11f5):"
timestamp: "2025-09-16T10:16:11.388694200Z"
}
2025-09-16 12:16:11.388
Step #2 - "pack": installing pnpm dependencies: (error ID: 8622936f):
2025-09-16 12:16:11.388
Step #2 - "pack": Scope: all 4 workspace projects
2025-09-16 12:16:11.388
Step #2 - "pack":  ERR_PNPM_OUTDATED_LOCKFILE  Cannot install with "frozen-lockfile" because pnpm-lock.yaml is not up to date with <ROOT>/packages/app/package.json
2025-09-16 12:16:11.388
Step #2 - "pack": 
2025-09-16 12:16:11.388
Step #2 - "pack": Note that in CI environments this setting is true by default. If you still need to run install in such cases, use "pnpm install --no-frozen-lockfile"
2025-09-16 12:16:11.388
Step #2 - "pack": 

{
insertId: "9ced4725-e42d-40af-82ac-73bef53ebf96-385"
labels: {
build_step: "Step #2 - "pack""
build_tags: "fah,build-2025-09-16-003,backen-brujula-cripto,09c4feb5d767570be3ba51be81c7fefe9dc55935,p-fah,r-nodejs,b-nodejs_20250907_RC00,bt-PACK"
}
logName: "projects/brujula-cripto/logs/cloudbuild"
receiveTimestamp: "2025-09-16T10:16:12.146409258Z"
resource: {
labels: {
build_id: "9ced4725-e42d-40af-82ac-73bef53ebf96"
build_trigger_id: ""
project_id: "brujula-cripto"
}
type: "build"
}
severity: "INFO"
textPayload: "Step #2 - "pack": "
timestamp: "2025-09-16T10:16:11.388697900Z"
}
2025-09-16 12:16:11.388
Step #2 - "pack":   Failure reason:
2025-09-16 12:16:11.388
Step #2 - "pack":   specifiers in the lockfile don't match specifiers in package.json:
2025-09-16 12:16:11.388
Step #2 - "pack": * 2 dependencies were added: eslint@^8.57.0, eslint-config-next@^15.5.3
2025-09-16 12:16:11.390
Step #2 - "pack": ERROR: failed to build: exit status 1
{
insertId: "9ced4725-e42d-40af-82ac-73bef53ebf96-389"
labels: {
build_step: "Step #2 - "pack""
build_tags: "fah,build-2025-09-16-003,backen-brujula-cripto,09c4feb5d767570be3ba51be81c7fefe9dc55935,p-fah,r-nodejs,b-nodejs_20250907_RC00,bt-PACK"
}
logName: "projects/brujula-cripto/logs/cloudbuild"
receiveTimestamp: "2025-09-16T10:16:12.146409258Z"
resource: {
labels: {
build_id: "9ced4725-e42d-40af-82ac-73bef53ebf96"
build_trigger_id: ""
project_id: "brujula-cripto"
}
type: "build"
}
severity: "INFO"
textPayload: "Step #2 - "pack": ERROR: failed to build: exit status 1"
timestamp: "2025-09-16T10:16:11.390834460Z"
}
2025-09-16 12:16:12.979
Step #2 - "pack": ERROR: failed to build: executing lifecycle: failed with status code: 51
{
insertId: "9ced4725-e42d-40af-82ac-73bef53ebf96-390"
labels: {
build_step: "Step #2 - "pack""
build_tags: "fah,build-2025-09-16-003,backen-brujula-cripto,09c4feb5d767570be3ba51be81c7fefe9dc55935,p-fah,r-nodejs,b-nodejs_20250907_RC00,bt-PACK"
}
logName: "projects/brujula-cripto/logs/cloudbuild"
receiveTimestamp: "2025-09-16T10:16:13.127856593Z"
resource: {
labels: {
build_id: "9ced4725-e42d-40af-82ac-73bef53ebf96"
build_trigger_id: ""
project_id: "brujula-cripto"
}
type: "build"
}
severity: "INFO"
textPayload: "Step #2 - "pack": ERROR: failed to build: executing lifecycle: failed with status code: 51"
timestamp: "2025-09-16T10:16:12.979210473Z"
}
2025-09-16 12:16:13.222
Finished Step #2 - "pack"
2025-09-16 12:16:13.222
ERROR
{
insertId: "9ced4725-e42d-40af-82ac-73bef53ebf96-392"
labels: {
build_step: "MAIN"
build_tags: "fah,build-2025-09-16-003,backen-brujula-cripto,09c4feb5d767570be3ba51be81c7fefe9dc55935,p-fah,r-nodejs,b-nodejs_20250907_RC00,bt-PACK"
}
logName: "projects/brujula-cripto/logs/cloudbuild"
receiveTimestamp: "2025-09-16T10:16:13.319067494Z"
resource: {
labels: {
build_id: "9ced4725-e42d-40af-82ac-73bef53ebf96"
build_trigger_id: ""
project_id: "brujula-cripto"
}
type: "build"
}
severity: "INFO"
textPayload: "ERROR"
timestamp: "2025-09-16T10:16:13.222477100Z"
}
2025-09-16 12:16:13.222
ERROR: build step 2 "gcr.io/k8s-skaffold/pack" failed: step exited with non-zero status: 1

{
insertId: "9ced4725-e42d-40af-82ac-73bef53ebf96-393"
labels: {
build_step: "MAIN"
build_tags: "fah,build-2025-09-16-003,backen-brujula-cripto,09c4feb5d767570be3ba51be81c7fefe9dc55935,p-fah,r-nodejs,b-nodejs_20250907_RC00,bt-PACK"
}
logName: "projects/brujula-cripto/logs/cloudbuild"
receiveTimestamp: "2025-09-16T10:16:13.319067494Z"
resource: {
labels: {
build_id: "9ced4725-e42d-40af-82ac-73bef53ebf96"
build_trigger_id: ""
project_id: "brujula-cripto"
}
type: "build"
}
severity: "INFO"
textPayload: "ERROR: build step 2 "gcr.io/k8s-skaffold/pack" failed: step exited with non-zero status: 1"
timestamp: "2025-09-16T10:16:13.222504970Z"
}
Se muestran los registros del período especificado en la búsqueda. Para ver más resultados, actualiza tu búsqueda.