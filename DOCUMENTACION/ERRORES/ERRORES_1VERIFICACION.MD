Para ver las entradas anteriores, haz lo siguiente:
2025-09-22 07:24:40.213
Starting new instance. Reason: DEPLOYMENT_ROLLOUT - Instance started due to traffic shifting between revisions due to deployment, traffic split adjustment, or deployment health check.

{
insertId: "68d0dd98000340721fb37364"
labels: {
goog-managed-by: "firebase-app-hosting"
instanceId: "0069c7a98882c19a99e8ae73f59bc19c3844479ed4f1207a06f3b975fc126c54a0f3a66441e28af4e065748f1f6cb88cfcf8d6425705757e82e2e4e3b220ed39ab89dd70d6f27fd8c2c7d444e0db"
scaling_reason: "DEPLOYMENT_ROLLOUT"
}
logName: "projects/brujula-cripto/logs/run.googleapis.com%2Fvarlog%2Fsystem"
receiveTimestamp: "2025-09-22T05:24:40.218416594Z"
resource: {
labels: {
configuration_name: "backen-brujula-cripto"
location: "us-central1"
project_id: "brujula-cripto"
revision_name: "backen-brujula-cripto-build-2025-09-22-004"
service_name: "backen-brujula-cripto"
}
type: "cloud_run_revision"
}
severity: "INFO"
textPayload: "Starting new instance. Reason: DEPLOYMENT_ROLLOUT - Instance started due to traffic shifting between revisions due to deployment, traffic split adjustment, or deployment health check."
timestamp: "2025-09-22T05:24:40.213106Z"
}
2025-09-22 07:24:41.232
file:///workspace/.next/standalone/server.js:1
2025-09-22 07:24:41.232
const path = require('path')
2025-09-22 07:24:41.232
             ^
2025-09-22 07:24:41.232
ReferenceError: require is not defined in ES module scope, you can use import instead
2025-09-22 07:24:41.232
This file is being treated as an ES module because it has a '.js' file extension and '/workspace/.next/standalone/package.json' contains "type": "module". To treat it as a CommonJS script, rename it to use the '.cjs' file extension.
2025-09-22 07:24:41.232
    at file:///workspace/.next/standalone/server.js:1:14
2025-09-22 07:24:41.232
    at ModuleJob.run (node:internal/modules/esm/module_job:325:25)
2025-09-22 07:24:41.232
    at async ModuleLoader.import (node:internal/modules/esm/loader:606:24)

{
insertId: "68d0dd9900038b7eb90d1e98"
labels: {2}
logName: "projects/brujula-cripto/logs/run.googleapis.com%2Fstderr"
receiveTimestamp: "2025-09-22T05:24:41.572079505Z"
resource: {2}
textPayload: "    at async ModuleLoader.import (node:internal/modules/esm/loader:606:24)"
timestamp: "2025-09-22T05:24:41.232318Z"
}
2025-09-22 07:24:41.232
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5)

{
insertId: "68d0dd9900038b839ed895a3"
labels: {
goog-managed-by: "firebase-app-hosting"
instanceId: "0069c7a98882c19a99e8ae73f59bc19c3844479ed4f1207a06f3b975fc126c54a0f3a66441e28af4e065748f1f6cb88cfcf8d6425705757e82e2e4e3b220ed39ab89dd70d6f27fd8c2c7d444e0db"
}
logName: "projects/brujula-cripto/logs/run.googleapis.com%2Fstderr"
receiveTimestamp: "2025-09-22T05:24:41.572079505Z"
resource: {
labels: {
configuration_name: "backen-brujula-cripto"
location: "us-central1"
project_id: "brujula-cripto"
revision_name: "backen-brujula-cripto-build-2025-09-22-004"
service_name: "backen-brujula-cripto"
}
type: "cloud_run_revision"
}
textPayload: "    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5)"
timestamp: "2025-09-22T05:24:41.232323Z"
}
2025-09-22 07:24:41.232
Node.js v20.19.5

{
insertId: "68d0dd9900038b880dd5223e"
labels: {
goog-managed-by: "firebase-app-hosting"
instanceId: "0069c7a98882c19a99e8ae73f59bc19c3844479ed4f1207a06f3b975fc126c54a0f3a66441e28af4e065748f1f6cb88cfcf8d6425705757e82e2e4e3b220ed39ab89dd70d6f27fd8c2c7d444e0db"
}
logName: "projects/brujula-cripto/logs/run.googleapis.com%2Fstderr"
receiveTimestamp: "2025-09-22T05:24:41.572079505Z"
resource: {
labels: {
configuration_name: "backen-brujula-cripto"
location: "us-central1"
project_id: "brujula-cripto"
revision_name: "backen-brujula-cripto-build-2025-09-22-004"
service_name: "backen-brujula-cripto"
}
type: "cloud_run_revision"
}
textPayload: "Node.js v20.19.5"
timestamp: "2025-09-22T05:24:41.232328Z"
}
2025-09-22 07:24:41.731
Container called exit(1).

{
insertId: "68d0dd99000b2813bb5b83b7"
labels: {
container_name: "backen-brujula-cripto-1"
goog-managed-by: "firebase-app-hosting"
instanceId: "0069c7a98882c19a99e8ae73f59bc19c3844479ed4f1207a06f3b975fc126c54a0f3a66441e28af4e065748f1f6cb88cfcf8d6425705757e82e2e4e3b220ed39ab89dd70d6f27fd8c2c7d444e0db"
}
logName: "projects/brujula-cripto/logs/run.googleapis.com%2Fvarlog%2Fsystem"
receiveTimestamp: "2025-09-22T05:24:41.881917284Z"
resource: {
labels: {
configuration_name: "backen-brujula-cripto"
location: "us-central1"
project_id: "brujula-cripto"
revision_name: "backen-brujula-cripto-build-2025-09-22-004"
service_name: "backen-brujula-cripto"
}
type: "cloud_run_revision"
}
severity: "WARNING"
textPayload: "Container called exit(1)."
timestamp: "2025-09-22T05:24:41.731047912Z"
}
2025-09-22 07:24:41.831
Default STARTUP TCP probe failed 1 time consecutively for container "backen-brujula-cripto-1" on port 8080. The instance was not started.
Connection failed with status CANCELLED.

{
insertId: "68d0dd99000caf3991c1ed9f"
labels: {2}
logName: "projects/brujula-cripto/logs/run.googleapis.com%2Fvarlog%2Fsystem"
receiveTimestamp: "2025-09-22T05:24:41.881917284Z"
resource: {2}
severity: "ERROR"
textPayload: "Default STARTUP TCP probe failed 1 time consecutively for container "backen-brujula-cripto-1" on port 8080. The instance was not started.
Connection failed with status CANCELLED."
timestamp: "2025-09-22T05:24:41.831289Z"
}
2025-09-22 07:24:41.846

Cloud Run

UpdateService

…cken-brujula-cripto-build-2025-09-22-004
Ready condition status changed to False for Revision backen-brujula-cripto-build-2025-09-22-004 with message: The user-provided container failed to start and listen on the port defined provided by the PORT=8080 environment variable within the allocated timeout. This can happen when the container port is misconfigured or if the timeout is too short. The health check timeout can be extended. Logs for this revision might contain more information.

Logs URL: https://console.cloud.google.com/logs/viewer?project=brujula-cripto&resource=cloud_run_revision/service_name/backen-brujula-cripto/revision_name/backen-brujula-cripto-build-2025-09-22-004&advancedFilter=resource.type%3D%22cloud_run_revision%22%0Aresource.labels.service_name%3D%22backen-brujula-cripto%22%0Aresource.labels.revision_name%3D%22backen-brujula-cripto-build-2025-09-22-004%22 
For more troubleshooting guidance, see https://cloud.google.com/run/docs/troubleshooting#container-failed-to-start

{
insertId: "-26z79jd5p7u"
logName: "projects/brujula-cripto/logs/cloudaudit.googleapis.com%2Fsystem_event"
protoPayload: {
@type: "type.googleapis.com/google.cloud.audit.AuditLog"
methodName: "/Services.UpdateService"
resourceName: "namespaces/brujula-cripto/revisions/backen-brujula-cripto-build-2025-09-22-004"
response: {
@type: "type.googleapis.com/google.cloud.run.v1.Revision"
apiVersion: "serving.knative.dev/v1"
kind: "Revision"
metadata: {
annotations: {
autoscaling.knative.dev/maxScale: "10"
autoscaling.knative.dev/minScale: "0"
run.googleapis.com/cpu-throttling: "true"
run.googleapis.com/execution-environment: "gen1"
run.googleapis.com/ingress: "all"
run.googleapis.com/operation-id: "a18ca092-b08b-48d1-b4a2-8e6090aaf1be"
run.googleapis.com/secrets: "secret-alias-1:projects/442091888028/secrets/NEXT_PUBLIC_FIREBASE_API_KEY,secret-alias-10:projects/442091888028/secrets/NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,secret-alias-11:projects/442091888028/secrets/NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_1H,secret-alias-12:projects/442091888028/secrets/NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_5H,secret-alias-13:projects/442091888028/secrets/NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_10H,secret-alias-2:projects/442091888028/secrets/NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,secret-alias-3:projects/442091888028/secrets/NEXT_PUBLIC_FIREBASE_PROJECT_ID,secret-alias-4:projects/442091888028/secrets/NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,secret-alias-5:projects/442091888028/secrets/NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,secret-alias-6:projects/442091888028/secrets/NEXT_PUBLIC_FIREBASE_APP_ID,secret-alias-7:projects/442091888028/secrets/NEXT_PUBLIC_API_BASE_URL,secret-alias-8:projects/442091888028/secrets/NEXT_PUBLIC_BASE_URL,secret-alias-9:projects/442091888028/secrets/NEXT_PUBLIC_APP_URL"
run.googleapis.com/sessionAffinity: "false"
run.googleapis.com/startup-cpu-boost: "true"
serving.knative.dev/creator: "service-442091888028@gcp-sa-firebaseapphosting.iam.gserviceaccount.com"
}
creationTimestamp: "2025-09-22T05:24:16.843589Z"
generation: 1
labels: {
cloud.googleapis.com/location: "us-central1"
goog-managed-by: "firebase-app-hosting"
run.googleapis.com/startupProbeType: "Default"
serving.knative.dev/configuration: "backen-brujula-cripto"
serving.knative.dev/configurationGeneration: "17"
serving.knative.dev/route: "backen-brujula-cripto"
serving.knative.dev/service: "backen-brujula-cripto"
serving.knative.dev/serviceUid: "a2e5ddfb-7366-40cc-ac76-829e6d38804d"
}
name: "backen-brujula-cripto-build-2025-09-22-004"
namespace: "442091888028"
ownerReferences: [
0: {
apiVersion: "serving.knative.dev/v1"
blockOwnerDeletion: true
controller: true
kind: "Configuration"
name: "backen-brujula-cripto"
uid: "75ab64cb-27d1-46ba-a526-d9233c150b33"
}
]
resourceVersion: "AAY/XQlcicw"
selfLink: "/apis/serving.knative.dev/v1/namespaces/442091888028/revisions/backen-brujula-cripto-build-2025-09-22-004"
uid: "c5bad704-09f9-457b-8a75-1ea9b0bdccf1"
}
spec: {
containerConcurrency: 80
containers: [
0: {
env: [
0: {
name: "NEXT_PUBLIC_FIREBASE_API_KEY"
valueFrom: {
secretKeyRef: {
key: "1"
name: "secret-alias-1"
}
}
}
1: {
name: "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
valueFrom: {
secretKeyRef: {
key: "1"
name: "secret-alias-2"
}
}
}
2: {
name: "NEXT_PUBLIC_FIREBASE_PROJECT_ID"
valueFrom: {
secretKeyRef: {
key: "1"
name: "secret-alias-3"
}
}
}
3: {
name: "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
valueFrom: {
secretKeyRef: {
key: "1"
name: "secret-alias-4"
}
}
}
4: {
name: "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
valueFrom: {
secretKeyRef: {
key: "1"
name: "secret-alias-5"
}
}
}
5: {
name: "NEXT_PUBLIC_FIREBASE_APP_ID"
valueFrom: {
secretKeyRef: {
key: "1"
name: "secret-alias-6"
}
}
}
6: {
name: "NEXT_PUBLIC_API_BASE_URL"
valueFrom: {
secretKeyRef: {
key: "1"
name: "secret-alias-7"
}
}
}
7: {
name: "NEXT_PUBLIC_BASE_URL"
valueFrom: {
secretKeyRef: {
key: "1"
name: "secret-alias-8"
}
}
}
8: {
name: "NEXT_PUBLIC_APP_URL"
valueFrom: {
secretKeyRef: {
key: "1"
name: "secret-alias-9"
}
}
}
9: {
name: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
valueFrom: {
secretKeyRef: {
key: "1"
name: "secret-alias-10"
}
}
}
10: {
name: "NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_1H"
valueFrom: {
secretKeyRef: {
key: "1"
name: "secret-alias-11"
}
}
}
11: {
name: "NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_5H"
valueFrom: {
secretKeyRef: {
key: "1"
name: "secret-alias-12"
}
}
}
12: {
name: "NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_10H"
valueFrom: {
secretKeyRef: {
key: "1"
name: "secret-alias-13"
}
}
}
13: {
name: "FIREBASE_CONFIG"
value: "{"databaseURL":"","projectId":"brujula-cripto","storageBucket":"brujula-cripto.firebasestorage.app"}"
}
]
image: "us-central1-docker.pkg.dev/brujula-cripto/firebaseapphosting-images/backen-brujula-cripto@sha256:bc9b256f154347671d7b35ec8d02b9800f27830fdd02b27c82e984d0427d73aa"
name: "backen-brujula-cripto-1"
ports: [
0: {
containerPort: 8080
name: "http1"
}
]
resources: {
limits: {
cpu: "1.00"
memory: "512Mi"
}
}
startupProbe: {
failureThreshold: 1
periodSeconds: 240
tcpSocket: {
port: 8080
}
timeoutSeconds: 240
}
}
]
serviceAccountName: "firebase-app-hosting-compute@brujula-cripto.iam.gserviceaccount.com"
timeoutSeconds: 300
}
status: {
conditions: [
0: {
lastTransitionTime: "2025-09-22T05:24:41.831884Z"
message: "The user-provided container failed to start and listen on the port defined provided by the PORT=8080 environment variable within the allocated timeout. This can happen when the container port is misconfigured or if the timeout is too short. The health check timeout can be extended. Logs for this revision might contain more information.

Logs URL: https://console.cloud.google.com/logs/viewer?project=brujula-cripto&resource=cloud_run_revision/service_name/backen-brujula-cripto/revision_name/backen-brujula-cripto-build-2025-09-22-004&advancedFilter=resource.type%3D%22cloud_run_revision%22%0Aresource.labels.service_name%3D%22backen-brujula-cripto%22%0Aresource.labels.revision_name%3D%22backen-brujula-cripto-build-2025-09-22-004%22 
For more troubleshooting guidance, see https://cloud.google.com/run/docs/troubleshooting#container-failed-to-start"
reason: "HealthCheckContainerError"
status: "False"
type: "Ready"
}
1: {
lastTransitionTime: "2025-09-22T05:24:41.831884Z"
message: "The user-provided container failed to start and listen on the port defined provided by the PORT=8080 environment variable within the allocated timeout. This can happen when the container port is misconfigured or if the timeout is too short. The health check timeout can be extended. Logs for this revision might contain more information.

Logs URL: https://console.cloud.google.com/logs/viewer?project=brujula-cripto&resource=cloud_run_revision/service_name/backen-brujula-cripto/revision_name/backen-brujula-cripto-build-2025-09-22-004&advancedFilter=resource.type%3D%22cloud_run_revision%22%0Aresource.labels.service_name%3D%22backen-brujula-cripto%22%0Aresource.labels.revision_name%3D%22backen-brujula-cripto-build-2025-09-22-004%22 
For more troubleshooting guidance, see https://cloud.google.com/run/docs/troubleshooting#container-failed-to-start"
reason: "HealthCheckContainerError"
status: "False"
type: "ContainerHealthy"
}
2: {
lastTransitionTime: "2025-09-22T05:24:38.566326Z"
message: "Container image import completed in 21.03s."
status: "True"
type: "ContainerReady"
}
3: {
lastTransitionTime: "2025-09-22T05:24:40.008470Z"
message: "Provisioning imported containers completed in 1.44s. Checking container health. This will wait for up to 4m for the configured startup probe, including an initial delay of 0s."
status: "True"
type: "ResourcesAvailable"
}
4: {
lastTransitionTime: "2025-09-22T05:24:40.008470Z"
message: "System will retry after 0:00:00 from lastTransitionTime for attempt 0."
reason: "ImmediateRetry"
severity: "Info"
status: "True"
type: "Retry"
}
]
containerStatuses: [
0: {
imageDigest: "us-central1-docker.pkg.dev/brujula-cripto/firebaseapphosting-images/backen-brujula-cripto@sha256:bc9b256f154347671d7b35ec8d02b9800f27830fdd02b27c82e984d0427d73aa"
name: "backen-brujula-cripto-1"
}
]
imageDigest: "us-central1-docker.pkg.dev/brujula-cripto/firebaseapphosting-images/backen-brujula-cripto@sha256:bc9b256f154347671d7b35ec8d02b9800f27830fdd02b27c82e984d0427d73aa"
logUrl: "https://console.cloud.google.com/logs/viewer?project=brujula-cripto&resource=cloud_run_revision/service_name/backen-brujula-cripto/revision_name/backen-brujula-cripto-build-2025-09-22-004&advancedFilter=resource.type%3D%22cloud_run_revision%22%0Aresource.labels.service_name%3D%22backen-brujula-cripto%22%0Aresource.labels.revision_name%3D%22backen-brujula-cripto-build-2025-09-22-004%22"
observedGeneration: 1
}
}
serviceName: "run.googleapis.com"
status: {
code: 9
message: "Ready condition status changed to False for Revision backen-brujula-cripto-build-2025-09-22-004 with message: The user-provided container failed to start and listen on the port defined provided by the PORT=8080 environment variable within the allocated timeout. This can happen when the container port is misconfigured or if the timeout is too short. The health check timeout can be extended. Logs for this revision might contain more information.

Logs URL: https://console.cloud.google.com/logs/viewer?project=brujula-cripto&resource=cloud_run_revision/service_name/backen-brujula-cripto/revision_name/backen-brujula-cripto-build-2025-09-22-004&advancedFilter=resource.type%3D%22cloud_run_revision%22%0Aresource.labels.service_name%3D%22backen-brujula-cripto%22%0Aresource.labels.revision_name%3D%22backen-brujula-cripto-build-2025-09-22-004%22 
For more troubleshooting guidance, see https://cloud.google.com/run/docs/troubleshooting#container-failed-to-start"
}
}
receiveTimestamp: "2025-09-22T05:24:42.156079160Z"
resource: {
labels: {
configuration_name: "backen-brujula-cripto"
location: "us-central1"
project_id: "brujula-cripto"
revision_name: "backen-brujula-cripto-build-2025-09-22-004"
service_name: "backen-brujula-cripto"
}
type: "cloud_run_revision"
}
severity: "ERROR"
timestamp: "2025-09-22T05:24:41.846747Z"
}