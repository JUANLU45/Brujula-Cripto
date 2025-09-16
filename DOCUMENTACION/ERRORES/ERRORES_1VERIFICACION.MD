25-09-16 11:34:16.347
Step #1 - "preparer": Status: Downloaded newer image for us-central1-docker.pkg.dev/serverless-runtimes/utilities/preparer:base_20250817_18_04_RC00
2025-09-16 11:34:16.353
Step #1 - "preparer": us-central1-docker.pkg.dev/serverless-runtimes/utilities/preparer:base_20250817_18_04_RC00

{
insertId: "54c9aa2f-8410-4b46-8fe8-30c467132d3b-40"
labels: {2}
logName: "projects/brujula-cripto/logs/cloudbuild"
receiveTimestamp: "2025-09-16T09:34:17.023532080Z"
resource: {2}
severity: "INFO"
textPayload: "Step #1 - "preparer": us-central1-docker.pkg.dev/serverless-runtimes/utilities/preparer:base_20250817_18_04_RC00"
timestamp: "2025-09-16T09:34:16.353712448Z"
}
2025-09-16 11:34:17.934
Step #1 - "preparer": 2025/09/16 09:34:17 FIREBASE_CONFIG has no availability specified, applying the default of 'BUILD' and 'RUNTIME'
2025-09-16 11:34:18.126
Step #1 - "preparer": --------------------------------------------------------------------------------
2025-09-16 11:34:18.126
Step #1 - "preparer": (error ID: 96a707a4):

{
insertId: "54c9aa2f-8410-4b46-8fe8-30c467132d3b-43"
labels: {2}
logName: "projects/brujula-cripto/logs/cloudbuild"
receiveTimestamp: "2025-09-16T09:34:18.568356951Z"
resource: {2}
severity: "INFO"
textPayload: "Step #1 - "preparer": (error ID: 96a707a4):"
timestamp: "2025-09-16T09:34:18.126844708Z"
}
2025-09-16 11:34:18.126
Step #1 - "preparer": {"reason":"Misconfigured Secret","code":"fah/misconfigured-secret","userFacingMessage":"Error resolving secret version with name=projects/brujula-cripto/secrets/NEXT_PUBLIC_FIREBASE_API_KEY/versions/latest. Please ensure the secret exists in your project and that your App Hosting backend has access to it. If the secret already exists in your project, please grant your App Hosting backend access to it with the CLI command 'firebase apphosting:secrets:grantaccess'. See https://firebase.google.com/docs/app-hosting/configure#secret-parameters for more information.","rawLog":"getting secret version: rpc error: code = PermissionDenied desc = Permission 'secretmanager.versions.get' denied for resource 'projects/brujula-cripto/secrets/NEXT_PUBLIC_FIREBASE_API_KEY/versions/latest' (or it may not exist)."}

{
insertId: "54c9aa2f-8410-4b46-8fe8-30c467132d3b-44"
labels: {2}
logName: "projects/brujula-cripto/logs/cloudbuild"
receiveTimestamp: "2025-09-16T09:34:18.568356951Z"
resource: {2}
severity: "INFO"
textPayload: "Step #1 - "preparer": {"reason":"Misconfigured Secret","code":"fah/misconfigured-secret","userFacingMessage":"Error resolving secret version with name=projects/brujula-cripto/secrets/NEXT_PUBLIC_FIREBASE_API_KEY/versions/latest. Please ensure the secret exists in your project and that your App Hosting backend has access to it. If the secret already exists in your project, please grant your App Hosting backend access to it with the CLI command 'firebase apphosting:secrets:grantaccess'. See https://firebase.google.com/docs/app-hosting/configure#secret-parameters for more information.","rawLog":"getting secret version: rpc error: code = PermissionDenied desc = Permission 'secretmanager.versions.get' denied for resource 'projects/brujula-cripto/secrets/NEXT_PUBLIC_FIREBASE_API_KEY/versions/latest' (or it may not exist)."}"
timestamp: "2025-09-16T09:34:18.126853521Z"
}
2025-09-16 11:34:18.126
Step #1 - "preparer": --------------------------------------------------------------------------------

{
insertId: "54c9aa2f-8410-4b46-8fe8-30c467132d3b-45"
labels: {2}
logName: "projects/brujula-cripto/logs/cloudbuild"
receiveTimestamp: "2025-09-16T09:34:18.568356951Z"
resource: {2}
severity: "INFO"
textPayload: "Step #1 - "preparer": --------------------------------------------------------------------------------"
timestamp: "2025-09-16T09:34:18.126855553Z"
}
2025-09-16 11:34:18.126
Step #1 - "preparer": Sorry your project couldn't be built.

{
insertId: "54c9aa2f-8410-4b46-8fe8-30c467132d3b-46"
labels: {2}
logName: "projects/brujula-cripto/logs/cloudbuild"
receiveTimestamp: "2025-09-16T09:34:18.568356951Z"
resource: {2}
severity: "INFO"
textPayload: "Step #1 - "preparer": Sorry your project couldn't be built."
timestamp: "2025-09-16T09:34:18.126856484Z"
}
2025-09-16 11:34:18.126
Step #1 - "preparer": Our documentation explains ways to configure Buildpacks to better recognise your project:

{
insertId: "54c9aa2f-8410-4b46-8fe8-30c467132d3b-47"
labels: {2}
logName: "projects/brujula-cripto/logs/cloudbuild"
receiveTimestamp: "2025-09-16T09:34:18.568356951Z"
resource: {2}
severity: "INFO"
textPayload: "Step #1 - "preparer": Our documentation explains ways to configure Buildpacks to better recognise your project:"
timestamp: "2025-09-16T09:34:18.126857411Z"
}
2025-09-16 11:34:18.126
Step #1 - "preparer":  -> https://cloud.google.com/docs/buildpacks/overview

{
insertId: "54c9aa2f-8410-4b46-8fe8-30c467132d3b-48"
labels: {2}
logName: "projects/brujula-cripto/logs/cloudbuild"
receiveTimestamp: "2025-09-16T09:34:18.568356951Z"
resource: {2}
severity: "INFO"
textPayload: "Step #1 - "preparer":  -> https://cloud.google.com/docs/buildpacks/overview"
timestamp: "2025-09-16T09:34:18.126858298Z"
}
2025-09-16 11:34:18.126
Step #1 - "preparer": If you think you've found an issue, please report it:

{
insertId: "54c9aa2f-8410-4b46-8fe8-30c467132d3b-49"
labels: {2}
logName: "projects/brujula-cripto/logs/cloudbuild"
receiveTimestamp: "2025-09-16T09:34:18.568356951Z"
resource: {2}
severity: "INFO"
textPayload: "Step #1 - "preparer": If you think you've found an issue, please report it:"
timestamp: "2025-09-16T09:34:18.126858906Z"
}
2025-09-16 11:34:18.126
Step #1 - "preparer":  -> https://github.com/GoogleCloudPlatform/buildpacks/issues/new

{
insertId: "54c9aa2f-8410-4b46-8fe8-30c467132d3b-50"
labels: {2}
logName: "projects/brujula-cripto/logs/cloudbuild"
receiveTimestamp: "2025-09-16T09:34:18.568356951Z"
resource: {2}
severity: "INFO"
textPayload: "Step #1 - "preparer":  -> https://github.com/GoogleCloudPlatform/buildpacks/issues/new"
timestamp: "2025-09-16T09:34:18.126859532Z"
}
2025-09-16 11:34:18.126
Step #1 - "preparer": --------------------------------------------------------------------------------

{
insertId: "54c9aa2f-8410-4b46-8fe8-30c467132d3b-51"
labels: {2}
logName: "projects/brujula-cripto/logs/cloudbuild"
receiveTimestamp: "2025-09-16T09:34:18.568356951Z"
resource: {2}
severity: "INFO"
textPayload: "Step #1 - "preparer": --------------------------------------------------------------------------------"
timestamp: "2025-09-16T09:34:18.126860241Z"
}
2025-09-16 11:34:18.418
Finished Step #1 - "preparer"

{
insertId: "54c9aa2f-8410-4b46-8fe8-30c467132d3b-52"
labels: {2}
logName: "projects/brujula-cripto/logs/cloudbuild"
receiveTimestamp: "2025-09-16T09:34:18.568356951Z"
resource: {2}
severity: "INFO"
textPayload: "Finished Step #1 - "preparer""
timestamp: "2025-09-16T09:34:18.418990805Z"
}
2025-09-16 11:34:18.419
ERROR

{
insertId: "54c9aa2f-8410-4b46-8fe8-30c467132d3b-53"
labels: {2}
logName: "projects/brujula-cripto/logs/cloudbuild"
receiveTimestamp: "2025-09-16T09:34:18.568356951Z"
resource: {2}
severity: "INFO"
textPayload: "ERROR"
timestamp: "2025-09-16T09:34:18.419106286Z"
}
2025-09-16 11:34:18.419
ERROR: build step 1 "us-central1-docker.pkg.dev/serverless-runtimes/utilities/preparer:base_20250817_18_04_RC00" failed: step exited with non-zero status: 1

{
insertId: "54c9aa2f-8410-4b46-8fe8-30c467132d3b-54"
labels: {2}
logName: "projects/brujula-cripto/logs/cloudbuild"
receiveTimestamp: "2025-09-16T09:34:18.568356951Z"
resource: {2}
severity: "INFO"
textPayload: "ERROR: build step 1 "us-central1-docker.pkg.dev/serverless-runtimes/utilities/preparer:base_20250817_18_04_RC00" failed: step exited with non-zero status: 1"
timestamp: "2025-09-16T09:34:18.419128929Z"
}
Se muestran los registros del período especificado en la búsqueda. Para ver más resultados, actualiza tu búsqueda.