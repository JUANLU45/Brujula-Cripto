2025-09-16 14:21:58.246
Step #2 - "pack": packages/app build: └ ƒ /[locale]/users                           3.89 kB         243 kB
2025-09-16 14:21:58.246
Step #2 - "pack": packages/app build: + First Load JS shared by all                  101 kB
2025-09-16 14:21:58.246
Step #2 - "pack": packages/app build:   ├ chunks/27877061-9ba3884dbaa7cfe6.js       54.2 kB
2025-09-16 14:21:58.251
Step #2 - "pack": packages/app build:   ├ chunks/7759-96501787d7b03936.js           45.3 kB
2025-09-16 14:21:58.251
Step #2 - "pack": packages/app build:   └ other shared chunks (total)               1.93 kB
2025-09-16 14:21:58.251
Step #2 - "pack": packages/app build: ƒ Middleware                                  45.2 kB
2025-09-16 14:21:58.251
Step #2 - "pack": packages/app build: ○  (Static)   prerendered as static content
2025-09-16 14:21:58.251
Step #2 - "pack": packages/app build: ƒ  (Dynamic)  server-rendered on demand
2025-09-16 14:21:58.351
Step #2 - "pack": packages/app build: Done
2025-09-16 14:21:58.377
Step #2 - "pack": node:fs:449
2025-09-16 14:21:58.377
Step #2 - "pack":     return binding.readFileUtf8(path, stringToFlags(options.flag));
2025-09-16 14:21:58.377
Step #2 - "pack":                    ^
2025-09-16 14:21:58.377
Step #2 - "pack": 
2025-09-16 14:21:58.377
Step #2 - "pack": Error: ENOENT: no such file or directory, open '/workspace/.next/standalone/.next/routes-manifest.json'
2025-09-16 14:21:58.377
Step #2 - "pack":     at readFileSync (node:fs:449:20)
2025-09-16 14:21:58.377
Step #2 - "pack":     at loadRouteManifest (file:///layers/google.nodejs.firebasenextjs/npm_modules/node_modules/@apphosting/adapter-nextjs/dist/utils.js:35:18)
2025-09-16 14:21:58.377
Step #2 - "pack":     at addRouteOverrides (file:///layers/google.nodejs.firebasenextjs/npm_modules/node_modules/@apphosting/adapter-nextjs/dist/overrides.js:145:27)
2025-09-16 14:21:58.377
Step #2 - "pack":     at file:///layers/google.nodejs.firebasenextjs/npm_modules/node_modules/@apphosting/adapter-nextjs/dist/bin/build.js:37:11
2025-09-16 14:21:58.377
Step #2 - "pack":     at process.processTicksAndRejections (node:internal/process/task_queues:95:5) {
2025-09-16 14:21:58.377
Step #2 - "pack":   errno: -2,
2025-09-16 14:21:58.377
Step #2 - "pack":   code: 'ENOENT',
2025-09-16 14:21:58.377
Step #2 - "pack":   syscall: 'open',
2025-09-16 14:21:58.377
Step #2 - "pack":   path: '/workspace/.next/standalone/.next/routes-manifest.json'
2025-09-16 14:21:58.377
Step #2 - "pack": }
2025-09-16 14:21:58.377
Step #2 - "pack": 
2025-09-16 14:21:58.377
Step #2 - "pack": Node.js v20.19.5
2025-09-16 14:21:58.397
Step #2 - "pack": Done "npm exec --prefix /layers/google.nodejs.firebasenextjs/npm_m..." (2m2.81493935s)
2025-09-16 14:21:58.410
Step #2 - "pack": --------------------------------------------------------------------------------
2025-09-16 14:21:58.410
Step #2 - "pack": failed to build: (error ID: 20f918c7):
2025-09-16 14:21:58.410
Step #2 - "pack": {"reason":"Failed Framework Build","code":"fah/failed-framework-build","userFacingMessage":"Your application failed to run the framework build command 'npm exec --prefix /layers/google.nodejs.firebasenextjs/npm_modules apphosting-adapter-nextjs-build' successfully. Please check the raw log to address the error and confirm that your application builds locally before redeploying.","rawLog":"(error ID: d0a693a9):
2025-09-16 14:21:58.410
Step #2 - "pack": > brujula-cripto@1.0.0 build
2025-09-16 14:21:58.410
Step #2 - "pack": > pnpm -r build
2025-09-16 14:21:58.410
Step #2 - "pack": 
2025-09-16 14:21:58.410
Step #2 - "pack": Scope: 3 of 4 workspace projects
2025-09-16 14:21:58.410
Step #2 - "pack": packages/types build$ tsc
2025-09-16 14:21:58.410
Step #2 - "pack": packages/types build: Done
2025-09-16 14:21:58.410
Step #2 - "pack": packages/app build$ next build
2025-09-16 14:21:58.410
Step #2 - "pack": packages/functions build$ tsc
2025-09-16 14:21:58.410
Step #2 - "pack": packages/app build:  ⚠ i18n configuration in next.config.js is unsupported in App Router.
2025-09-16 14:21:58.410
Step #2 - "pack": packages/app build: Learn more about internationalization in App Router: https://nextjs.org/docs/app/building-your-application/routing/internationalization
2025-09-16 14:21:58.410
Step #2 - "pack": packages/app build:    ▲ Next.js 15.5.3
2025-09-16 14:21:58.410
Step #2 - "pack": packages/app build:    Creating an optimized production build ...
2025-09-16 14:21:58.410
Step #2 - "pack": packages/functions build: Done
2025-09-16 14:21:58.410
Step #2 - "pack": packages/app build:  ✓ Compiled successfully in 41s
2025-09-16 14:21:58.410
Step #2 - "pack": packages/app build:    Linting and checking validity of types ...
2025-09-16 14:21:58.410
Step #2 - "pack": packages/app build:  ⨯ ESLint: Error while loading rule '@typescript-eslint/no-floating-promises': You have used a rule which requires type information, but don't have parserOptions set to generate type information for this file. See https://typescript-eslint.io/getting-started/typed-linting for enabling linting with type information. Parser: /workspace/node_modules/.pnpm/@typescript-eslint+parser@8.43.0_eslint@8.57.1_typescript@5.9.2/node_modules/@typescript-eslint/parser/dist/index.js Occurred while linting /workspace/packages/app/app/[locale]/(admin)/admin/page.tsx
2025-09-16 14:21:58.410
Step #2 - "pack": packages/app build:    Collecting page data ...
2025-09-16 14:21:58.410
Step #2 - "pack": packages/app build:    Generating static pages (0/7) ...
2025-09-16 14:21:58.410
Step #2 - "pack": packages/app build:    Generating static pages (1/7) 
2025-09-16 14:21:58.410
Step #2 - "pack": packages/app build:    Generating static pages (3/7) 
2025-09-16 14:21:58.410
Step #2 - "pack": packages/app build:    Generating static pages (5/7) 
2025-09-16 14:21:58.410
Step #2 - "pack": packages/app build:  ✓ Generating static pages (7/7)
2025-09-16 14:21:58.410
Step #2 - "pack": packages/app build:    Finalizing page optimization ...
2025-09-16 14:21:58.410
Step #2 - "pack": packages/app build:    Collecting build traces ...
2025-09-16 14:21:58.410
Step #2 - "pack": packages/app build: Route (app)                                      Size  First Load JS
2025-09-16 14:21:58.410
Step #2 - "pack": packages/app build: ┌ ○ /_not-found                                 996 B         102 kB
2025-09-16 14:21:58.410
Step #2 - "pack": packages/app build: ├ ƒ /[locale]                                    7 kB         255 kB
2025-09-16 14:21:58.410
Step #2 - "pack": packages/app build: ├ ƒ /[locale]/admin                           2.66 kB         246 kB
2025-09-16 14:21:58.410
Step #2 - "pack": packages/app build: ├ ƒ /[locale]/articles                        4.86 kB         248 kB
2025-09-16 14:21:58.410
Step #2 - "pack": packages/app build: ├ ƒ /[locale]/articles/[id]                    115 kB         355 kB
2025-09-16 14:21:58.410
Step #2 - "pack": packages/app build: ├ ƒ /[locale]/auth                             2.9 kB         242 kB
2025-09-16 14:21:58.410
Step #2 - "pack": packages/app build: ├ ƒ /[locale]/blog                            1.65 kB         140 kB
2025-09-16 14:21:58.410
Step #2 - "pack": packages/app build: ├ ƒ /[locale]/blog/[slug]                     3.11 kB         127 kB
2025-09-16 14:21:58.410
Step #2 - "pack": packages/app build: ├ ƒ /[locale]/chatbot                          9.2 kB         133 kB
2025-09-16 14:21:58.410
Step #2 - "pack": packages/app build: ├ ƒ /[locale]/comments                        3.44 kB         243 kB
2025-09-16 14:21:58.410
Step #2 - "pack": packages/app build: ├ ƒ /[locale]/contacto                          28 kB         152 kB
2025-09-16 14:21:58.410
Step #2 - "pack": packages/app build: ├ ƒ /[locale]/cuenta                          5.11 kB         245 kB
2025-09-16 14:21:58.410
Step #2 - "pack": packages/app build: ├ ƒ /[locale]/dashboard                       3.43 kB         246 kB
2025-09-16 14:21:58.410
Step #2 - "pack": packages/app build: ├ ƒ /[locale]/feedback                        3.61 kB         243 kB
2025-09-16 14:21:58.410
Step #2 - "pack": packages/app build: ├ ƒ /[locale]/herramientas/servicios          2.07 kB         126 kB
2025-09-16 14:21:58.410
Step #2 - "pack": packages/app build: ├ ƒ /[locale]/herramientas/tracker            3.17 kB         243 kB
2025-09-16 14:21:58.410
Step #2 - "pack": packages/app build: ├ ƒ /[locale]/homepage                        3.35 kB         248 kB
2025-09-16 14:21:58.410
Step #2 - "pack": packages/app build: ├ ƒ /[locale]/legal/aviso-legal                 174 B         105 kB
2025-09-16 14:21:58.410
Step #2 - "pack": packages/app build: ├ ƒ /[locale]/legal/descargo-responsabilidad    174 B         105 kB
2025-09-16 14:21:58.410
Step #2 - "pack": packages/app build: ├ ƒ /[locale]/legal/privacidad                  174 B         105 kB
2025-09-16 14:21:58.410
Step #2 - "pack": packages/app build: ├ ƒ /[locale]/legal/terminos                    174 B         105 kB
2025-09-16 14:21:58.410
Step #2 - "pack": packages/app build: ├ ƒ /[locale]/login                           3.24 kB         243 kB
2025-09-16 14:21:58.410
Step #2 - "pack": packages/app build: ├ ƒ /[locale]/recuperacion                    4.09 kB         133 kB
2025-09-16 14:21:58.410
Step #2 - "pack": packages/app build: ├ ƒ /[locale]/recuperacion/password           6.73 kB         246 kB
2025-09-16 14:21:58.410
Step #2 - "pack": packages/app build: ├ ƒ /[locale]/recuperar-password              2.29 kB         234 kB
2025-09-16 14:21:58.410
Step #2 - "pack": packages/app build: ├ ƒ /[locale]/registro                        3.05 kB         234 kB
2025-09-16 14:21:58.410
Step #2 - "pack": packages/app build: ├ ƒ /[locale]/seguridad                         996 B         139 kB
2025-09-16 14:21:58.410
Step #2 - "pack": packages/app build: ├ ƒ /[locale]/suscripcion                     4.19 kB         128 kB
2025-09-16 14:21:58.410
Step #2 - "pack": packages/app build: └ ƒ /[locale]/users                           3.89 kB         243 kB
2025-09-16 14:21:58.410
Step #2 - "pack": packages/app build: + First Load JS shared by all                  101 kB
2025-09-16 14:21:58.410
Step #2 - "pack": packages/app build:   ├ chunks/27877061-9ba3884dbaa7cfe6.js       54.2 kB
2025-09-16 14:21:58.410
Step #2 - "pack": packages/app build:   ├ chunks/7759-96501787d7b03936.js           45.3 kB
2025-09-16 14:21:58.410
Step #2 - "pack": packages/app build:   └ other shared chunks (total)               1.93 kB
2025-09-16 14:21:58.410
Step #2 - "pack": packages/app build: ƒ Middleware                                  45.2 kB
2025-09-16 14:21:58.410
Step #2 - "pack": packages/app build: ○  (Static)   prerendered as static content
2025-09-16 14:21:58.410
Step #2 - "pack": packages/app build: ƒ  (Dynamic)  server-rendered on demand
2025-09-16 14:21:58.410
Step #2 - "pack": packages/app build: Done
2025-09-16 14:21:58.410
Step #2 - "pack": node:fs:449
{
insertId: "daf3182f-02a2-44ea-89d5-65f53c49bd72-588"
labels: {2}
logName: "projects/brujula-cripto/logs/cloudbuild"
receiveTimestamp: "2025-09-16T12:21:58.867469622Z"
resource: {2}
severity: "INFO"
textPayload: "Step #2 - "pack": node:fs:449"
timestamp: "2025-09-16T12:21:58.410768578Z"
}
2025-09-16 14:21:58.410
Step #2 - "pack":     return binding.readFileUtf8(path, stringToFlags(options.flag));
2025-09-16 14:21:58.410
Step #2 - "pack":                    ^
2025-09-16 14:21:58.410
Step #2 - "pack": 
2025-09-16 14:21:58.410
Step #2 - "pack": Error: ENOENT: no such file or directory, open '/workspace/.next/standalone/.next/routes-manifest.json'

{
insertId: "daf3182f-02a2-44ea-89d5-65f53c49bd72-592"
labels: {2}
logName: "projects/brujula-cripto/logs/cloudbuild"
receiveTimestamp: "2025-09-16T12:21:58.867469622Z"
resource: {2}
severity: "INFO"
textPayload: "Step #2 - "pack": Error: ENOENT: no such file or directory, open '/workspace/.next/standalone/.next/routes-manifest.json'"
timestamp: "2025-09-16T12:21:58.410771605Z"
}
2025-09-16 14:21:58.410
Step #2 - "pack":     at readFileSync (node:fs:449:20)
2025-09-16 14:21:58.410
Step #2 - "pack":     at loadRouteManifest (file:///layers/google.nodejs.firebasenextjs/npm_modules/node_modules/@apphosting/adapter-nextjs/dist/utils.js:35:18)
2025-09-16 14:21:58.410
Step #2 - "pack":     at addRouteOverrides (file:///layers/google.nodejs.firebasenextjs/npm_modules/node_modules/@apphosting/adapter-nextjs/dist/overrides.js:145:27)
2025-09-16 14:21:58.410
Step #2 - "pack":     at file:///layers/google.nodejs.firebasenextjs/npm_modules/node_modules/@apphosting/adapter-nextjs/dist/bin/build.js:37:11
2025-09-16 14:21:58.410
Step #2 - "pack":     at process.processTicksAndRejections (node:internal/process/task_queues:95:5) {
2025-09-16 14:21:58.410
Step #2 - "pack":   errno: -2,

{
insertId: "daf3182f-02a2-44ea-89d5-65f53c49bd72-598"
labels: {2}
logName: "projects/brujula-cripto/logs/cloudbuild"
receiveTimestamp: "2025-09-16T12:21:58.867469622Z"
resource: {2}
severity: "INFO"
textPayload: "Step #2 - "pack":   errno: -2,"
timestamp: "2025-09-16T12:21:58.410777347Z"
}
2025-09-16 14:21:58.410
Step #2 - "pack":   code: 'ENOENT',
2025-09-16 14:21:58.410
Step #2 - "pack":   syscall: 'open',
2025-09-16 14:21:58.410
Step #2 - "pack":   path: '/workspace/.next/standalone/.next/routes-manifest.json'
2025-09-16 14:21:58.410
Step #2 - "pack": }
2025-09-16 14:21:58.410
Step #2 - "pack": 
2025-09-16 14:21:58.410
Step #2 - "pack": Node.js v20.19.5"}
2025-09-16 14:21:58.413
Step #2 - "pack": ERROR: failed to build: exit status 1

{
insertId: "daf3182f-02a2-44ea-89d5-65f53c49bd72-605"
labels: {2}
logName: "projects/brujula-cripto/logs/cloudbuild"
receiveTimestamp: "2025-09-16T12:21:58.867469622Z"
resource: {2}
severity: "INFO"
textPayload: "Step #2 - "pack": ERROR: failed to build: exit status 1"
timestamp: "2025-09-16T12:21:58.413490847Z"
}
2025-09-16 14:22:00.801
Step #2 - "pack": ERROR: failed to build: executing lifecycle: failed with status code: 51
{
insertId: "daf3182f-02a2-44ea-89d5-65f53c49bd72-606"
labels: {2}
logName: "projects/brujula-cripto/logs/cloudbuild"
receiveTimestamp: "2025-09-16T12:22:00.836087987Z"
resource: {2}
severity: "INFO"
textPayload: "Step #2 - "pack": ERROR: failed to build: executing lifecycle: failed with status code: 51"
timestamp: "2025-09-16T12:22:00.801089852Z"
}
2025-09-16 14:22:01.160
Finished Step #2 - "pack"
{
insertId: "daf3182f-02a2-44ea-89d5-65f53c49bd72-607"
labels: {2}
logName: "projects/brujula-cripto/logs/cloudbuild"
receiveTimestamp: "2025-09-16T12:22:01.328774767Z"
resource: {2}
severity: "INFO"
textPayload: "Finished Step #2 - "pack""
timestamp: "2025-09-16T12:22:01.160673763Z"
}
2025-09-16 14:22:01.160
ERROR
{
insertId: "daf3182f-02a2-44ea-89d5-65f53c49bd72-608"
labels: {2}
logName: "projects/brujula-cripto/logs/cloudbuild"
receiveTimestamp: "2025-09-16T12:22:01.328774767Z"
resource: {2}
severity: "INFO"
textPayload: "ERROR"
timestamp: "2025-09-16T12:22:01.160816081Z"
}
2025-09-16 14:22:01.160
ERROR: build step 2 "gcr.io/k8s-skaffold/pack" failed: step exited with non-zero status: 1

{
insertId: "daf3182f-02a2-44ea-89d5-65f53c49bd72-609"
labels: {2}
logName: "projects/brujula-cripto/logs/cloudbuild"
receiveTimestamp: "2025-09-16T12:22:01.328774767Z"
resource: {2}
severity: "INFO"
textPayload: "ERROR: build step 2 "gcr.io/k8s-skaffold/pack" failed: step exited with non-zero status: 1"
timestamp: "2025-09-16T12:22:01.160834465Z"
}
Se muestran los registros del período especificado en la 