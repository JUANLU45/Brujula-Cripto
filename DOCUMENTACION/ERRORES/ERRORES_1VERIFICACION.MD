2025-09-18 00:28:45.233

Cloud Run

CreateService

us-central1:backen-brujula-cripto

service-442091888028@gcp-…
audit_log, method: "google.cloud.run.v2.Services.CreateService", principal_email: "service-442091888028@gcp-sa-firebaseapphosting.iam.gserviceaccount.com"
2025-09-18 00:28:45.520

Cloud Run

CreateService

us-central1:backen-brujula-cripto

service-442091888028@gcp-…
audit_log, method: "google.cloud.run.v2.Services.CreateService", principal_email: "service-442091888028@gcp-sa-firebaseapphosting.iam.gserviceaccount.com"
2025-09-18 00:30:11.430
Starting new instance. Reason: DEPLOYMENT_ROLLOUT - Instance started due to traffic shifting between revisions due to deployment, traffic split adjustment, or deployment health check.
2025-09-18 00:30:12.376
node:internal/modules/cjs/loader:1210

2025-09-18 00:30:12.376
  throw err;
2025-09-18 00:30:12.376
  ^
2025-09-18 00:30:12.376
Error: Cannot find module '/workspace/.next/standalone/server.js'     at Module._resolveFilename (node:internal/modules/cjs/loader:1207:15)     at Module._load (node:internal/modules/cjs/loader:1038:27)     at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)     at node:internal/main/run_main_module:28:49 {

{
errorGroups: [1]
insertId: "68cb36740005c09b1b971466"
labels: {2}
logName: "projects/brujula-cripto/logs/run.googleapis.com%2Fstderr"
receiveTimestamp: "2025-09-17T22:30:12.383587624Z"
resource: {2}
severity: "ERROR"
textPayload: "Error: Cannot find module '/workspace/.next/standalone/server.js'
    at Module._resolveFilename (node:internal/modules/cjs/loader:1207:15)
    at Module._load (node:internal/modules/cjs/loader:1038:27)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49 {"
timestamp: "2025-09-17T22:30:12.376987Z"
}
2025-09-18 00:30:12.376
  code: 'MODULE_NOT_FOUND',
2025-09-18 00:30:12.376
  requireStack: []
2025-09-18 00:30:12.376
}
2025-09-18 00:30:12.377
Node.js v20.19.5
2025-09-18 00:30:12.674
Container called exit(1).
2025-09-18 00:30:12.786
Default STARTUP TCP probe failed 1 time consecutively for container "backen-brujula-cripto-1" on port 8080. The instance was not started. Connection failed with status CANCELLED.

{
insertId: "68cb3674000bff027fbb3140"
labels: {2}
logName: "projects/brujula-cripto/logs/run.googleapis.com%2Fvarlog%2Fsystem"
receiveTimestamp: "2025-09-17T22:30:13.101669518Z"
resource: {2}
severity: "ERROR"
textPayload: "Default STARTUP TCP probe failed 1 time consecutively for container "backen-brujula-cripto-1" on port 8080. The instance was not started.
Connection failed with status CANCELLED."
timestamp: "2025-09-17T22:30:12.786178Z"
}
2025-09-18 00:30:12.791

Cloud Run

CreateService

…cken-brujula-cripto-build-2025-09-17-020
Ready condition status changed to False for Revision backen-brujula-cripto-build-2025-09-17-020 with message: The user-provided container failed to start and listen on the port defined provided by the PORT=8080 environment variable within the allocated timeout. This can happen when the container port is misconfigured or if the timeout is too short. The health check timeout can be extended. Logs for this revision might contain more information.  Logs URL: https://console.cloud.google.com/logs/viewer?project=brujula-cripto&resource=cloud_run_revision/service_name/backen-brujula-cripto/revision_name/backen-brujula-cripto-build-2025-09-17-020&advancedFilter=resource.type%3D%22cloud_run_revision%22%0Aresource.labels.service_name%3D%22backen-brujula-cripto%22%0Aresource.labels.revision_name%3D%22backen-brujula-cripto-build-2025-09-17-020%22  For more troubleshooting guidance, see https://cloud.google.com/run/docs/troubleshooting#container-failed-to-start

{
insertId: "-sa8jqpdjzig"
logName: "projects/brujula-cripto/logs/cloudaudit.googleapis.com%2Fsystem_event"
protoPayload: {
@type: "type.googleapis.com/google.cloud.audit.AuditLog"
methodName: "/Services.CreateService"
resourceName: "namespaces/brujula-cripto/revisions/backen-brujula-cripto-build-2025-09-17-020"
response: {6}
serviceName: "run.googleapis.com"
status: {2}
}
receiveTimestamp: "2025-09-17T22:30:13.547779689Z"
resource: {2}
severity: "ERROR"
timestamp: "2025-09-17T22:30:12.791699Z"
}
2025-09-18 00:30:12.914

Cloud Run

CreateService

backen-brujula-cripto
Ready condition status changed to False for Service backen-brujula-cripto with message: Revision 'backen-brujula-cripto-build-2025-09-17-020' is not ready and cannot serve traffic. The user-provided container failed to start and listen on the port defined provided by the PORT=8080 environment variable within the allocated timeout. This can happen when the container port is misconfigured or if the timeout is too short. The health check timeout can be extended. Logs for this revision might contain more information.  Logs URL: https://console.cloud.google.com/logs/viewer?project=brujula-cripto&resource=cloud_run_revision/service_name/backen-brujula-cripto/revision_name/backen-brujula-cripto-build-2025-09-17-020&advancedFilter=resource.type%3D%22cloud_run_revision%22%0Aresource.labels.service_name%3D%22backen-brujula-cripto%22%0Aresource.labels.revision_name%3D%22backen-brujula-cripto-build-2025-09-17-020%22  For more troubleshooting guidance, see https://cloud.google.com/run/docs/troubleshooting#container-failed-to-start
{
insertId: "-3l8ktle11lxq"
logName: "projects/brujula-cripto/logs/cloudaudit.googleapis.com%2Fsystem_event"
protoPayload: {
@type: "type.googleapis.com/google.cloud.audit.AuditLog"
methodName: "/Services.CreateService"
resourceName: "namespaces/brujula-cripto/services/backen-brujula-cripto"
response: {6}
serviceName: "run.googleapis.com"
status: {2}
}
receiveTimestamp: "2025-09-17T22:30:12.970258639Z"
resource: {2}
severity: "ERROR"
timestamp: "2025-09-17T22:30:12.914813Z"
}
2025-09-18 09:04:02.345

Cloud Run

UpdateService

us-central1:backen-brujula-cripto

service-442091888028@gcp-…
audit_log, method: "google.cloud.run.v2.Services.UpdateService", principal_email: "service-442091888028@gcp-sa-firebaseapphosting.iam.gserviceaccount.com"
2025-09-18 09:04:33.089
Starting new instance. Reason: DEPLOYMENT_ROLLOUT - Instance started due to traffic shifting between revisions due to deployment, traffic split adjustment, or deployment health check.
2025-09-18 09:04:33.931
node:internal/modules/cjs/loader:1210
2025-09-18 09:04:33.931
  throw err;
{
insertId: "68cbaf01000e37afa7f28861"
labels: {
goog-managed-by: "firebase-app-hosting"
instanceId: "0069c7a98805955dd878e47af5976f08a765723e939caf48c77a03518e443c941da0b1503573f77b1378f0b3cf4fd58a736983336a3d57df8a136cad8a30711b48e820fbfc06b87ba5c5fe3503475e"
}
logName: "projects/brujula-cripto/logs/run.googleapis.com%2Fstderr"
receiveTimestamp: "2025-09-18T07:04:33.936798281Z"
resource: {
labels: {
configuration_name: "backen-brujula-cripto"
location: "us-central1"
project_id: "brujula-cripto"
revision_name: "backen-brujula-cripto-build-2025-09-18-001"
service_name: "backen-brujula-cripto"
}
type: "cloud_run_revision"
}
textPayload: "  throw err;"
timestamp: "2025-09-18T07:04:33.931759Z"
}
2025-09-18 09:04:33.931
  ^
2025-09-18 09:04:33.931
Error: Cannot find module '/workspace/.next/standalone/server.js'     at Module._resolveFilename (node:internal/modules/cjs/loader:1207:15)     at Module._load (node:internal/modules/cjs/loader:1038:27)     at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)     at node:internal/main/run_main_module:28:49 {
{
errorGroups: [1]
insertId: "68cbaf01000e37cc1e1873d8"
labels: {2}
logName: "projects/brujula-cripto/logs/run.googleapis.com%2Fstderr"
receiveTimestamp: "2025-09-18T07:04:33.936798281Z"
resource: {2}
severity: "ERROR"
textPayload: "Error: Cannot find module '/workspace/.next/standalone/server.js'
    at Module._resolveFilename (node:internal/modules/cjs/loader:1207:15)
    at Module._load (node:internal/modules/cjs/loader:1038:27)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49 {"
timestamp: "2025-09-18T07:04:33.931788Z"
}
2025-09-18 09:04:33.931
  code: 'MODULE_NOT_FOUND',
2025-09-18 09:04:33.931
  requireStack: []
2025-09-18 09:04:33.931
}
2025-09-18 09:04:33.931
Node.js v20.19.5
2025-09-18 09:04:34.356
Container called exit(1).
2025-09-18 09:04:34.441
Default STARTUP TCP probe failed 1 time consecutively for container "backen-brujula-cripto-1" on port 8080. The instance was not started. Connection failed with status CANCELLED.
2025-09-18 09:04:34.452

Cloud Run

UpdateService

…cken-brujula-cripto-build-2025-09-18-001
Ready condition status changed to False for Revision backen-brujula-cripto-build-2025-09-18-001 with message: The user-provided container failed to start and listen on the port defined provided by the PORT=8080 environment variable within the allocated timeout. This can happen when the container port is misconfigured or if the timeout is too short. The health check timeout can be extended. Logs for this revision might contain more information.  Logs URL: https://console.cloud.google.com/logs/viewer?project=brujula-cripto&resource=cloud_run_revision/service_name/backen-brujula-cripto/revision_name/backen-brujula-cripto-build-2025-09-18-001&advancedFilter=resource.type%3D%22cloud_run_revision%22%0Aresource.labels.service_name%3D%22backen-brujula-cripto%22%0Aresource.labels.revision_name%3D%22backen-brujula-cripto-build-2025-09-18-001%22  For more troubleshooting guidance, see https://cloud.google.com/run/docs/troubleshooting#container-failed-to-start
2025-09-18 09:04:34.601

Cloud Run

UpdateService

backen-brujula-cripto
Ready condition status changed to False for Service backen-brujula-cripto with message: Revision 'backen-brujula-cripto-build-2025-09-18-001' is not ready and cannot serve traffic. The user-provided container failed to start and listen on the port defined provided by the PORT=8080 environment variable within the allocated timeout. This can happen when the container port is misconfigured or if the timeout is too short. The health check timeout can be extended. Logs for this revision might contain more information.  Logs URL: https://console.cloud.google.com/logs/viewer?project=brujula-cripto&resource=cloud_run_revision/service_name/backen-brujula-cripto/revision_name/backen-brujula-cripto-build-2025-09-18-001&advancedFilter=resource.type%3D%22cloud_run_revision%22%0Aresource.labels.service_name%3D%22backen-brujula-cripto%22%0Aresource.labels.revision_name%3D%22backen-brujula-cripto-build-2025-09-18-001%22  For more troubleshooting guidance, see https://cloud.google.com/run/docs/troubleshooting#container-failed-to-start
2025-09-20 11:22:40.684

Cloud Run

UpdateService

us-central1:backen-brujula-cripto

service-442091888028@gcp-…
audit_log, method: "google.cloud.run.v2.Services.UpdateService", principal_email: "service-442091888028@gcp-sa-firebaseapphosting.iam.gserviceaccount.com"
2025-09-20 11:23:08.039
Starting new instance. Reason: DEPLOYMENT_ROLLOUT - Instance started due to traffic shifting between revisions due to deployment, traffic split adjustment, or deployment health check.
2025-09-20 11:23:08.956
node:internal/modules/cjs/loader:1210
2025-09-20 11:23:08.956
  throw err;
2025-09-20 11:23:08.956
  ^
2025-09-20 11:23:08.956
Error: Cannot find module '/workspace/.next/standalone/server.js'     at Module._resolveFilename (node:internal/modules/cjs/loader:1207:15)     at Module._load (node:internal/modules/cjs/loader:1038:27)     at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)     at node:internal/main/run_main_module:28:49 {
2025-09-20 11:23:08.956
  code: 'MODULE_NOT_FOUND',
2025-09-20 11:23:08.956
  requireStack: []
2025-09-20 11:23:08.956
}
2025-09-20 11:23:08.956
Node.js v20.19.5
2025-09-20 11:23:09.403
Container called exit(1).
2025-09-20 11:23:09.515
Default STARTUP TCP probe failed 1 time consecutively for container "backen-brujula-cripto-1" on port 8080. The instance was not started. Connection failed with status CANCELLED.
2025-09-20 11:23:09.529

Cloud Run

UpdateService

…cken-brujula-cripto-build-2025-09-20-003
Ready condition status changed to False for Revision backen-brujula-cripto-build-2025-09-20-003 with message: The user-provided container failed to start and listen on the port defined provided by the PORT=8080 environment variable within the allocated timeout. This can happen when the container port is misconfigured or if the timeout is too short. The health check timeout can be extended. Logs for this revision might contain more information.  Logs URL: https://console.cloud.google.com/logs/viewer?project=brujula-cripto&resource=cloud_run_revision/service_name/backen-brujula-cripto/revision_name/backen-brujula-cripto-build-2025-09-20-003&advancedFilter=resource.type%3D%22cloud_run_revision%22%0Aresource.labels.service_name%3D%22backen-brujula-cripto%22%0Aresource.labels.revision_name%3D%22backen-brujula-cripto-build-2025-09-20-003%22  For more troubleshooting guidance, see https://cloud.google.com/run/docs/troubleshooting#container-failed-to-start
2025-09-20 11:23:09.691

Cloud Run

UpdateService

backen-brujula-cripto
Ready condition status changed to False for Service backen-brujula-cripto with message: Revision 'backen-brujula-cripto-build-2025-09-20-003' is not ready and cannot serve traffic. The user-provided container failed to start and listen on the port defined provided by the PORT=8080 environment variable within the allocated timeout. This can happen when the container port is misconfigured or if the timeout is too short. The health check timeout can be extended. Logs for this revision might contain more information.  Logs URL: https://console.cloud.google.com/logs/viewer?project=brujula-cripto&resource=cloud_run_revision/service_name/backen-brujula-cripto/revision_name/backen-brujula-cripto-build-2025-09-20-003&advancedFilter=resource.type%3D%22cloud_run_revision%22%0Aresource.labels.service_name%3D%22backen-brujula-cripto%22%0Aresource.labels.revision_name%3D%22backen-brujula-cripto-build-2025-09-20-003%22  For more troubleshooting guidance, see https://cloud.google.com/run/docs/troubleshooting#container-failed-to-start
2025-09-21 22:04:43.187

Cloud Run

UpdateService

us-central1:backen-brujula-cripto

service-442091888028@gcp-…
audit_log, method: "google.cloud.run.v2.Services.UpdateService", principal_email: "service-442091888028@gcp-sa-firebaseapphosting.iam.gserviceaccount.com"
2025-09-21 22:05:47.604
Starting new instance. Reason: DEPLOYMENT_ROLLOUT - Instance started due to traffic shifting between revisions due to deployment, traffic split adjustment, or deployment health check.
2025-09-21 22:05:48.522
node:internal/modules/cjs/loader:1210
2025-09-21 22:05:48.522
  throw err;
2025-09-21 22:05:48.522
  ^
2025-09-21 22:05:48.522
Error: Cannot find module '/workspace/.next/standalone/server.js'     at Module._resolveFilename (node:internal/modules/cjs/loader:1207:15)     at Module._load (node:internal/modules/cjs/loader:1038:27)     at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)     at node:internal/main/run_main_module:28:49 {
{
errorGroups: [1]
insertId: "68d05a9c0007fae853059e55"
labels: {2}
logName: "projects/brujula-cripto/logs/run.googleapis.com%2Fstderr"
receiveTimestamp: "2025-09-21T20:05:48.528529034Z"
resource: {2}
severity: "ERROR"
textPayload: "Error: Cannot find module '/workspace/.next/standalone/server.js'
    at Module._resolveFilename (node:internal/modules/cjs/loader:1207:15)
    at Module._load (node:internal/modules/cjs/loader:1038:27)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49 {"
timestamp: "2025-09-21T20:05:48.522984Z"
}
2025-09-21 22:05:48.522
  code: 'MODULE_NOT_FOUND',
2025-09-21 22:05:48.522
  requireStack: []
2025-09-21 22:05:48.522
}
2025-09-21 22:05:48.523
Node.js v20.19.5
2025-09-21 22:05:48.995
Container called exit(1).
{
insertId: "68d05a9c000f3100691978bb"
labels: {3}
logName: "projects/brujula-cripto/logs/run.googleapis.com%2Fvarlog%2Fsystem"
receiveTimestamp: "2025-09-21T20:05:49.274472324Z"
resource: {2}
severity: "WARNING"
textPayload: "Container called exit(1)."
timestamp: "2025-09-21T20:05:48.995549298Z"
}
2025-09-21 22:05:49.092
Default STARTUP TCP probe failed 1 time consecutively for container "backen-brujula-cripto-1" on port 8080. The instance was not started. Connection failed with status CANCELLED.
{
insertId: "68d05a9d00016a9942b0ce71"
labels: {2}
logName: "projects/brujula-cripto/logs/run.googleapis.com%2Fvarlog%2Fsystem"
receiveTimestamp: "2025-09-21T20:05:49.274472324Z"
resource: {2}
severity: "ERROR"
textPayload: "Default STARTUP TCP probe failed 1 time consecutively for container "backen-brujula-cripto-1" on port 8080. The instance was not started.
Connection failed with status CANCELLED."
timestamp: "2025-09-21T20:05:49.092825Z"
}
2025-09-21 22:05:49.104

Cloud Run

UpdateService

…cken-brujula-cripto-build-2025-09-21-001
Ready condition status changed to False for Revision backen-brujula-cripto-build-2025-09-21-001 with message: The user-provided container failed to start and listen on the port defined provided by the PORT=8080 environment variable within the allocated timeout. This can happen when the container port is misconfigured or if the timeout is too short. The health check timeout can be extended. Logs for this revision might contain more information.  Logs URL: https://console.cloud.google.com/logs/viewer?project=brujula-cripto&resource=cloud_run_revision/service_name/backen-brujula-cripto/revision_name/backen-brujula-cripto-build-2025-09-21-001&advancedFilter=resource.type%3D%22cloud_run_revision%22%0Aresource.labels.service_name%3D%22backen-brujula-cripto%22%0Aresource.labels.revision_name%3D%22backen-brujula-cripto-build-2025-09-21-001%22  For more troubleshooting guidance, see https://cloud.google.com/run/docs/troubleshooting#container-failed-to-start
2025-09-21 22:05:49.234

Cloud Run

UpdateService

backen-brujula-cripto
Ready condition status changed to False for Service backen-brujula-cripto with message: Revision 'backen-brujula-cripto-build-2025-09-21-001' is not ready and cannot serve traffic. The user-provided container failed to start and listen on the port defined provided by the PORT=8080 environment variable within the allocated timeout. This can happen when the container port is misconfigured or if the timeout is too short. The health check timeout can be extended. Logs for this revision might contain more information.  Logs URL: https://console.cloud.google.com/logs/viewer?project=brujula-cripto&resource=cloud_run_revision/service_name/backen-brujula-cripto/revision_name/backen-brujula-cripto-build-2025-09-21-001&advancedFilter=resource.type%3D%22cloud_run_revision%22%0Aresource.labels.service_name%3D%22backen-brujula-cripto%22%0Aresource.labels.revision_name%3D%22backen-brujula-cripto-build-2025-09-21-001%22  For more troubleshooting guidance, see https://cloud.google.com/run/docs/troubleshooting#container-failed-to-start
2025-09-21 22:24:29.251

Cloud Run

UpdateService

us-central1:backen-brujula-cripto

service-442091888028@gcp-…
audit_log, method: "google.cloud.run.v2.Services.UpdateService", principal_email: "service-442091888028@gcp-sa-firebaseapphosting.iam.gserviceaccount.com"
2025-09-21 22:24:38.953

Cloud Run

UpdateService

us-central1:backen-brujula-cripto

service-442091888028@gcp-…
audit_log, method: "google.cloud.run.v2.Services.UpdateService", principal_email: "service-442091888028@gcp-sa-firebaseapphosting.iam.gserviceaccount.com"
2025-09-21 22:25:05.760
Starting new instance. Reason: DEPLOYMENT_ROLLOUT - Instance started due to traffic shifting between revisions due to deployment, traffic split adjustment, or deployment health check.
2025-09-21 22:25:06.918
node:internal/modules/cjs/loader:1210
2025-09-21 22:25:06.918
  throw err;
