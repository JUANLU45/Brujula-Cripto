INFO 2025-09-19T19:43:16.808764954Z Step #2 - "pack": node:fs:449
INFO 2025-09-19T19:43:16.808783334Z Step #2 - "pack": return binding.readFileUtf8(path, stringToFlags(options.flag));
INFO 2025-09-19T19:43:16.808784394Z Step #2 - "pack": ^
INFO 2025-09-19T19:43:16.808784703Z Step #2 - "pack":
  {
    "textPayload": "Step #2 - \"pack\": ",
    "insertId": "e7a02558-e5e8-467f-ae7d-0cb4ac51fa48-583",
    "resource": {
      "type": "build",
      "labels": {
        "project_id": "brujula-cripto",
        "build_id": "e7a02558-e5e8-467f-ae7d-0cb4ac51fa48",
        "build_trigger_id": ""
      }
    },
    "timestamp": "2025-09-19T19:43:16.808784703Z",
    "severity": "INFO",
    "labels": {
      "build_step": "Step #2 - \"pack\"",
      "build_tags": "fah,build-2025-09-19-018,backen-brujula-cripto,2dfc1b360782e08a28a8a74e48d218cf00892360,p-fah,r-nodejs,b-nodejs_20250914_RC00,bt-PACK"
    },
    "logName": "projects/brujula-cripto/logs/cloudbuild",
    "receiveTimestamp": "2025-09-19T19:43:17.381790876Z"
  }
INFO 2025-09-19T19:43:16.808785603Z Step #2 - "pack": Error: ENOENT: no such file or directory, open '/workspace/.next/standalone/.next/routes-manifest.json'
INFO 2025-09-19T19:43:16.808786254Z Step #2 - "pack": at readFileSync (node:fs:449:20)
INFO 2025-09-19T19:43:16.808787054Z Step #2 - "pack": at loadRouteManifest (file:///layers/google.nodejs.firebasenextjs/npm_modules/node_modules/@apphosting/adapter-nextjs/dist/utils.js:35:18)
INFO 2025-09-19T19:43:16.808787723Z Step #2 - "pack": at addRouteOverrides (file:///layers/google.nodejs.firebasenextjs/npm_modules/node_modules/@apphosting/adapter-nextjs/dist/overrides.js:145:27)
INFO 2025-09-19T19:43:16.808788454Z Step #2 - "pack": at file:///layers/google.nodejs.firebasenextjs/npm_modules/node_modules/@apphosting/adapter-nextjs/dist/bin/build.js:37:11
INFO 2025-09-19T19:43:16.808790394Z Step #2 - "pack": at process.processTicksAndRejections (node:internal/process/task_queues:95:5) {
INFO 2025-09-19T19:43:16.808790703Z Step #2 - "pack": errno: -2,
  {
    "textPayload": "Step #2 - \"pack\":   errno: -2,",
    "insertId": "e7a02558-e5e8-467f-ae7d-0cb4ac51fa48-590",
    "resource": {
      "type": "build",
      "labels": {
        "build_trigger_id": "",
        "build_id": "e7a02558-e5e8-467f-ae7d-0cb4ac51fa48",
        "project_id": "brujula-cripto"
      }
    },
    "timestamp": "2025-09-19T19:43:16.808790703Z",
    "severity": "INFO",
    "labels": {
      "build_tags": "fah,build-2025-09-19-018,backen-brujula-cripto,2dfc1b360782e08a28a8a74e48d218cf00892360,p-fah,r-nodejs,b-nodejs_20250914_RC00,bt-PACK",
      "build_step": "Step #2 - \"pack\""
    },
    "logName": "projects/brujula-cripto/logs/cloudbuild",
    "receiveTimestamp": "2025-09-19T19:43:17.381790876Z"
  }
INFO 2025-09-19T19:43:16.808790963Z Step #2 - "pack": code: 'ENOENT',
INFO 2025-09-19T19:43:16.808791963Z Step #2 - "pack": syscall: 'open',
INFO 2025-09-19T19:43:16.808794963Z Step #2 - "pack": path: '/workspace/.next/standalone/.next/routes-manifest.json'
INFO 2025-09-19T19:43:16.808795223Z Step #2 - "pack": }
INFO 2025-09-19T19:43:16.808796123Z Step #2 - "pack":
INFO 2025-09-19T19:43:16.808797463Z Step #2 - "pack": Node.js v20.19.5
INFO 2025-09-19T19:43:16.824913543Z Step #2 - "pack": Done "npm exec --prefix /layers/google.nodejs.firebasenextjs/npm_m..." (1m19.691295132s)
INFO 2025-09-19T19:43:16.833818803Z Step #2 - "pack": --------------------------------------------------------------------------------
INFO 2025-09-19T19:43:16.833830263Z Step #2 - "pack": failed to build: (error ID: fecc284c):
INFO 2025-09-19T19:43:16.833832423Z Step #2 - "pack": {"reason":"Failed Framework Build","code":"fah/failed-framework-build","userFacingMessage":"Your application failed to run the framework build command 'npm exec --prefix /layers/google.nodejs.firebasenextjs/npm_modules apphosting-adapter-nextjs-build' successfully. Please check the raw log to address the error and confirm that your application builds locally before redeploying.","rawLog":"(error ID: d0a693a9):
INFO 2025-09-19T19:43:16.833833003Z Step #2 - "pack": > brujula-cripto@1.0.0 build
INFO 2025-09-19T19:43:16.833833613Z Step #2 - "pack": > pnpm -r build
INFO 2025-09-19T19:43:16.833836293Z Step #2 - "pack":
INFO 2025-09-19T19:43:16.833836663Z Step #2 - "pack": Scope: 3 of 4 workspace projects
INFO 2025-09-19T19:43:16.833836913Z Step #2 - "pack": packages/types build$ tsc
INFO 2025-09-19T19:43:16.833837333Z Step #2 - "pack": packages/types build: Done
INFO 2025-09-19T19:43:16.833837643Z Step #2 - "pack": packages/app prebuild$ cd ../types && pnpm build
INFO 2025-09-19T19:43:16.833837953Z Step #2 - "pack": packages/functions build$ tsc
INFO 2025-09-19T19:43:16.833838743Z Step #2 - "pack": packages/app prebuild: > @brujula-cripto/types@1.0.0 build /workspace/packages/types
INFO 2025-09-19T19:43:16.833838973Z Step #2 - "pack": packages/app prebuild: > tsc
INFO 2025-09-19T19:43:16.833839213Z Step #2 - "pack": packages/app prebuild: Done
INFO 2025-09-19T19:43:16.833839463Z Step #2 - "pack": packages/app build$ next build
INFO 2025-09-19T19:43:16.833839893Z Step #2 - "pack": packages/app build: ▲ Next.js 15.5.3
INFO 2025-09-19T19:43:16.833840293Z Step #2 - "pack": packages/app build: Creating an optimized production build ...
INFO 2025-09-19T19:43:16.833842013Z Step #2 - "pack": packages/functions build: Done
INFO 2025-09-19T19:43:16.833842563Z Step #2 - "pack": packages/app build: ✓ Compiled successfully in 21.8s
INFO 2025-09-19T19:43:16.833843083Z Step #2 - "pack": packages/app build: Linting and checking validity of types ...
INFO 2025-09-19T19:43:16.833845083Z Step #2 - "pack": packages/app build: ⨯ ESLint: Plugin "react-hooks" was conflicted between ".eslintrc.json » eslint-config-next/core-web-vitals » /workspace/node_modules/.pnpm/eslint-config-next@15.5.3_eslint@8.57.1_typescript@5.9.2/node_modules/eslint-config-next/index.js » plugin:react-hooks/recommended" and "../../.eslintrc.cjs » eslint-config-next/core-web-vitals » /workspace/node_modules/.pnpm/eslint-config-next@15.5.3_eslint@9.35.0_jiti@1.21.7__typescript@5.9.2/node_modules/eslint-config-next/index.js » plugin:react-hooks/recommended".
INFO 2025-09-19T19:43:16.833845443Z Step #2 - "pack": packages/app build: Collecting page data ...
INFO 2025-09-19T19:43:16.833846223Z Step #2 - "pack": packages/app build: Generating static pages (0/3) ...
INFO 2025-09-19T19:43:16.833846633Z Step #2 - "pack": packages/app build: ✓ Generating static pages (3/3)
INFO 2025-09-19T19:43:16.833847023Z Step #2 - "pack": packages/app build: Finalizing page optimization ...
INFO 2025-09-19T19:43:16.833849553Z Step #2 - "pack": packages/app build: Collecting build traces ...
INFO 2025-09-19T19:43:16.833850053Z Step #2 - "pack": packages/app build: Route (app) Size First Load JS
INFO 2025-09-19T19:43:16.833852393Z Step #2 - "pack": packages/app build: ┌ ○ /_not-found 996 B 102 kB
INFO 2025-09-19T19:43:16.833853513Z Step #2 - "pack": packages/app build: ├ ƒ /[locale] 7.47 kB 256 kB
INFO 2025-09-19T19:43:16.833853813Z Step #2 - "pack": packages/app build: ├ ƒ /[locale]/admin 2.55 kB 246 kB
INFO 2025-09-19T19:43:16.833855593Z Step #2 - "pack": packages/app build: ├ ƒ /[locale]/articles 5.42 kB 248 kB
INFO 2025-09-19T19:43:16.833856233Z Step #2 - "pack": packages/app build: ├ ƒ /[locale]/articles/[id] 115 kB 360 kB
INFO 2025-09-19T19:43:16.833856593Z Step #2 - "pack": packages/app build: ├ ƒ /[locale]/auth 2.91 kB 243 kB
INFO 2025-09-19T19:43:16.833856943Z Step #2 - "pack": packages/app build: ├ ƒ /[locale]/blog 1.72 kB 141 kB
INFO 2025-09-19T19:43:16.833857293Z Step #2 - "pack": packages/app build: ├ ƒ /[locale]/blog/[slug] 3.5 kB 133 kB
INFO 2025-09-19T19:43:16.833857663Z Step #2 - "pack": packages/app build: ├ ƒ /[locale]/chatbot 10.7 kB 135 kB
INFO 2025-09-19T19:43:16.833858003Z Step #2 - "pack": packages/app build: ├ ƒ /[locale]/comments 3.43 kB 243 kB
INFO 2025-09-19T19:43:16.833858343Z Step #2 - "pack": packages/app build: ├ ƒ /[locale]/contacto 28.5 kB 152 kB
INFO 2025-09-19T19:43:16.833858683Z Step #2 - "pack": packages/app build: ├ ƒ /[locale]/cuenta 5.31 kB 245 kB
INFO 2025-09-19T19:43:16.833859063Z Step #2 - "pack": packages/app build: ├ ƒ /[locale]/dashboard 3.44 kB 246 kB
INFO 2025-09-19T19:43:16.833859443Z Step #2 - "pack": packages/app build: ├ ƒ /[locale]/feedback 3.6 kB 243 kB
INFO 2025-09-19T19:43:16.833859833Z Step #2 - "pack": packages/app build: ├ ƒ /[locale]/herramientas/servicios 2.38 kB 132 kB
INFO 2025-09-19T19:43:16.833860213Z Step #2 - "pack": packages/app build: ├ ƒ /[locale]/herramientas/tracker 3.17 kB 243 kB
INFO 2025-09-19T19:43:16.833860583Z Step #2 - "pack": packages/app build: ├ ƒ /[locale]/homepage 3.42 kB 248 kB
INFO 2025-09-19T19:43:16.833861033Z Step #2 - "pack": packages/app build: ├ ƒ /[locale]/legal/aviso-legal 174 B 105 kB
INFO 2025-09-19T19:43:16.833861373Z Step #2 - "pack": packages/app build: ├ ƒ /[locale]/legal/descargo-responsabilidad 174 B 105 kB
INFO 2025-09-19T19:43:16.833861883Z Step #2 - "pack": packages/app build: ├ ƒ /[locale]/legal/privacidad 174 B 105 kB
INFO 2025-09-19T19:43:16.833862233Z Step #2 - "pack": packages/app build: ├ ƒ /[locale]/legal/terminos 174 B 105 kB
INFO 2025-09-19T19:43:16.833862583Z Step #2 - "pack": packages/app build: ├ ƒ /[locale]/login 3.25 kB 243 kB
INFO 2025-09-19T19:43:16.833863043Z Step #2 - "pack": packages/app build: ├ ƒ /[locale]/recuperacion 4.18 kB 133 kB
INFO 2025-09-19T19:43:16.833863413Z Step #2 - "pack": packages/app build: ├ ƒ /[locale]/recuperacion/password 6.97 kB 247 kB
INFO 2025-09-19T19:43:16.833863783Z Step #2 - "pack": packages/app build: ├ ƒ /[locale]/recuperar-password 2.31 kB 237 kB
INFO 2025-09-19T19:43:16.833864153Z Step #2 - "pack": packages/app build: ├ ƒ /[locale]/registro 3.08 kB 238 kB
INFO 2025-09-19T19:43:16.833864513Z Step #2 - "pack": packages/app build: ├ ƒ /[locale]/seguridad 986 B 140 kB
INFO 2025-09-19T19:43:16.833864873Z Step #2 - "pack": packages/app build: ├ ƒ /[locale]/suscripcion 4.19 kB 128 kB
INFO 2025-09-19T19:43:16.833865233Z Step #2 - "pack": packages/app build: └ ƒ /[locale]/users 3.89 kB 244 kB
INFO 2025-09-19T19:43:16.833865583Z Step #2 - "pack": packages/app build: + First Load JS shared by all 101 kB
INFO 2025-09-19T19:43:16.833865953Z Step #2 - "pack": packages/app build: ├ chunks/27877061-9ba3884dbaa7cfe6.js 54.2 kB
INFO 2025-09-19T19:43:16.833866303Z Step #2 - "pack": packages/app build: ├ chunks/7759-96501787d7b03936.js 45.3 kB
INFO 2025-09-19T19:43:16.833866653Z Step #2 - "pack": packages/app build: └ other shared chunks (total) 1.93 kB
INFO 2025-09-19T19:43:16.833873913Z Step #2 - "pack": packages/app build: ƒ Middleware 44.8 kB
INFO 2025-09-19T19:43:16.833874233Z Step #2 - "pack": packages/app build: ○ (Static) prerendered as static content
INFO 2025-09-19T19:43:16.833874553Z Step #2 - "pack": packages/app build: ƒ (Dynamic) server-rendered on demand
INFO 2025-09-19T19:43:16.833875173Z Step #2 - "pack": packages/app build: Done
INFO 2025-09-19T19:43:16.833876383Z Step #2 - "pack": packages/app postbuild$ node -e "const fs=require('fs');const path=require('path');fs.mkdirSync('.next/standalone/packages/types',{recursive:true});fs.cpSync('../types/dist','.next/standalone/packages/types/dist',{recursive:true});fs.mkdirSync('.next/standalone/.next',{recursive:true});const routesFile=fs.existsSync('.next/routes-manifest.json')?'.next/routes-manifest.json':'.next/app-path-routes-manifest.json';fs.copyFileSync(routesFile,'.next/standalone/.next/routes-manifest.json');"
INFO 2025-09-19T19:43:16.833876743Z Step #2 - "pack": packages/app postbuild: Done
INFO 2025-09-19T19:43:16.833877023Z Step #2 - "pack": node:fs:449
INFO 2025-09-19T19:43:16.833877323Z Step #2 - "pack": return binding.readFileUtf8(path, stringToFlags(options.flag));
INFO 2025-09-19T19:43:16.833877573Z Step #2 - "pack": ^
INFO 2025-09-19T19:43:16.833877763Z Step #2 - "pack":
INFO 2025-09-19T19:43:16.833878473Z Step #2 - "pack": Error: ENOENT: no such file or directory, open '/workspace/.next/standalone/.next/routes-manifest.json'
INFO 2025-09-19T19:43:16.833878883Z Step #2 - "pack": at readFileSync (node:fs:449:20)
INFO 2025-09-19T19:43:16.833879643Z Step #2 - "pack": at loadRouteManifest (file:///layers/google.nodejs.firebasenextjs/npm_modules/node_modules/@apphosting/adapter-nextjs/dist/utils.js:35:18)
INFO 2025-09-19T19:43:16.833880343Z Step #2 - "pack": at addRouteOverrides (file:///layers/google.nodejs.firebasenextjs/npm_modules/node_modules/@apphosting/adapter-nextjs/dist/overrides.js:145:27)
INFO 2025-09-19T19:43:16.833880943Z Step #2 - "pack": at file:///layers/google.nodejs.firebasenextjs/npm_modules/node_modules/@apphosting/adapter-nextjs/dist/bin/build.js:37:11
INFO 2025-09-19T19:43:16.833881323Z Step #2 - "pack": at process.processTicksAndRejections (node:internal/process/task_queues:95:5) {
INFO 2025-09-19T19:43:16.833881633Z Step #2 - "pack": errno: -2,
  {
    "textPayload": "Step #2 - \"pack\":   errno: -2,",
    "insertId": "e7a02558-e5e8-467f-ae7d-0cb4ac51fa48-674",
    "resource": {
      "type": "build",
      "labels": {
        "project_id": "brujula-cripto",
        "build_id": "e7a02558-e5e8-467f-ae7d-0cb4ac51fa48",
        "build_trigger_id": ""
      }
    },
    "timestamp": "2025-09-19T19:43:16.833881633Z",
    "severity": "INFO",
    "labels": {
      "build_tags": "fah,build-2025-09-19-018,backen-brujula-cripto,2dfc1b360782e08a28a8a74e48d218cf00892360,p-fah,r-nodejs,b-nodejs_20250914_RC00,bt-PACK",
      "build_step": "Step #2 - \"pack\""
    },
    "logName": "projects/brujula-cripto/logs/cloudbuild",
    "receiveTimestamp": "2025-09-19T19:43:17.381790876Z"
  }
INFO 2025-09-19T19:43:16.833881903Z Step #2 - "pack": code: 'ENOENT',
INFO 2025-09-19T19:43:16.833882283Z Step #2 - "pack": syscall: 'open',
INFO 2025-09-19T19:43:16.833882623Z Step #2 - "pack": path: '/workspace/.next/standalone/.next/routes-manifest.json'
INFO 2025-09-19T19:43:16.833882823Z Step #2 - "pack": }
INFO 2025-09-19T19:43:16.833883143Z Step #2 - "pack":
INFO 2025-09-19T19:43:16.833883423Z Step #2 - "pack": Node.js v20.19.5"}
INFO 2025-09-19T19:43:16.835322423Z Step #2 - "pack": ERROR: failed to build: exit status 1
  {
    "textPayload": "Step #2 - \"pack\": ERROR: failed to build: exit status 1",
    "insertId": "e7a02558-e5e8-467f-ae7d-0cb4ac51fa48-681",
    "resource": {
      "type": "build",
      "labels": {
        "project_id": "brujula-cripto",
        "build_id": "e7a02558-e5e8-467f-ae7d-0cb4ac51fa48",
        "build_trigger_id": ""
      }
    },
    "timestamp": "2025-09-19T19:43:16.835322423Z",
    "severity": "INFO",
    "labels": {
      "build_step": "Step #2 - \"pack\"",
      "build_tags": "fah,build-2025-09-19-018,backen-brujula-cripto,2dfc1b360782e08a28a8a74e48d218cf00892360,p-fah,r-nodejs,b-nodejs_20250914_RC00,bt-PACK"
    },
    "logName": "projects/brujula-cripto/logs/cloudbuild",
    "receiveTimestamp": "2025-09-19T19:43:17.381790876Z"
  }
INFO 2025-09-19T19:43:19.244378134Z Step #2 - "pack": ERROR: failed to build: executing lifecycle: failed with status code: 51
  {
    "textPayload": "Step #2 - \"pack\": ERROR: failed to build: executing lifecycle: failed with status code: 51",
    "insertId": "e7a02558-e5e8-467f-ae7d-0cb4ac51fa48-682",
    "resource": {
      "type": "build",
      "labels": {
        "project_id": "brujula-cripto",
        "build_trigger_id": "",
        "build_id": "e7a02558-e5e8-467f-ae7d-0cb4ac51fa48"
      }
    },
    "timestamp": "2025-09-19T19:43:19.244378134Z",
    "severity": "INFO",
    "labels": {
      "build_tags": "fah,build-2025-09-19-018,backen-brujula-cripto,2dfc1b360782e08a28a8a74e48d218cf00892360,p-fah,r-nodejs,b-nodejs_20250914_RC00,bt-PACK",
      "build_step": "Step #2 - \"pack\""
    },
    "logName": "projects/brujula-cripto/logs/cloudbuild",
    "receiveTimestamp": "2025-09-19T19:43:19.346240345Z"
  }
INFO 2025-09-19T19:43:19.510021043Z Finished Step #2 - "pack"
INFO 2025-09-19T19:43:19.510099653Z ERROR
  {
    "textPayload": "ERROR",
    "insertId": "e7a02558-e5e8-467f-ae7d-0cb4ac51fa48-684",
    "resource": {
      "type": "build",
      "labels": {
        "build_trigger_id": "",
        "build_id": "e7a02558-e5e8-467f-ae7d-0cb4ac51fa48",
        "project_id": "brujula-cripto"
      }
    },
    "timestamp": "2025-09-19T19:43:19.510099653Z",
    "severity": "INFO",
    "labels": {
      "build_step": "MAIN",
      "build_tags": "fah,build-2025-09-19-018,backen-brujula-cripto,2dfc1b360782e08a28a8a74e48d218cf00892360,p-fah,r-nodejs,b-nodejs_20250914_RC00,bt-PACK"
    },
    "logName": "projects/brujula-cripto/logs/cloudbuild",
    "receiveTimestamp": "2025-09-19T19:43:19.619599490Z"
  }
INFO 2025-09-19T19:43:19.510114903Z ERROR: build step 2 "gcr.io/k8s-skaffold/pack" failed: step exited with non-zero status: 1
  {
    "textPayload": "ERROR: build step 2 \"gcr.io/k8s-skaffold/pack\" failed: step exited with non-zero status: 1",
    "insertId": "e7a02558-e5e8-467f-ae7d-0cb4ac51fa48-685",
    "resource": {
      "type": "build",
      "labels": {
        "project_id": "brujula-cripto",
        "build_trigger_id": "",
        "build_id": "e7a02558-e5e8-467f-ae7d-0cb4ac51fa48"
      }
    },
    "timestamp": "2025-09-19T19:43:19.510114903Z",
    "severity": "INFO",
    "labels": {
      "build_tags": "fah,build-2025-09-19-018,backen-brujula-cripto,2dfc1b360782e08a28a8a74e48d218cf00892360,p-fah,r-nodejs,b-nodejs_20250914_RC00,bt-PACK",
      "build_step": "MAIN"
    },
    "logName": "projects/brujula-cripto/logs/cloudbuild",
    "receiveTimestamp": "2025-09-19T19:43:19.619599490Z"
  }
