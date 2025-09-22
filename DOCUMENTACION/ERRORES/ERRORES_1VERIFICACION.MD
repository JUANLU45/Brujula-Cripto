ara ver las entradas anteriores, haz lo siguiente:
2025-09-22 12:47:55.578
Starting new instance. Reason: DEPLOYMENT_ROLLOUT - Instance started due to traffic shifting between revisions due to deployment, traffic split adjustment, or deployment health check.

{
insertId: "68d1295b0008d463e1133e79"
labels: {
goog-managed-by: "firebase-app-hosting"
instanceId: "0069c7a9886aecb9afe1814f826589b4b00a414d823d11f8ec2f03c35c375446fd18f6dd77ec6bcf29bd5cb50a4d428f163bf8553874740136015a06bde60390a50a0d2a077e5f29d0b04126461014"
scaling_reason: "DEPLOYMENT_ROLLOUT"
}
logName: "projects/brujula-cripto/logs/run.googleapis.com%2Fvarlog%2Fsystem"
receiveTimestamp: "2025-09-22T10:47:55.582778590Z"
resource: {
labels: {
configuration_name: "backen-brujula-cripto"
location: "us-central1"
project_id: "brujula-cripto"
revision_name: "backen-brujula-cripto-build-2025-09-22-005"
service_name: "backen-brujula-cripto"
}
type: "cloud_run_revision"
}
severity: "INFO"
textPayload: "Starting new instance. Reason: DEPLOYMENT_ROLLOUT - Instance started due to traffic shifting between revisions due to deployment, traffic split adjustment, or deployment health check."
timestamp: "2025-09-22T10:47:55.578659Z"
}
2025-09-22 12:47:56.582
file:///workspace/.next/standalone/server.js:1
2025-09-22 12:47:56.582
const path = require('path')
2025-09-22 12:47:56.582
             ^
2025-09-22 12:47:56.582
ReferenceError: require is not defined in ES module scope, you can use import instead

{
insertId: "68d1295c0008e2d23326346a"
labels: {2}
logName: "projects/brujula-cripto/logs/run.googleapis.com%2Fstderr"
receiveTimestamp: "2025-09-22T10:47:56.588431923Z"
resource: {2}
textPayload: "ReferenceError: require is not defined in ES module scope, you can use import instead"
timestamp: "2025-09-22T10:47:56.582354Z"
}
2025-09-22 12:47:56.582
This file is being treated as an ES module because it has a '.js' file extension and '/workspace/.next/standalone/package.json' contains "type": "module". To treat it as a CommonJS script, rename it to use the '.cjs' file extension.

{
insertId: "68d1295c0008e2d68a2002e3"
labels: {
goog-managed-by: "firebase-app-hosting"
instanceId: "0069c7a9886aecb9afe1814f826589b4b00a414d823d11f8ec2f03c35c375446fd18f6dd77ec6bcf29bd5cb50a4d428f163bf8553874740136015a06bde60390a50a0d2a077e5f29d0b04126461014"
}
logName: "projects/brujula-cripto/logs/run.googleapis.com%2Fstderr"
receiveTimestamp: "2025-09-22T10:47:56.588431923Z"
resource: {
labels: {
configuration_name: "backen-brujula-cripto"
location: "us-central1"
project_id: "brujula-cripto"
revision_name: "backen-brujula-cripto-build-2025-09-22-005"
service_name: "backen-brujula-cripto"
}
type: "cloud_run_revision"
}
textPayload: "This file is being treated as an ES module because it has a '.js' file extension and '/workspace/.next/standalone/package.json' contains "type": "module". To treat it as a CommonJS script, rename it to use the '.cjs' file extension."
timestamp: "2025-09-22T10:47:56.582358Z"
}
2025-09-22 12:47:56.582
    at file:///workspace/.next/standalone/server.js:1:14
2025-09-22 12:47:56.582
    at ModuleJob.run (node:internal/modules/esm/module_job:325:25)
2025-09-22 12:47:56.582
    at async ModuleLoader.import (node:internal/modules/esm/loader:606:24)
2025-09-22 12:47:56.582
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5)
2025-09-22 12:47:56.582
Node.js v20.19.5
2025-09-22 12:47:56.927
Container called exit(1).

{
insertId: "68d1295c000e26a37629b7d5"
labels: {
container_name: "backen-brujula-cripto-1"
goog-managed-by: "firebase-app-hosting"
instanceId: "0069c7a9886aecb9afe1814f826589b4b00a414d823d11f8ec2f03c35c375446fd18f6dd77ec6bcf29bd5cb50a4d428f163bf8553874740136015a06bde60390a50a0d2a077e5f29d0b04126461014"
}
logName: "projects/brujula-cripto/logs/run.googleapis.com%2Fvarlog%2Fsystem"
receiveTimestamp: "2025-09-22T10:47:57.247083705Z"
resource: {
labels: {
configuration_name: "backen-brujula-cripto"
location: "us-central1"
project_id: "brujula-cripto"
revision_name: "backen-brujula-cripto-build-2025-09-22-005"
service_name: "backen-brujula-cripto"
}
type: "cloud_run_revision"
}
severity: "WARNING"
textPayload: "Container called exit(1)."
timestamp: "2025-09-22T10:47:56.927384005Z"
}
2025-09-22 12:47:57.081
Default STARTUP TCP probe failed 1 time consecutively for container "backen-brujula-cripto-1" on port 8080. The instance was not started.
Connection failed with status CANCELLED.

{
insertId: "68d1295d00013d80dfa263e5"
labels: {
goog-managed-by: "firebase-app-hosting"
instanceId: "0069c7a9886aecb9afe1814f826589b4b00a414d823d11f8ec2f03c35c375446fd18f6dd77ec6bcf29bd5cb50a4d428f163bf8553874740136015a06bde60390a50a0d2a077e5f29d0b04126461014"
}
logName: "projects/brujula-cripto/logs/run.googleapis.com%2Fvarlog%2Fsystem"
receiveTimestamp: "2025-09-22T10:47:57.247083705Z"
resource: {
labels: {
configuration_name: "backen-brujula-cripto"
location: "us-central1"
project_id: "brujula-cripto"
revision_name: "backen-brujula-cripto-build-2025-09-22-005"
service_name: "backen-brujula-cripto"
}
type: "cloud_run_revision"
}
severity: "ERROR"
textPayload: "Default STARTUP TCP probe failed 1 time consecutively for container "backen-brujula-cripto-1" on port 8080. The instance was not started.
Connection failed with status CANCELLED."
timestamp: "2025-09-22T10:47:57.081280Z"
}
2025-09-22 12:47:57.091

Cloud Run

UpdateService

…cken-brujula-cripto-build-2025-09-22-005
Ready condition status changed to False for Revision backen-brujula-cripto-build-2025-09-22-005 with message: The user-provided container failed to start and listen on the port defined provided by the PORT=8080 environment variable within the allocated timeout. This can happen when the container port is misconfigured or if the timeout is too short. The health check timeout can be extended. Logs for this revision might contain more information.

Logs URL: https://console.cloud.google.com/logs/viewer?project=brujula-cripto&resource=cloud_run_revision/service_name/backen-brujula-cripto/revision_name/backen-brujula-cripto-build-2025-09-22-005&advancedFilter=resource.type%3D%22cloud_run_revision%22%0Aresource.labels.service_name%3D%22backen-brujula-cripto%22%0Aresource.labels.revision_name%3D%22backen-brujula-cripto-build-2025-09-22-005%22 
For more troubleshooting guidance, see https://cloud.google.com/run/docs/troubleshooting#container-failed-to-start

{
insertId: "s2hvsgd7ulw"
logName: "projects/brujula-cripto/logs/cloudaudit.googleapis.com%2Fsystem_event"
protoPayload: {
@type: "type.googleapis.com/google.cloud.audit.AuditLog"
methodName: "/Services.UpdateService"
resourceName: "namespaces/brujula-cripto/revisions/backen-brujula-cripto-build-2025-09-22-005"
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
run.googleapis.com/operation-id: "ba1b1150-5ad9-41be-9728-506e84eb6eb5"
run.googleapis.com/secrets: "secret-alias-1:projects/442091888028/secrets/NEXT_PUBLIC_FIREBASE_API_KEY,secret-alias-10:projects/442091888028/secrets/NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,secret-alias-11:projects/442091888028/secrets/NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_1H,secret-alias-12:projects/442091888028/secrets/NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_5H,secret-alias-13:projects/442091888028/secrets/NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_10H,secret-alias-2:projects/442091888028/secrets/NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,secret-alias-3:projects/442091888028/secrets/NEXT_PUBLIC_FIREBASE_PROJECT_ID,secret-alias-4:projects/442091888028/secrets/NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,secret-alias-5:projects/442091888028/secrets/NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,secret-alias-6:projects/442091888028/secrets/NEXT_PUBLIC_FIREBASE_APP_ID,secret-alias-7:projects/442091888028/secrets/NEXT_PUBLIC_API_BASE_URL,secret-alias-8:projects/442091888028/secrets/NEXT_PUBLIC_BASE_URL,secret-alias-9:projects/442091888028/secrets/NEXT_PUBLIC_APP_URL"
run.googleapis.com/sessionAffinity: "false"
run.googleapis.com/startup-cpu-boost: "true"
serving.knative.dev/creator: "service-442091888028@gcp-sa-firebaseapphosting.iam.gserviceaccount.com"
}
creationTimestamp: "2025-09-22T10:47:27.702587Z"
generation: 1
labels: {
cloud.googleapis.com/location: "us-central1"
goog-managed-by: "firebase-app-hosting"
run.googleapis.com/startupProbeType: "Default"
serving.knative.dev/configuration: "backen-brujula-cripto"
serving.knative.dev/configurationGeneration: "18"
serving.knative.dev/route: "backen-brujula-cripto"
serving.knative.dev/service: "backen-brujula-cripto"
serving.knative.dev/serviceUid: "a2e5ddfb-7366-40cc-ac76-829e6d38804d"
}
name: "backen-brujula-cripto-build-2025-09-22-005"
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
resourceVersion: "AAY/YY1okik"
selfLink: "/apis/serving.knative.dev/v1/namespaces/442091888028/revisions/backen-brujula-cripto-build-2025-09-22-005"
uid: "6d9e54ba-8a25-4b84-ac92-1c24cb041383"
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
image: "us-central1-docker.pkg.dev/brujula-cripto/firebaseapphosting-images/backen-brujula-cripto@sha256:ec289167400a7df8cd060614de095d53d929e7bf9785bcfb73a5429da78913cc"
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
lastTransitionTime: "2025-09-22T10:47:57.082153Z"
message: "The user-provided container failed to start and listen on the port defined provided by the PORT=8080 environment variable within the allocated timeout. This can happen when the container port is misconfigured or if the timeout is too short. The health check timeout can be extended. Logs for this revision might contain more information.

Logs URL: https://console.cloud.google.com/logs/viewer?project=brujula-cripto&resource=cloud_run_revision/service_name/backen-brujula-cripto/revision_name/backen-brujula-cripto-build-2025-09-22-005&advancedFilter=resource.type%3D%22cloud_run_revision%22%0Aresource.labels.service_name%3D%22backen-brujula-cripto%22%0Aresource.labels.revision_name%3D%22backen-brujula-cripto-build-2025-09-22-005%22 
For more troubleshooting guidance, see https://cloud.google.com/run/docs/troubleshooting#container-failed-to-start"
reason: "HealthCheckContainerError"
status: "False"
type: "Ready"
}
1: {
lastTransitionTime: "2025-09-22T10:47:57.082153Z"
message: "The user-provided container failed to start and listen on the port defined provided by the PORT=8080 environment variable within the allocated timeout. This can happen when the container port is misconfigured or if the timeout is too short. The health check timeout can be extended. Logs for this revision might contain more information.

Logs URL: https://console.cloud.google.com/logs/viewer?project=brujula-cripto&resource=cloud_run_revision/service_name/backen-brujula-cripto/revision_name/backen-brujula-cripto-build-2025-09-22-005&advancedFilter=resource.type%3D%22cloud_run_revision%22%0Aresource.labels.service_name%3D%22backen-brujula-cripto%22%0Aresource.labels.revision_name%3D%22backen-brujula-cripto-build-2025-09-22-005%22 
For more troubleshooting guidance, see https://cloud.google.com/run/docs/troubleshooting#container-failed-to-start"
reason: "HealthCheckContainerError"
status: "False"
type: "ContainerHealthy"
}
2: {
lastTransitionTime: "2025-09-22T10:47:54.028263Z"
message: "Container image import completed in 25.66s."
status: "True"
type: "ContainerReady"
}
3: {
lastTransitionTime: "2025-09-22T10:47:55.449882Z"
message: "Provisioning imported containers completed in 1.42s. Checking container health. This will wait for up to 4m for the configured startup probe, including an initial delay of 0s."
status: "True"
type: "ResourcesAvailable"
}
4: {
lastTransitionTime: "2025-09-22T10:47:55.449882Z"
message: "System will retry after 0:00:00 from lastTransitionTime for attempt 0."
reason: "ImmediateRetry"
severity: "Info"
status: "True"
type: "Retry"
}
]
containerStatuses: [
0: {
imageDigest: "us-central1-docker.pkg.dev/brujula-cripto/firebaseapphosting-images/backen-brujula-cripto@sha256:ec289167400a7df8cd060614de095d53d929e7bf9785bcfb73a5429da78913cc"
name: "backen-brujula-cripto-1"
}
]
imageDigest: "us-central1-docker.pkg.dev/brujula-cripto/firebaseapphosting-images/backen-brujula-cripto@sha256:ec289167400a7df8cd060614de095d53d929e7bf9785bcfb73a5429da78913cc"
logUrl: "https://console.cloud.google.com/logs/viewer?project=brujula-cripto&resource=cloud_run_revision/service_name/backen-brujula-cripto/revision_name/backen-brujula-cripto-build-2025-09-22-005&advancedFilter=resource.type%3D%22cloud_run_revision%22%0Aresource.labels.service_name%3D%22backen-brujula-cripto%22%0Aresource.labels.revision_name%3D%22backen-brujula-cripto-build-2025-09-22-005%22"
observedGeneration: 1
}
}
serviceName: "run.googleapis.com"
status: {
code: 9
message: "Ready condition status changed to False for Revision backen-brujula-cripto-build-2025-09-22-005 with message: The user-provided container failed to start and listen on the port defined provided by the PORT=8080 environment variable within the allocated timeout. This can happen when the container port is misconfigured or if the timeout is too short. The health check timeout can be extended. Logs for this revision might contain more information.

Logs URL: https://console.cloud.google.com/logs/viewer?project=brujula-cripto&resource=cloud_run_revision/service_name/backen-brujula-cripto/revision_name/backen-brujula-cripto-build-2025-09-22-005&advancedFilter=resource.type%3D%22cloud_run_revision%22%0Aresource.labels.service_name%3D%22backen-brujula-cripto%22%0Aresource.labels.revision_name%3D%22backen-brujula-cripto-build-2025-09-22-005%22 
For more troubleshooting guidance, see https://cloud.google.com/run/docs/troubleshooting#container-failed-to-start"
}
}
receiveTimestamp: "2025-09-22T10:47:59.584013924Z"
resource: {
labels: {
configuration_name: "backen-brujula-cripto"
location: "us-central1"
project_id: "brujula-cripto"
revision_name: "backen-brujula-cripto-build-2025-09-22-005"
service_name: "backen-brujula-cripto"
}
type: "cloud_run_revision"
}
severity: "ERROR"
timestamp: "2025-09-22T10:47:57.091399Z"
}