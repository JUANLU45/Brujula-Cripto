INFO 2025-09-15T23:18:49.630781314Z Step #2 - "pack": packages/app build: Failed
INFO 2025-09-15T23:18:49.630781924Z Step #2 - "pack": /workspace/packages/app:
INFO 2025-09-15T23:18:49.630782674Z Step #2 - "pack": ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL @brujula-cripto/app@1.0.0 build: `next build`
INFO 2025-09-15T23:18:49.630783274Z Step #2 - "pack": Exit status 1
INFO 2025-09-15T23:18:49.630785364Z Step #2 - "pack": /layers/google.nodejs.firebasenextjs/npm_modules/node_modules/@apphosting/common/dist/index.js:61
INFO 2025-09-15T23:18:49.630785904Z Step #2 - "pack": reject(new Error(`Build process exited with error code ${code}.`));
INFO 2025-09-15T23:18:49.630786264Z Step #2 - "pack": ^
INFO 2025-09-15T23:18:49.630786474Z Step #2 - "pack":
INFO 2025-09-15T23:18:49.630786894Z Step #2 - "pack": Error: Build process exited with error code 1.
  {
    "textPayload": "Step #2 - \"pack\": Error: Build process exited with error code 1.",
    "insertId": "b09bb674-acf9-4032-84de-8f1ca1796a20-495",
    "resource": {
      "type": "build",
      "labels": {
        "project_id": "brujula-cripto",
        "build_id": "b09bb674-acf9-4032-84de-8f1ca1796a20",
        "build_trigger_id": ""
      }
    },
    "timestamp": "2025-09-15T23:18:49.630786894Z",
    "severity": "INFO",
    "labels": {
      "build_step": "Step #2 - \"pack\"",
      "build_tags": "fah,build-2025-09-15-011,backen-brujula-cripto,7ad99a588c28a33b947fa038562502861739dd54,p-fah,r-nodejs,b-nodejs_20250907_RC00,bt-PACK"
    },
    "logName": "projects/brujula-cripto/logs/cloudbuild",
    "receiveTimestamp": "2025-09-15T23:18:50.385004533Z"
  }
INFO 2025-09-15T23:18:49.630787334Z Step #2 - "pack": at ChildProcess.<anonymous> (/layers/google.nodejs.firebasenextjs/npm_modules/node_modules/@apphosting/common/dist/index.js:61:24)
INFO 2025-09-15T23:18:49.630787734Z Step #2 - "pack": at ChildProcess.emit (node:events:519:28)
INFO 2025-09-15T23:18:49.630788064Z Step #2 - "pack": at ChildProcess._handle.onexit (node:internal/child_process:293:12)
INFO 2025-09-15T23:18:49.630788354Z Step #2 - "pack":
INFO 2025-09-15T23:18:49.630788614Z Step #2 - "pack": Node.js v22.19.0"}
  {
    "textPayload": "Step #2 - \"pack\": Node.js v22.19.0\"}",
    "insertId": "b09bb674-acf9-4032-84de-8f1ca1796a20-500",
    "resource": {
      "type": "build",
      "labels": {
        "build_trigger_id": "",
        "project_id": "brujula-cripto",
        "build_id": "b09bb674-acf9-4032-84de-8f1ca1796a20"
      }
    },
    "timestamp": "2025-09-15T23:18:49.630788614Z",
    "severity": "INFO",
    "labels": {
      "build_step": "Step #2 - \"pack\"",
      "build_tags": "fah,build-2025-09-15-011,backen-brujula-cripto,7ad99a588c28a33b947fa038562502861739dd54,p-fah,r-nodejs,b-nodejs_20250907_RC00,bt-PACK"
    },
    "logName": "projects/brujula-cripto/logs/cloudbuild",
    "receiveTimestamp": "2025-09-15T23:18:50.385004533Z"
  }
INFO 2025-09-15T23:18:49.633040596Z Step #2 - "pack": ERROR: failed to build: exit status 1
  {
    "textPayload": "Step #2 - \"pack\": ERROR: failed to build: exit status 1",
    "insertId": "b09bb674-acf9-4032-84de-8f1ca1796a20-501",
    "resource": {
      "type": "build",
      "labels": {
        "build_id": "b09bb674-acf9-4032-84de-8f1ca1796a20",
        "project_id": "brujula-cripto",
        "build_trigger_id": ""
      }
    },
    "timestamp": "2025-09-15T23:18:49.633040596Z",
    "severity": "INFO",
    "labels": {
      "build_step": "Step #2 - \"pack\"",
      "build_tags": "fah,build-2025-09-15-011,backen-brujula-cripto,7ad99a588c28a33b947fa038562502861739dd54,p-fah,r-nodejs,b-nodejs_20250907_RC00,bt-PACK"
    },
    "logName": "projects/brujula-cripto/logs/cloudbuild",
    "receiveTimestamp": "2025-09-15T23:18:50.385004533Z"
  }
INFO 2025-09-15T23:18:52.169221243Z Step #2 - "pack": ERROR: failed to build: executing lifecycle: failed with status code: 51
  {
    "textPayload": "Step #2 - \"pack\": ERROR: failed to build: executing lifecycle: failed with status code: 51",
    "insertId": "b09bb674-acf9-4032-84de-8f1ca1796a20-502",
    "resource": {
      "type": "build",
      "labels": {
        "project_id": "brujula-cripto",
        "build_id": "b09bb674-acf9-4032-84de-8f1ca1796a20",
        "build_trigger_id": ""
      }
    },
    "timestamp": "2025-09-15T23:18:52.169221243Z",
    "severity": "INFO",
    "labels": {
      "build_tags": "fah,build-2025-09-15-011,backen-brujula-cripto,7ad99a588c28a33b947fa038562502861739dd54,p-fah,r-nodejs,b-nodejs_20250907_RC00,bt-PACK",
      "build_step": "Step #2 - \"pack\""
    },
    "logName": "projects/brujula-cripto/logs/cloudbuild",
    "receiveTimestamp": "2025-09-15T23:18:52.361814930Z"
  }
INFO 2025-09-15T23:18:52.428107537Z Finished Step #2 - "pack"
  {
    "textPayload": "Finished Step #2 - \"pack\"",
    "insertId": "b09bb674-acf9-4032-84de-8f1ca1796a20-503",
    "resource": {
      "type": "build",
      "labels": {
        "build_trigger_id": "",
        "project_id": "brujula-cripto",
        "build_id": "b09bb674-acf9-4032-84de-8f1ca1796a20"
      }
    },
    "timestamp": "2025-09-15T23:18:52.428107537Z",
    "severity": "INFO",
    "labels": {
      "build_step": "MAIN",
      "build_tags": "fah,build-2025-09-15-011,backen-brujula-cripto,7ad99a588c28a33b947fa038562502861739dd54,p-fah,r-nodejs,b-nodejs_20250907_RC00,bt-PACK"
    },
    "logName": "projects/brujula-cripto/logs/cloudbuild",
    "receiveTimestamp": "2025-09-15T23:18:52.541347004Z"
  }
INFO 2025-09-15T23:18:52.428182297Z ERROR
  {
    "textPayload": "ERROR",
    "insertId": "b09bb674-acf9-4032-84de-8f1ca1796a20-504",
    "resource": {
      "type": "build",
      "labels": {
        "project_id": "brujula-cripto",
        "build_id": "b09bb674-acf9-4032-84de-8f1ca1796a20",
        "build_trigger_id": ""
      }
    },
    "timestamp": "2025-09-15T23:18:52.428182297Z",
    "severity": "INFO",
    "labels": {
      "build_step": "MAIN",
      "build_tags": "fah,build-2025-09-15-011,backen-brujula-cripto,7ad99a588c28a33b947fa038562502861739dd54,p-fah,r-nodejs,b-nodejs_20250907_RC00,bt-PACK"
    },
    "logName": "projects/brujula-cripto/logs/cloudbuild",
    "receiveTimestamp": "2025-09-15T23:18:52.541347004Z"
  }
INFO 2025-09-15T23:18:52.428199137Z ERROR: build step 2 "gcr.io/k8s-skaffold/pack" failed: step exited with non-zero status: 1
  {
    "textPayload": "ERROR: build step 2 \"gcr.io/k8s-skaffold/pack\" failed: step exited with non-zero status: 1",
    "insertId": "b09bb674-acf9-4032-84de-8f1ca1796a20-505",
    "resource": {
      "type": "build",
      "labels": {
        "build_trigger_id": "",
        "project_id": "brujula-cripto",
        "build_id": "b09bb674-acf9-4032-84de-8f1ca1796a20"
      }
    },
    "timestamp": "2025-09-15T23:18:52.428199137Z",
    "severity": "INFO",
    "labels": {
      "build_tags": "fah,build-2025-09-15-011,backen-brujula-cripto,7ad99a588c28a33b947fa038562502861739dd54,p-fah,r-nodejs,b-nodejs_20250907_RC00,bt-PACK",
      "build_step": "MAIN"
    },
    "logName": "projects/brujula-cripto/logs/cloudbuild",
    "receiveTimestamp": "2025-09-15T23:18:52.541347004Z"
  }
