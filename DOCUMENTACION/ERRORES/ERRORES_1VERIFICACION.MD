2025-09-16 13:38:19.711
Step #2 - "pack": 61cee00d3550: Verifying Checksum
2025-09-16 13:38:19.712
Step #2 - "pack": 61cee00d3550: Download complete
2025-09-16 13:38:20.377
Step #2 - "pack": 61cee00d3550: Pull complete
2025-09-16 13:38:20.387
Step #2 - "pack": Digest: sha256:013f07ad78f08a5c30f4551c892bff7d1cb17e0477928b61e2cfd59259dc3abd
2025-09-16 13:38:20.393
Step #2 - "pack": Status: Downloaded newer image for us-central1-docker.pkg.dev/serverless-runtimes/google-22/run/base:public-image-next
2025-09-16 13:38:22.238
Step #2 - "pack": ===> ANALYZING
2025-09-16 13:38:22.259
Step #2 - "pack": Image with name "us-central1-docker.pkg.dev/brujula-cripto/firebaseapphosting-images/backen-brujula-cripto:build-2025-09-16-005" not found
2025-09-16 13:38:22.260
Step #2 - "pack": ===> DETECTING
2025-09-16 13:38:22.274
Step #2 - "pack": target distro name/version labels not found, reading /etc/os-release file
{
insertId: "5b14d812-d879-417e-8225-56a231dbab30-342"
labels: {2}
logName: "projects/brujula-cripto/logs/cloudbuild"
receiveTimestamp: "2025-09-16T11:38:22.551012788Z"
resource: {2}
severity: "INFO"
textPayload: "Step #2 - "pack": target distro name/version labels not found, reading /etc/os-release file"
timestamp: "2025-09-16T11:38:22.274294597Z"
}
2025-09-16 13:38:22.348
Step #2 - "pack": 4 of 6 buildpacks participating
2025-09-16 13:38:22.348
Step #2 - "pack": google.nodejs.runtime        1.0.0
2025-09-16 13:38:22.348
Step #2 - "pack": google.nodejs.firebasenextjs 0.0.1
2025-09-16 13:38:22.348
Step #2 - "pack": google.nodejs.npm            1.1.0
2025-09-16 13:38:22.348
Step #2 - "pack": google.nodejs.firebasebundle 0.0.1
2025-09-16 13:38:22.348
Step #2 - "pack": ===> RESTORING
2025-09-16 13:38:22.348
Step #2 - "pack": ===> BUILDING
2025-09-16 13:38:22.348
Step #2 - "pack": target distro name/version labels not found, reading /etc/os-release file
2025-09-16 13:38:22.356
Step #2 - "pack": === Node.js - Runtime (google.nodejs.runtime@1.0.0) ===
2025-09-16 13:38:22.357
Step #2 - "pack": 2025/09/16 11:38:22 [DEBUG] GET https://dl.google.com/runtimes/ubuntu2204/nodejs/version.json
2025-09-16 13:38:23.427
Step #2 - "pack": Adding image label google.runtime-version: nodejs20
2025-09-16 13:38:23.427
Step #2 - "pack": 2025/09/16 11:38:23 [DEBUG] GET https://dl.google.com/runtimes/ubuntu2204/nodejs/version.json
2025-09-16 13:38:24.414
Step #2 - "pack": Installing Node.js v20.19.5.
2025-09-16 13:38:24.414
Step #2 - "pack": 2025/09/16 11:38:24 [DEBUG] GET https://dl.google.com/runtimes/ubuntu2204/nodejs/nodejs-20.19.5.tar.gz
2025-09-16 13:38:29.203
Step #2 - "pack": === Node.js - Firebasenextjs (google.nodejs.firebasenextjs@0.0.1) ===
2025-09-16 13:38:29.228
Step #2 - "pack": --------------------------------------------------------------------------------

{
insertId: "5b14d812-d879-417e-8225-56a231dbab30-358"
labels: {
build_step: "Step #2 - "pack""
build_tags: "fah,build-2025-09-16-005,backen-brujula-cripto,20bce094a78a85ca316d843249bba8eb3b748055,p-fah,r-nodejs,b-nodejs_20250907_RC00,bt-PACK"
}
logName: "projects/brujula-cripto/logs/cloudbuild"
receiveTimestamp: "2025-09-16T11:38:29.549024647Z"
resource: {
labels: {
build_id: "5b14d812-d879-417e-8225-56a231dbab30"
build_trigger_id: ""
project_id: "brujula-cripto"
}
type: "build"
}
severity: "INFO"
textPayload: "Step #2 - "pack": --------------------------------------------------------------------------------"
timestamp: "2025-09-16T11:38:29.228816968Z"
}
2025-09-16 13:38:29.228
Step #2 - "pack": failed to build: (error ID: d54d8837):

{
insertId: "5b14d812-d879-417e-8225-56a231dbab30-359"
labels: {
build_step: "Step #2 - "pack""
build_tags: "fah,build-2025-09-16-005,backen-brujula-cripto,20bce094a78a85ca316d843249bba8eb3b748055,p-fah,r-nodejs,b-nodejs_20250907_RC00,bt-PACK"
}
logName: "projects/brujula-cripto/logs/cloudbuild"
receiveTimestamp: "2025-09-16T11:38:29.549024647Z"
resource: {
labels: {
build_id: "5b14d812-d879-417e-8225-56a231dbab30"
build_trigger_id: ""
project_id: "brujula-cripto"
}
type: "build"
}
severity: "INFO"
textPayload: "Step #2 - "pack": failed to build: (error ID: d54d8837):"
timestamp: "2025-09-16T11:38:29.228826078Z"
}
2025-09-16 13:38:29.228
Step #2 - "pack": {"reason":"Missing Lock File","code":"fah/missing-lock-file","userFacingMessage":"Missing dependency lock file at path '/workspace'. Please run your package manager's install command and redeploy.","rawLog":""}
2025-09-16 13:38:29.229
Step #2 - "pack": ERROR: failed to build: exit status 1

{
insertId: "5b14d812-d879-417e-8225-56a231dbab30-361"
labels: {
build_step: "Step #2 - "pack""
build_tags: "fah,build-2025-09-16-005,backen-brujula-cripto,20bce094a78a85ca316d843249bba8eb3b748055,p-fah,r-nodejs,b-nodejs_20250907_RC00,bt-PACK"
}
logName: "projects/brujula-cripto/logs/cloudbuild"
receiveTimestamp: "2025-09-16T11:38:29.549024647Z"
resource: {
labels: {
build_id: "5b14d812-d879-417e-8225-56a231dbab30"
build_trigger_id: ""
project_id: "brujula-cripto"
}
type: "build"
}
severity: "INFO"
textPayload: "Step #2 - "pack": ERROR: failed to build: exit status 1"
timestamp: "2025-09-16T11:38:29.229986908Z"
}
2025-09-16 13:38:30.265
Step #2 - "pack": ERROR: failed to build: executing lifecycle: failed with status code: 51

{
insertId: "5b14d812-d879-417e-8225-56a231dbab30-362"
labels: {
build_step: "Step #2 - "pack""
build_tags: "fah,build-2025-09-16-005,backen-brujula-cripto,20bce094a78a85ca316d843249bba8eb3b748055,p-fah,r-nodejs,b-nodejs_20250907_RC00,bt-PACK"
}
logName: "projects/brujula-cripto/logs/cloudbuild"
receiveTimestamp: "2025-09-16T11:38:30.565790982Z"
resource: {
labels: {
build_id: "5b14d812-d879-417e-8225-56a231dbab30"
build_trigger_id: ""
project_id: "brujula-cripto"
}
type: "build"
}
severity: "INFO"
textPayload: "Step #2 - "pack": ERROR: failed to build: executing lifecycle: failed with status code: 51"
timestamp: "2025-09-16T11:38:30.265105149Z"
}
2025-09-16 13:38:30.538
Finished Step #2 - "pack"
{
insertId: "5b14d812-d879-417e-8225-56a231dbab30-363"
labels: {
build_step: "MAIN"
build_tags: "fah,build-2025-09-16-005,backen-brujula-cripto,20bce094a78a85ca316d843249bba8eb3b748055,p-fah,r-nodejs,b-nodejs_20250907_RC00,bt-PACK"
}
logName: "projects/brujula-cripto/logs/cloudbuild"
receiveTimestamp: "2025-09-16T11:38:30.565790982Z"
resource: {
labels: {
build_id: "5b14d812-d879-417e-8225-56a231dbab30"
build_trigger_id: ""
project_id: "brujula-cripto"
}
type: "build"
}
severity: "INFO"
textPayload: "Finished Step #2 - "pack""
timestamp: "2025-09-16T11:38:30.538399936Z"
}
2025-09-16 13:38:30.538
ERROR
{
insertId: "5b14d812-d879-417e-8225-56a231dbab30-364"
labels: {
build_step: "MAIN"
build_tags: "fah,build-2025-09-16-005,backen-brujula-cripto,20bce094a78a85ca316d843249bba8eb3b748055,p-fah,r-nodejs,b-nodejs_20250907_RC00,bt-PACK"
}
logName: "projects/brujula-cripto/logs/cloudbuild"
receiveTimestamp: "2025-09-16T11:38:30.565790982Z"
resource: {
labels: {
build_id: "5b14d812-d879-417e-8225-56a231dbab30"
build_trigger_id: ""
project_id: "brujula-cripto"
}
type: "build"
}
severity: "INFO"
textPayload: "ERROR"
timestamp: "2025-09-16T11:38:30.538520856Z"
}
2025-09-16 13:38:30.538
ERROR: build step 2 "gcr.io/k8s-skaffold/pack" failed: step exited with non-zero status: 1

{
insertId: "5b14d812-d879-417e-8225-56a231dbab30-365"
labels: {
build_step: "MAIN"
build_tags: "fah,build-2025-09-16-005,backen-brujula-cripto,20bce094a78a85ca316d843249bba8eb3b748055,p-fah,r-nodejs,b-nodejs_20250907_RC00,bt-PACK"
}
logName: "projects/brujula-cripto/logs/cloudbuild"
receiveTimestamp: "2025-09-16T11:38:30.565790982Z"
resource: {
labels: {
build_id: "5b14d812-d879-417e-8225-56a231dbab30"
build_trigger_id: ""
project_id: "brujula-cripto"
}
type: "build"
}
severity: "INFO"
textPayload: "ERROR: build step 2 "gcr.io/k8s-skaffold/pack" failed: step exited with non-zero status: 1"
timestamp: "2025-09-16T11:38:30.538539676Z"
}
Se muestran los registros del período especificado en la bú