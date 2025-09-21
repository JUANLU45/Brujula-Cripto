Se muestran los registros de los últimos 30 días, de 23/8/25, 12:04 a.m. a 22/9/25, 12:04 a.m..
2025-09-22 00:03:24.670
Starting new instance. Reason: DEPLOYMENT_ROLLOUT - Instance started due to traffic shifting between revisions due to deployment, traffic split adjustment, or deployment health check.

{
insertId: "68d0762c000a3a7babff6338"
labels: {
goog-managed-by: "firebase-app-hosting"
instanceId: "0069c7a988a4d1bf765266b2004e7165df570c4c4fef528940d99c9559d747eef7f6a5d97b8756d26c4b2dd59ff83ea0d0d33f4d1b9c1eb5f635bfde85332790cc788e70b772a2675510feda916687"
scaling_reason: "DEPLOYMENT_ROLLOUT"
}
logName: "projects/brujula-cripto/logs/run.googleapis.com%2Fvarlog%2Fsystem"
receiveTimestamp: "2025-09-21T22:03:24.674868845Z"
resource: {
labels: {
configuration_name: "backen-brujula-cripto"
location: "us-central1"
project_id: "brujula-cripto"
revision_name: "backen-brujula-cripto-build-2025-09-21-006"
service_name: "backen-brujula-cripto"
}
type: "cloud_run_revision"
}
severity: "INFO"
textPayload: "Starting new instance. Reason: DEPLOYMENT_ROLLOUT - Instance started due to traffic shifting between revisions due to deployment, traffic split adjustment, or deployment health check."
timestamp: "2025-09-21T22:03:24.670331Z"
}
2025-09-22 00:03:25.745
node:internal/modules/cjs/loader:1210

{
insertId: "68d0762d000b60d28a470821"
labels: {
goog-managed-by: "firebase-app-hosting"
instanceId: "0069c7a988a4d1bf765266b2004e7165df570c4c4fef528940d99c9559d747eef7f6a5d97b8756d26c4b2dd59ff83ea0d0d33f4d1b9c1eb5f635bfde85332790cc788e70b772a2675510feda916687"
}
logName: "projects/brujula-cripto/logs/run.googleapis.com%2Fstderr"
receiveTimestamp: "2025-09-21T22:03:25.750452019Z"
resource: {
labels: {
configuration_name: "backen-brujula-cripto"
location: "us-central1"
project_id: "brujula-cripto"
revision_name: "backen-brujula-cripto-build-2025-09-21-006"
service_name: "backen-brujula-cripto"
}
type: "cloud_run_revision"
}
textPayload: "node:internal/modules/cjs/loader:1210"
timestamp: "2025-09-21T22:03:25.745682Z"
}
2025-09-22 00:03:25.745
  throw err;

{
insertId: "68d0762d000b60e685933e55"
labels: {
goog-managed-by: "firebase-app-hosting"
instanceId: "0069c7a988a4d1bf765266b2004e7165df570c4c4fef528940d99c9559d747eef7f6a5d97b8756d26c4b2dd59ff83ea0d0d33f4d1b9c1eb5f635bfde85332790cc788e70b772a2675510feda916687"
}
logName: "projects/brujula-cripto/logs/run.googleapis.com%2Fstderr"
receiveTimestamp: "2025-09-21T22:03:25.750452019Z"
resource: {
labels: {
configuration_name: "backen-brujula-cripto"
location: "us-central1"
project_id: "brujula-cripto"
revision_name: "backen-brujula-cripto-build-2025-09-21-006"
service_name: "backen-brujula-cripto"
}
type: "cloud_run_revision"
}
textPayload: "  throw err;"
timestamp: "2025-09-21T22:03:25.745702Z"
}
2025-09-22 00:03:25.745
  ^
2025-09-22 00:03:25.745
Error: Cannot find module '/workspace/.next/standalone/server.js'
    at Module._resolveFilename (node:internal/modules/cjs/loader:1207:15)
    at Module._load (node:internal/modules/cjs/loader:1038:27)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49 {

{
errorGroups: [
0: {
id: "CNWu5da0iZ-3Og"
}
]
insertId: "68d0762d000b61113316c8b5"
labels: {
goog-managed-by: "firebase-app-hosting"
instanceId: "0069c7a988a4d1bf765266b2004e7165df570c4c4fef528940d99c9559d747eef7f6a5d97b8756d26c4b2dd59ff83ea0d0d33f4d1b9c1eb5f635bfde85332790cc788e70b772a2675510feda916687"
}
logName: "projects/brujula-cripto/logs/run.googleapis.com%2Fstderr"
receiveTimestamp: "2025-09-21T22:03:25.750452019Z"
resource: {
labels: {
configuration_name: "backen-brujula-cripto"
location: "us-central1"
project_id: "brujula-cripto"
revision_name: "backen-brujula-cripto-build-2025-09-21-006"
service_name: "backen-brujula-cripto"
}
type: "cloud_run_revision"
}
severity: "ERROR"
textPayload: "Error: Cannot find module '/workspace/.next/standalone/server.js'
    at Module._resolveFilename (node:internal/modules/cjs/loader:1207:15)
    at Module._load (node:internal/modules/cjs/loader:1038:27)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49 {"
timestamp: "2025-09-21T22:03:25.745745Z"
}
2025-09-22 00:03:25.745
  code: 'MODULE_NOT_FOUND',
2025-09-22 00:03:25.745
  requireStack: []
2025-09-22 00:03:25.745
}
2025-09-22 00:03:25.745
Node.js v20.19.5
2025-09-22 00:03:26.075
Container called exit(1).
2025-09-22 00:03:26.183
Default STARTUP TCP probe failed 1 time consecutively for container "backen-brujula-cripto-1" on port 8080. The instance was not started.
Connection failed with status CANCELLED.

{
insertId: "68d0762e0002ce2c2f2ef02d"
labels: {
goog-managed-by: "firebase-app-hosting"
instanceId: "0069c7a988a4d1bf765266b2004e7165df570c4c4fef528940d99c9559d747eef7f6a5d97b8756d26c4b2dd59ff83ea0d0d33f4d1b9c1eb5f635bfde85332790cc788e70b772a2675510feda916687"
}
logName: "projects/brujula-cripto/logs/run.googleapis.com%2Fvarlog%2Fsystem"
receiveTimestamp: "2025-09-21T22:03:26.339265027Z"
resource: {
labels: {
configuration_name: "backen-brujula-cripto"
location: "us-central1"
project_id: "brujula-cripto"
revision_name: "backen-brujula-cripto-build-2025-09-21-006"
service_name: "backen-brujula-cripto"
}
type: "cloud_run_revision"
}
severity: "ERROR"
textPayload: "Default STARTUP TCP probe failed 1 time consecutively for container "backen-brujula-cripto-1" on port 8080. The instance was not started.
Connection failed with status CANCELLED."
timestamp: "2025-09-21T22:03:26.183852Z"
}
2025-09-22 00:03:26.191

Cloud Run

UpdateService

…cken-brujula-cripto-build-2025-09-21-006
Ready condition status changed to False for Revision backen-brujula-cripto-build-2025-09-21-006 with message: The user-provided container failed to start and listen on the port defined provided by the PORT=8080 environment variable within the allocated timeout. This can happen when the container port is misconfigured or if the timeout is too short. The health check timeout can be extended. Logs for this revision might contain more information.

Logs URL: https://console.cloud.google.com/logs/viewer?project=brujula-cripto&resource=cloud_run_revision/service_name/backen-brujula-cripto/revision_name/backen-brujula-cripto-build-2025-09-21-006&advancedFilter=resource.type%3D%22cloud_run_revision%22%0Aresource.labels.service_name%3D%22backen-brujula-cripto%22%0Aresource.labels.revision_name%3D%22backen-brujula-cripto-build-2025-09-21-006%22 
For more troubleshooting guidance, see https://cloud.google.com/run/docs/troubleshooting#container-failed-to-start

{
insertId: "gnf767d1lfs"
logName: "projects/brujula-cripto/logs/cloudaudit.googleapis.com%2Fsystem_event"
protoPayload: {
@type: "type.googleapis.com/google.cloud.audit.AuditLog"
methodName: "/Services.UpdateService"
resourceName: "namespaces/brujula-cripto/revisions/backen-brujula-cripto-build-2025-09-21-006"
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
run.googleapis.com/operation-id: "d114783b-8cba-4eb3-9d43-7cb63d0a78f1"
run.googleapis.com/secrets: "secret-alias-1:projects/442091888028/secrets/NEXT_PUBLIC_FIREBASE_API_KEY,secret-alias-10:projects/442091888028/secrets/NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,secret-alias-11:projects/442091888028/secrets/NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_1H,secret-alias-12:projects/442091888028/secrets/NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_5H,secret-alias-13:projects/442091888028/secrets/NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_10H,secret-alias-2:projects/442091888028/secrets/NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,secret-alias-3:projects/442091888028/secrets/NEXT_PUBLIC_FIREBASE_PROJECT_ID,secret-alias-4:projects/442091888028/secrets/NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,secret-alias-5:projects/442091888028/secrets/NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,secret-alias-6:projects/442091888028/secrets/NEXT_PUBLIC_FIREBASE_APP_ID,secret-alias-7:projects/442091888028/secrets/NEXT_PUBLIC_API_BASE_URL,secret-alias-8:projects/442091888028/secrets/NEXT_PUBLIC_BASE_URL,secret-alias-9:projects/442091888028/secrets/NEXT_PUBLIC_APP_URL"
run.googleapis.com/sessionAffinity: "false"
run.googleapis.com/startup-cpu-boost: "true"
serving.knative.dev/creator: "service-442091888028@gcp-sa-firebaseapphosting.iam.gserviceaccount.com"
}
creationTimestamp: "2025-09-21T22:02:17.221311Z"
generation: 1
labels: {
cloud.googleapis.com/location: "us-central1"
goog-managed-by: "firebase-app-hosting"
run.googleapis.com/startupProbeType: "Default"
serving.knative.dev/configuration: "backen-brujula-cripto"
serving.knative.dev/configurationGeneration: "9"
serving.knative.dev/route: "backen-brujula-cripto"
serving.knative.dev/service: "backen-brujula-cripto"
serving.knative.dev/serviceUid: "a2e5ddfb-7366-40cc-ac76-829e6d38804d"
}
name: "backen-brujula-cripto-build-2025-09-21-006"
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
resourceVersion: "AAY/Vt9KNpU"
selfLink: "/apis/serving.knative.dev/v1/namespaces/442091888028/revisions/backen-brujula-cripto-build-2025-09-21-006"
uid: "1b4d6dc4-2eff-426d-a726-eef48f6f8538"
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
image: "us-central1-docker.pkg.dev/brujula-cripto/firebaseapphosting-images/backen-brujula-cripto@sha256:030bb288c409873ce26a9b5c7b24ebb3ca00e23090da81ee2db31679662c1469"
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
lastTransitionTime: "2025-09-21T22:03:26.184085Z"
message: "The user-provided container failed to start and listen on the port defined provided by the PORT=8080 environment variable within the allocated timeout. This can happen when the container port is misconfigured or if the timeout is too short. The health check timeout can be extended. Logs for this revision might contain more information.

Logs URL: https://console.cloud.google.com/logs/viewer?project=brujula-cripto&resource=cloud_run_revision/service_name/backen-brujula-cripto/revision_name/backen-brujula-cripto-build-2025-09-21-006&advancedFilter=resource.type%3D%22cloud_run_revision%22%0Aresource.labels.service_name%3D%22backen-brujula-cripto%22%0Aresource.labels.revision_name%3D%22backen-brujula-cripto-build-2025-09-21-006%22 
For more troubleshooting guidance, see https://cloud.google.com/run/docs/troubleshooting#container-failed-to-start"
reason: "HealthCheckContainerError"
status: "False"
type: "Ready"
}
1: {
lastTransitionTime: "2025-09-21T22:03:26.184085Z"
message: "The user-provided container failed to start and listen on the port defined provided by the PORT=8080 environment variable within the allocated timeout. This can happen when the container port is misconfigured or if the timeout is too short. The health check timeout can be extended. Logs for this revision might contain more information.

Logs URL: https://console.cloud.google.com/logs/viewer?project=brujula-cripto&resource=cloud_run_revision/service_name/backen-brujula-cripto/revision_name/backen-brujula-cripto-build-2025-09-21-006&advancedFilter=resource.type%3D%22cloud_run_revision%22%0Aresource.labels.service_name%3D%22backen-brujula-cripto%22%0Aresource.labels.revision_name%3D%22backen-brujula-cripto-build-2025-09-21-006%22 
For more troubleshooting guidance, see https://cloud.google.com/run/docs/troubleshooting#container-failed-to-start"
reason: "HealthCheckContainerError"
status: "False"
type: "ContainerHealthy"
}
2: {
lastTransitionTime: "2025-09-21T22:03:23.145794Z"
message: "Container image import completed in 1m5.26s."
status: "True"
type: "ContainerReady"
}
3: {
lastTransitionTime: "2025-09-21T22:03:24.557567Z"
message: "Provisioning imported containers completed in 1.41s. Checking container health. This will wait for up to 4m for the configured startup probe, including an initial delay of 0s."
status: "True"
type: "ResourcesAvailable"
}
4: {
lastTransitionTime: "2025-09-21T22:03:24.557567Z"
message: "System will retry after 0:00:00 from lastTransitionTime for attempt 0."
reason: "ImmediateRetry"
severity: "Info"
status: "True"
type: "Retry"
}
]
containerStatuses: [
0: {
imageDigest: "us-central1-docker.pkg.dev/brujula-cripto/firebaseapphosting-images/backen-brujula-cripto@sha256:030bb288c409873ce26a9b5c7b24ebb3ca00e23090da81ee2db31679662c1469"
name: "backen-brujula-cripto-1"
}
]
imageDigest: "us-central1-docker.pkg.dev/brujula-cripto/firebaseapphosting-images/backen-brujula-cripto@sha256:030bb288c409873ce26a9b5c7b24ebb3ca00e23090da81ee2db31679662c1469"
logUrl: "https://console.cloud.google.com/logs/viewer?project=brujula-cripto&resource=cloud_run_revision/service_name/backen-brujula-cripto/revision_name/backen-brujula-cripto-build-2025-09-21-006&advancedFilter=resource.type%3D%22cloud_run_revision%22%0Aresource.labels.service_name%3D%22backen-brujula-cripto%22%0Aresource.labels.revision_name%3D%22backen-brujula-cripto-build-2025-09-21-006%22"
observedGeneration: 1
}
}
serviceName: "run.googleapis.com"
status: {
code: 9
message: "Ready condition status changed to False for Revision backen-brujula-cripto-build-2025-09-21-006 with message: The user-provided container failed to start and listen on the port defined provided by the PORT=8080 environment variable within the allocated timeout. This can happen when the container port is misconfigured or if the timeout is too short. The health check timeout can be extended. Logs for this revision might contain more information.

Logs URL: https://console.cloud.google.com/logs/viewer?project=brujula-cripto&resource=cloud_run_revision/service_name/backen-brujula-cripto/revision_name/backen-brujula-cripto-build-2025-09-21-006&advancedFilter=resource.type%3D%22cloud_run_revision%22%0Aresource.labels.service_name%3D%22backen-brujula-cripto%22%0Aresource.labels.revision_name%3D%22backen-brujula-cripto-build-2025-09-21-006%22 
For more troubleshooting guidance, see https://cloud.google.com/run/docs/troubleshooting#container-failed-to-start"
}
}
receiveTimestamp: "2025-09-21T22:03:26.589313385Z"
resource: {
labels: {
configuration_name: "backen-brujula-cripto"
location: "us-central1"
project_id: "brujula-cripto"
revision_name: "backen-brujula-cripto-build-2025-09-21-006"
service_name: "backen-brujula-cripto"
}
type: "cloud_run_revision"
}
severity: "ERROR"
timestamp: "2025-09-21T22:03:26.191688Z"
}