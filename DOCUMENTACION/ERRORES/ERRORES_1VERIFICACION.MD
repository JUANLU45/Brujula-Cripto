----------------------✅EJEMPLOS✅-----------------------
const usageData = doc.data(); 
const firstTwoHoursUsed = usageData.firstTwoHoursUsed || 0; // 🚨 PELIGRO: Si 'firstTwoHoursUsed' no existe, esto no falla aquí, sino más tarde.

// SOLUCIÓN ROBUSTA:
// 1. Define la estructura de tus datos en `packages/types/src/index.ts`
export interface UsageData {
  firstTwoHoursUsed: number;
  firstTwoHoursCost: number;
  // ... y el resto de campos
}

// 2. Usa ese tipo en tu código para que TypeScript te proteja
import { UsageData } from '@brujula-cripto/types';

const usageData = doc.data() as UsageData; // Ahora TypeScript sabe qué forma tiene
const firstTwoHoursUsed = usageData.firstTwoHoursUsed || 0; // ✅ SEGURO: Si te equivocas en el nombre, el editor te avisará.
 Aserciones de no nulo (no-non-null-assertion)
¿Qué es? Usar el signo de exclamación (!) para decirle a TypeScript "confía en mí, esto no es nulo".

¿Por qué es malo? Si te equivocas, tu aplicación se romperá. Es una apuesta arriesgada.

Solución (en cache.ts): En lugar de afirmar, comprueba.

TypeScript

// ERROR (Línea 11 en cache.ts)
const redisUrl = process.env.UPSTASH_REDIS_REST_URL!;

// SOLUCIÓN ROBUSTA
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
if (!redisUrl) {
  throw new Error('La variable de entorno UPSTASH_REDIS_REST_URL no está definida.');

----✅QUIERO SOLUCIONES ROBUSTAS Y COMPATIBLES EN TODOS LOS ERRORES O TENDRAS QUE VOLVER A HACER TODOS DE NUEVO--------
--------ES OBLIGATORIO CORREGIR DE UNO EN UNO✅----
---------------ERRORES-------------------------------

--------------------ESLint Report--------------------



C:\BRUJULA CRIPTO\packages\app\app\[locale]\layout.tsx
  18:1   error  `react` type import should occur before import of `next/navigation`          import/order
  20:16  error  Missing return type on function                                              @typescript-eslint/explicit-function-return-type
  20:16  error  Missing return type on function                                              @typescript-eslint/explicit-module-boundary-types
  31:33  error  Unsafe argument of type `any` assigned to a parameter of type `"es" | "en"`  @typescript-eslint/no-unsafe-argument
  31:43  error  Unexpected any. Specify a different type                                     @typescript-eslint/no-explicit-any

C:\BRUJULA CRIPTO\packages\app\app\[locale]\not-found.tsx
  10:16  error  Missing return type on function  @typescript-eslint/explicit-function-return-type
  10:16  error  Missing return type on function  @typescript-eslint/explicit-module-boundary-types

C:\BRUJULA CRIPTO\packages\app\components\features\admin\AdminLoginForm.tsx
   21:8   error  Missing return type on function                                                    @typescript-eslint/explicit-function-return-type
   21:8   error  Missing return type on function                                                    @typescript-eslint/explicit-module-boundary-types
   31:70  error  Missing return type on function                                                    @typescript-eslint/explicit-function-return-type
   40:51  error  Missing return type on function                                                    @typescript-eslint/explicit-function-return-type
   72:28  error  Unexpected any. Specify a different type                                           @typescript-eslint/no-explicit-any
   72:33  error  Unsafe member access .code on an `any` value                                       @typescript-eslint/no-unsafe-member-access
   73:27  error  Unexpected any. Specify a different type                                           @typescript-eslint/no-explicit-any
   73:32  error  Unsafe member access .code on an `any` value                                       @typescript-eslint/no-unsafe-member-access
  109:51  error  Promise-returning function provided to attribute where a void return was expected  @typescript-eslint/no-misused-promises

C:\BRUJULA CRIPTO\packages\app\components\features\admin\ArticleDataTable.tsx
   30:8   error    Missing return type on function                                                                                                                                     @typescript-eslint/explicit-function-return-type
   30:8   warning  Function 'ArticleDataTable' has a complexity of 14. Maximum allowed is 10                                                                                           complexity
   30:8   error    Missing return type on function                                                                                                                                     @typescript-eslint/explicit-module-boundary-types
   37:9   error    'router' is assigned a value but never used. Allowed unused vars must match /^_/u                                                                                   @typescript-eslint/no-unused-vars
   53:35  error    Missing return type on function                                                                                                                                     @typescript-eslint/explicit-function-return-type
   73:15  error    Unsafe assignment of an `any` value                                                                                                                                 @typescript-eslint/no-unsafe-assignment
   74:21  error    Unsafe argument of type `any` assigned to a parameter of type `SetStateAction<IArticle[]>`                                                                          @typescript-eslint/no-unsafe-argument
   74:26  error    Unsafe member access .articles on an `any` value                                                                                                                    @typescript-eslint/no-unsafe-member-access
   82:5   error    Promises must be awaited, end with a call to .catch, end with a call to .then with a rejection handler or be explicitly marked as ignored with the `void` operator  @typescript-eslint/no-floating-promises
   83:6   warning  React Hook useEffect has a missing dependency: 'getAuthToken'. Either include it or remove the dependency array                                                     react-hooks/exhaustive-deps
  109:51  error    Forbidden non-null assertion                                                                                                                                        @typescript-eslint/no-non-null-assertion
  120:33  error    Missing return type on function                                                                                                                                     @typescript-eslint/explicit-function-return-type
  126:12  error    Redundant use of `await` on a return value                                                                                                                          no-return-await
  129:73  error    Missing return type on function                                                                                                                                     @typescript-eslint/explicit-function-return-type
  133:30  error    Missing return type on function                                                                                                                                     @typescript-eslint/explicit-function-return-type
  141:46  error    Missing return type on function                                                                                                                                     @typescript-eslint/explicit-function-return-type
  151:41  error    Missing return type on function                                                                                                                                     @typescript-eslint/explicit-function-return-type
  182:85  error    Missing return type on function                                                                                                                                     @typescript-eslint/explicit-function-return-type
  209:35  error    Missing return type on function                                                                                                                                     @typescript-eslint/explicit-function-return-type
  247:23  error    Promise-returning function provided to attribute where a void return was expected                                                                                   @typescript-eslint/no-misused-promises
  353:1   warning  File has too many lines (496). Maximum allowed is 300                                                                                                               max-lines
  380:32  error    Promise-returning function provided to attribute where a void return was expected                                                                                   @typescript-eslint/no-misused-promises

C:\BRUJULA CRIPTO\packages\app\components\features\admin\ArticleEditor.tsx
   51:8   error    Missing return type on function                                                                                                                                                                                                                                                          @typescript-eslint/explicit-function-return-type
   51:8   warning  Function 'ArticleEditor' has a complexity of 16. Maximum allowed is 10                                                                                                                                                                                                                   complexity
   51:8   error    Missing return type on function                                                                                                                                                                                                                                                          @typescript-eslint/explicit-module-boundary-types
  135:34  error    Missing return type on function                                                                                                                                                                                                                                                          @typescript-eslint/explicit-function-return-type
  155:15  error    Unsafe assignment of an `any` value                                                                                                                                                                                                                                                      @typescript-eslint/no-unsafe-assignment
  178:5   error    Promises must be awaited, end with a call to .catch, end with a call to .then with a rejection handler or be explicitly marked as ignored with the `void` operator                                                                                                                       @typescript-eslint/no-floating-promises
  179:6   warning  React Hook useEffect has a missing dependency: 'getAuthToken'. Either include it or remove the dependency array                                                                                                                                                                          react-hooks/exhaustive-deps
  181:33  error    Missing return type on function                                                                                                                                                                                                                                                          @typescript-eslint/explicit-function-return-type
  186:12  error    Redundant use of `await` on a return value                                                                                                                                                                                                                                               no-return-await
  199:67  error    Unexpected any. Specify a different type                                                                                                                                                                                                                                                 @typescript-eslint/no-explicit-any
  199:72  error    Missing return type on function                                                                                                                                                                                                                                                          @typescript-eslint/explicit-function-return-type
  200:39  error    Unsafe assignment of an `any` value                                                                                                                                                                                                                                                      @typescript-eslint/no-unsafe-assignment
  203:36  error    Missing return type on function                                                                                                                                                                                                                                                          @typescript-eslint/explicit-function-return-type
  219:27  error    Missing return type on function                                                                                                                                                                                                                                                          @typescript-eslint/explicit-function-return-type
  227:49  error    Missing return type on function                                                                                                                                                                                                                                                          @typescript-eslint/explicit-function-return-type
  234:48  error    Missing return type on function                                                                                                                                                                                                                                                          @typescript-eslint/explicit-function-return-type
  255:13  error    Unsafe assignment of an `any` value                                                                                                                                                                                                                                                      @typescript-eslint/no-unsafe-assignment
  285:15  error    Unsafe assignment of an `any` value                                                                                                                                                                                                                                                      @typescript-eslint/no-unsafe-assignment
  289:51  error    Unsafe assignment of an `any` value                                                                                                                                                                                                                                                      @typescript-eslint/no-unsafe-assignment
  296:5   warning  React Hook useCallback has a missing dependency: 'getAuthToken'. Either include it or remove the dependency array                                                                                                                                                                        react-hooks/exhaustive-deps
  299:96  error    Missing return type on function                                                                                                                                                                                                                                                          @typescript-eslint/explicit-function-return-type
  326:13  error    Unsafe assignment of an `any` value                                                                                                                                                                                                                                                      @typescript-eslint/no-unsafe-assignment
  330:37  error    Unsafe argument of type `any` assigned to a parameter of type `Content | Fragment | Node`                                                                                                                                                                                                @typescript-eslint/no-unsafe-argument
  332:41  error    Unsafe argument of type `any` assigned to a parameter of type `string`                                                                                                                                                                                                                   @typescript-eslint/no-unsafe-argument
  341:22  warning  Async arrow function has a complexity of 13. Maximum allowed is 10                                                                                                                                                                                                                       complexity
  341:49  error    Missing return type on function                                                                                                                                                                                                                                                          @typescript-eslint/explicit-function-return-type
  354:1   warning  File has too many lines (689). Maximum allowed is 300                                                                                                                                                                                                                                    max-lines
  378:13  error    Unsafe assignment of an `any` value                                                                                                                                                                                                                                                      @typescript-eslint/no-unsafe-assignment
  385:20  error    Unsafe member access .slug on an `any` value                                                                                                                                                                                                                                             @typescript-eslint/no-unsafe-member-access
  386:52  error    Unsafe member access .slug on an `any` value                                                                                                                                                                                                                                             @typescript-eslint/no-unsafe-member-access
  422:21  error    Promise-returning function provided to attribute where a void return was expected                                                                                                                                                                                                        @typescript-eslint/no-misused-promises
  430:21  error    Promise-returning function provided to attribute where a void return was expected                                                                                                                                                                                                        @typescript-eslint/no-misused-promises
  485:29  error    Promise-returning function provided to attribute where a void return was expected                                                                                                                                                                                                        @typescript-eslint/no-misused-promises
  502:31  error    Promise-returning function provided to attribute where a void return was expected                                                                                                                                                                                                        @typescript-eslint/no-misused-promises
  514:27  error    Promises must be awaited, end with a call to .catch, end with a call to .then with a rejection handler or be explicitly marked as ignored with the `void` operator                                                                                                                       @typescript-eslint/no-floating-promises
  585:29  error    Promise-returning function provided to attribute where a void return was expected                                                                                                                                                                                                        @typescript-eslint/no-misused-promises
  688:17  warning  Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
  704:23  error    Promises must be awaited, end with a call to .catch, end with a call to .then with a rejection handler or be explicitly marked as ignored with the `void` operator                                                                                                                       @typescript-eslint/no-floating-promises

C:\BRUJULA CRIPTO\packages\app\components\features\auth\PasswordResetForm.tsx
  27:21  error  Unexpected any. Specify a different type                                                @typescript-eslint/no-explicit-any
  28:16  error  Unsafe argument of type `any` assigned to a parameter of type `SetStateAction<string>`  @typescript-eslint/no-unsafe-argument
  28:22  error  Unsafe member access .message on an `any` value                                         @typescript-eslint/no-unsafe-member-access
  73:22  error  Promise-returning function provided to attribute where a void return was expected       @typescript-eslint/no-misused-promises

C:\BRUJULA CRIPTO\packages\app\components\features\auth\SignInForm.tsx
   31:21  error  Unexpected any. Specify a different type                                                @typescript-eslint/no-explicit-any
   32:16  error  Unsafe argument of type `any` assigned to a parameter of type `SetStateAction<string>`  @typescript-eslint/no-unsafe-argument
   32:22  error  Unsafe member access .message on an `any` value                                         @typescript-eslint/no-unsafe-member-access
   45:21  error  Unexpected any. Specify a different type                                                @typescript-eslint/no-explicit-any
   46:16  error  Unsafe argument of type `any` assigned to a parameter of type `SetStateAction<string>`  @typescript-eslint/no-unsafe-argument
   46:22  error  Unsafe member access .message on an `any` value                                         @typescript-eslint/no-unsafe-member-access
   54:22  error  Promise-returning function provided to attribute where a void return was expected       @typescript-eslint/no-misused-promises
  109:19  error  Promise-returning function provided to attribute where a void return was expected       @typescript-eslint/no-misused-promises

C:\BRUJULA CRIPTO\packages\app\components\features\auth\SignUpForm.tsx
   43:21  error  Unexpected any. Specify a different type                                                @typescript-eslint/no-explicit-any
   44:16  error  Unsafe argument of type `any` assigned to a parameter of type `SetStateAction<string>`  @typescript-eslint/no-unsafe-argument
   44:22  error  Unsafe member access .message on an `any` value                                         @typescript-eslint/no-unsafe-member-access
   63:21  error  Unexpected any. Specify a different type                                                @typescript-eslint/no-explicit-any
   64:16  error  Unsafe argument of type `any` assigned to a parameter of type `SetStateAction<string>`  @typescript-eslint/no-unsafe-argument
   64:22  error  Unsafe member access .message on an `any` value                                         @typescript-eslint/no-unsafe-member-access
   72:22  error  Promise-returning function provided to attribute where a void return was expected       @typescript-eslint/no-misused-promises
  180:19  error  Promise-returning function provided to attribute where a void return was expected       @typescript-eslint/no-misused-promises

C:\BRUJULA CRIPTO\packages\app\components\features\blog\ArticleCard.tsx
   27:8   warning  Function 'ArticleCard' has a complexity of 27. Maximum allowed is 10                  complexity
   43:10  error    'isSharing' is assigned a value but never used. Allowed unused vars must match /^_/u  @typescript-eslint/no-unused-vars
  194:27  error    Promise-returning function provided to attribute where a void return was expected     @typescript-eslint/no-misused-promises
  229:25  error    Promise-returning function provided to attribute where a void return was expected     @typescript-eslint/no-misused-promises
  246:25  error    Promise-returning function provided to attribute where a void return was expected     @typescript-eslint/no-misused-promises

C:\BRUJULA CRIPTO\packages\app\components\features\blog\ArticleList.tsx
  36:8  warning  Function 'ArticleList' has a complexity of 24. Maximum allowed is 10                                                                                                             complexity
  59:9  warning  The 'filters' object makes the dependencies of useEffect Hook (at line 153) change on every render. To fix this, wrap the initialization of 'filters' in its own useMemo() Hook  react-hooks/exhaustive-deps

C:\BRUJULA CRIPTO\packages\app\components\features\blog\ArticlePage.tsx
   61:8   warning  Function 'ArticlePage' has a complexity of 14. Maximum allowed is 10                                                                                                                                                                                                                     complexity
  184:21  warning  Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element

C:\BRUJULA CRIPTO\packages\app\components\features\blog\BlogPage.tsx
  49:27  error  Missing return type on function                                                                                             @typescript-eslint/explicit-function-return-type
  89:17  error  Emojis should be wrapped in <span>, have role="img", and have an accessible description with aria-label or aria-labelledby  jsx-a11y/accessible-emoji

C:\BRUJULA CRIPTO\packages\app\components\features\blog\BlogSearchBar.tsx
  37:26  error  Missing return type on function  @typescript-eslint/explicit-function-return-type

C:\BRUJULA CRIPTO\packages\app\components\features\blog\PaginationControls.tsx
  21:8  warning  Function 'PaginationControls' has a complexity of 29. Maximum allowed is 10  complexity

C:\BRUJULA CRIPTO\packages\app\components\features\chatbot\ChatbotLayout.tsx
   67:8   warning  Function 'ChatbotLayout' has a complexity of 25. Maximum allowed is 10                                                                                                                             complexity
  144:6   warning  React Hook useEffect has a missing dependency: 'loadConversations'. Either include it or remove the dependency array                                                                               react-hooks/exhaustive-deps
  182:5   warning  Async arrow function has a complexity of 12. Maximum allowed is 10                                                                                                                                 complexity
  262:5   warning  React Hook useCallback has an unnecessary dependency: 'conversationsData'. Either exclude it or remove the dependency array                                                                        react-hooks/exhaustive-deps
  360:1   warning  File has too many lines (479). Maximum allowed is 300                                                                                                                                              max-lines
  381:23  warning  Arrow function has a complexity of 12. Maximum allowed is 10                                                                                                                                       complexity
  381:26  error    Missing return type on function                                                                                                                                                                    @typescript-eslint/explicit-function-return-type
  430:9   error    Visible, non-interactive elements with click handlers must have at least one keyboard listener                                                                                                     jsx-a11y/click-events-have-key-events
  430:9   error    Avoid non-native interactive elements. If using native HTML is not possible, add an appropriate role and support for tabbing, mouse, keyboard, and touch inputs to an interactive content element  jsx-a11y/no-static-element-interactions

C:\BRUJULA CRIPTO\packages\app\components\features\chatbot\ChatbotUI.tsx
   74:8  warning  Function 'ChatbotUI' has a complexity of 33. Maximum allowed is 10                        complexity
   76:3  error    'conversations' is assigned a value but never used. Allowed unused args must match /^_/u  @typescript-eslint/no-unused-vars
  339:1  warning  File has too many lines (367). Maximum allowed is 300                                     max-lines

C:\BRUJULA CRIPTO\packages\app\components\features\chatbot\ConversationList.tsx
  137:68  error    Missing return type on function                                                                                             @typescript-eslint/explicit-function-return-type
  148:49  error    Missing return type on function                                                                                             @typescript-eslint/explicit-function-return-type
  159:61  error    Missing return type on function                                                                                             @typescript-eslint/explicit-function-return-type
  166:29  error    Missing return type on function                                                                                             @typescript-eslint/explicit-function-return-type
  174:31  error    Missing return type on function                                                                                             @typescript-eslint/explicit-function-return-type
  209:17  error    Emojis should be wrapped in <span>, have role="img", and have an accessible description with aria-label or aria-labelledby  jsx-a11y/accessible-emoji
  241:19  error    Emojis should be wrapped in <span>, have role="img", and have an accessible description with aria-label or aria-labelledby  jsx-a11y/accessible-emoji
  301:6   error    Unexpected any. Specify a different type                                                                                    @typescript-eslint/no-explicit-any
  304:1   error    Missing return type on function                                                                                             @typescript-eslint/explicit-function-return-type
  304:1   warning  Function 'ConversationCard' has a complexity of 13. Maximum allowed is 10                                                   complexity
  337:1   warning  File has too many lines (417). Maximum allowed is 300                                                                       max-lines
  347:28  error    Unsafe assignment of an `any` value                                                                                         @typescript-eslint/no-unsafe-assignment
  347:28  error    Unsafe call of a(n) `any` typed value                                                                                       @typescript-eslint/no-unsafe-call
  348:22  error    Unsafe assignment of an `any` value                                                                                         @typescript-eslint/no-unsafe-assignment
  348:22  error    Unsafe call of a(n) `any` typed value                                                                                       @typescript-eslint/no-unsafe-call
  349:15  warning  The autoFocus prop should not be used, as it can reduce usability and accessibility for users                               jsx-a11y/no-autofocus
  372:41  error    Unsafe call of a(n) `any` typed value                                                                                       @typescript-eslint/no-unsafe-call
  416:24  error    Unsafe assignment of an `any` value                                                                                         @typescript-eslint/no-unsafe-assignment
  416:50  error    Unsafe call of a(n) `any` typed value                                                                                       @typescript-eslint/no-unsafe-call
  416:75  error    Unsafe call of a(n) `any` typed value                                                                                       @typescript-eslint/no-unsafe-call
  431:22  error    Unsafe assignment of an `any` value                                                                                         @typescript-eslint/no-unsafe-assignment
  431:22  error    Unsafe call of a(n) `any` typed value                                                                                       @typescript-eslint/no-unsafe-call
  449:22  error    Unsafe assignment of an `any` value                                                                                         @typescript-eslint/no-unsafe-assignment
  449:58  error    Unsafe call of a(n) `any` typed value                                                                                       @typescript-eslint/no-unsafe-call
  449:79  error    Unsafe call of a(n) `any` typed value                                                                                       @typescript-eslint/no-unsafe-call

C:\BRUJULA CRIPTO\packages\app\components\features\contact\ContactFAQ.tsx
   10:65  error  Missing return type on function  @typescript-eslint/explicit-function-return-type
   22:63  error  Missing return type on function  @typescript-eslint/explicit-function-return-type
   45:8   error  Missing return type on function  @typescript-eslint/explicit-function-return-type
   45:8   error  Missing return type on function  @typescript-eslint/explicit-module-boundary-types
  148:39  error  Missing return type on function  @typescript-eslint/explicit-function-return-type

C:\BRUJULA CRIPTO\packages\app\components\features\contact\ContactForm.tsx
  28:8   error    Missing return type on function                                                    @typescript-eslint/explicit-function-return-type
  28:8   warning  Function 'ContactForm' has a complexity of 11. Maximum allowed is 10               complexity
  28:8   error    Missing return type on function                                                    @typescript-eslint/explicit-module-boundary-types
  45:50  error    Missing return type on function                                                    @typescript-eslint/explicit-function-return-type
  95:22  error    Promise-returning function provided to attribute where a void return was expected  @typescript-eslint/no-misused-promises

C:\BRUJULA CRIPTO\packages\app\components\features\dashboard\UserDashboard.tsx
   14:59  error    Missing return type on function                                                    @typescript-eslint/explicit-function-return-type
   30:64  error    Missing return type on function                                                    @typescript-eslint/explicit-function-return-type
   46:58  error    Missing return type on function                                                    @typescript-eslint/explicit-function-return-type
   77:8   error    Missing return type on function                                                    @typescript-eslint/explicit-function-return-type
   77:8   warning  Function 'UserDashboard' has a complexity of 13. Maximum allowed is 10             complexity
   77:8   error    Missing return type on function                                                    @typescript-eslint/explicit-module-boundary-types
  241:33  error    Promise-returning function provided to attribute where a void return was expected  @typescript-eslint/no-misused-promises
  250:33  error    Promise-returning function provided to attribute where a void return was expected  @typescript-eslint/no-misused-promises
  349:1   warning  File has too many lines (328). Maximum allowed is 300                              max-lines
  352:31  error    Promise-returning function provided to attribute where a void return was expected  @typescript-eslint/no-misused-promises

C:\BRUJULA CRIPTO\packages\app\components\features\error\NotFoundPage.tsx
   11:58  error  Missing return type on function                                                     @typescript-eslint/explicit-function-return-type
   22:60  error  Missing return type on function                                                     @typescript-eslint/explicit-function-return-type
   34:69  error  Missing return type on function                                                     @typescript-eslint/explicit-function-return-type
   99:8   error  Missing return type on function                                                     @typescript-eslint/explicit-function-return-type
   99:8   error  Missing return type on function                                                     @typescript-eslint/explicit-module-boundary-types
  101:9   error  'tCommon' is assigned a value but never used. Allowed unused vars must match /^_/u  @typescript-eslint/no-unused-vars
  104:27  error  Missing return type on function                                                     @typescript-eslint/explicit-function-return-type
  108:29  error  Missing return type on function                                                     @typescript-eslint/explicit-function-return-type
  112:30  error  Missing return type on function                                                     @typescript-eslint/explicit-function-return-type

C:\BRUJULA CRIPTO\packages\app\components\features\homepage\FeaturedPostsCarousel.tsx
  16:8   error  Missing return type on function  @typescript-eslint/explicit-function-return-type
  16:8   error  Missing return type on function  @typescript-eslint/explicit-module-boundary-types
  32:29  error  Missing return type on function  @typescript-eslint/explicit-function-return-type
  44:15  error  Missing return type on function  @typescript-eslint/explicit-function-return-type
  47:24  error  Missing return type on function  @typescript-eslint/explicit-function-return-type
  55:24  error  Missing return type on function  @typescript-eslint/explicit-function-return-type

C:\BRUJULA CRIPTO\packages\app\components\features\homepage\FeedbackButton.tsx
   17:8   error    Missing return type on function                                                                                                                                                                                                                                                          @typescript-eslint/explicit-function-return-type
   17:8   warning  Function 'FeedbackButton' has a complexity of 12. Maximum allowed is 10                                                                                                                                                                                                                  complexity
   17:8   error    Missing return type on function                                                                                                                                                                                                                                                          @typescript-eslint/explicit-module-boundary-types
   33:41  error    Missing return type on function                                                                                                                                                                                                                                                          @typescript-eslint/explicit-function-return-type
   64:14  error    'error' is defined but never used                                                                                                                                                                                                                                                        @typescript-eslint/no-unused-vars
   71:32  error    Missing return type on function                                                                                                                                                                                                                                                          @typescript-eslint/explicit-function-return-type
   96:17  warning  Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
  193:25  error    Promise-returning function provided to attribute where a void return was expected                                                                                                                                                                                                        @typescript-eslint/no-misused-promises

C:\BRUJULA CRIPTO\packages\app\components\features\payments\CompetitorComparison.tsx
  322:1  warning  File has too many lines (452). Maximum allowed is 300  max-lines

C:\BRUJULA CRIPTO\packages\app\components\features\payments\PricingTier.tsx
   26:8   error  Missing return type on function                                                      @typescript-eslint/explicit-function-return-type
   26:8   error  Missing return type on function                                                      @typescript-eslint/explicit-module-boundary-types
   32:17  error  'userData' is assigned a value but never used. Allowed unused vars must match /^_/u  @typescript-eslint/no-unused-vars
  114:51  error  Missing return type on function                                                      @typescript-eslint/explicit-function-return-type
  222:25  error  Promise-returning function provided to attribute where a void return was expected    @typescript-eslint/no-misused-promises

C:\BRUJULA CRIPTO\packages\app\components\features\payments\UpgradeButton.tsx
   22:8   error    Missing return type on function                                                    @typescript-eslint/explicit-function-return-type
   22:8   warning  Function 'UpgradeButton' has a complexity of 11. Maximum allowed is 10             complexity
   22:8   error    Missing return type on function                                                    @typescript-eslint/explicit-module-boundary-types
   39:34  error    Missing return type on function                                                    @typescript-eslint/explicit-function-return-type
   75:29  error    Missing return type on function                                                    @typescript-eslint/explicit-function-return-type
   86:32  error    Missing return type on function                                                    @typescript-eslint/explicit-function-return-type
   97:28  error    Missing return type on function                                                    @typescript-eslint/explicit-function-return-type
  157:17  error    Promise-returning function provided to attribute where a void return was expected  @typescript-eslint/no-misused-promises

C:\BRUJULA CRIPTO\packages\app\components\features\pricing\PricingPage.tsx
  132:14  error  'error' is defined but never used  @typescript-eslint/no-unused-vars

C:\BRUJULA CRIPTO\packages\app\components\features\pricing\UpgradeButton.tsx
   55:34  warning  Async arrow function has a complexity of 14. Maximum allowed is 10                                                                                                                                 complexity
  149:9   error    Visible, non-interactive elements with click handlers must have at least one keyboard listener                                                                                                     jsx-a11y/click-events-have-key-events
  149:9   error    Avoid non-native interactive elements. If using native HTML is not possible, add an appropriate role and support for tabbing, mouse, keyboard, and touch inputs to an interactive content element  jsx-a11y/no-static-element-interactions
  255:25  error    Promise-returning function provided to attribute where a void return was expected                                                                                                                  @typescript-eslint/no-misused-promises

C:\BRUJULA CRIPTO\packages\app\components\features\recovery\RecoveryWizard.tsx
  213:21  error  Emojis should be wrapped in <span>, have role="img", and have an accessible description with aria-label or aria-labelledby  jsx-a11y/accessible-emoji

C:\BRUJULA CRIPTO\packages\app\components\features\recovery\WasmPasswordEngine.tsx
   27:1   warning  Function 'WasmPasswordEngine' has a complexity of 12. Maximum allowed is 10  complexity
  198:14  error    '_error' is defined but never used                                           @typescript-eslint/no-unused-vars
  341:1   warning  File has too many lines (484). Maximum allowed is 300                        max-lines

C:\BRUJULA CRIPTO\packages\app\components\features\tools\ServiceDirectory.tsx
  149:27  warning  Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element

C:\BRUJULA CRIPTO\packages\app\components\features\tools\TransactionTracker.tsx
   96:17  error  Unsafe assignment of an `any` value                   @typescript-eslint/no-unsafe-assignment
   97:11  error  Unsafe return of a value of type `any[]`              @typescript-eslint/no-unsafe-return
  104:17  error  Unsafe assignment of an `any` value                   @typescript-eslint/no-unsafe-assignment
  105:11  error  Unsafe return of a value of type `any`                @typescript-eslint/no-unsafe-return
  105:30  error  Unsafe member access .transactions on an `any` value  @typescript-eslint/no-unsafe-member-access

C:\BRUJULA CRIPTO\packages\app\components\layout\Footer.tsx
  329:1  warning  File has too many lines (325). Maximum allowed is 300  max-lines

C:\BRUJULA CRIPTO\packages\app\components\layout\Navbar.tsx
  332:1  warning  File has too many lines (330). Maximum allowed is 300  max-lines

C:\BRUJULA CRIPTO\packages\app\lib\api.ts
   60:12  error  Redundant use of `await` on a return value  no-return-await
   64:12  error  Redundant use of `await` on a return value  no-return-await
   68:12  error  Redundant use of `await` on a return value  no-return-await
   74:12  error  Redundant use of `await` on a return value  no-return-await
   81:12  error  Redundant use of `await` on a return value  no-return-await
   88:12  error  Redundant use of `await` on a return value  no-return-await
   96:12  error  Redundant use of `await` on a return value  no-return-await
  100:12  error  Redundant use of `await` on a return value  no-return-await
  108:12  error  Redundant use of `await` on a return value  no-return-await
  116:12  error  Redundant use of `await` on a return value  no-return-await
  123:12  error  Redundant use of `await` on a return value  no-return-await
  129:12  error  Redundant use of `await` on a return value  no-return-await
  136:12  error  Redundant use of `await` on a return value  no-return-await
  144:12  error  Redundant use of `await` on a return value  no-return-await
  154:12  error  Redundant use of `await` on a return value  no-return-await
  161:12  error  Redundant use of `await` on a return value  no-return-await
  172:12  error  Redundant use of `await` on a return value  no-return-await
  180:12  error  Redundant use of `await` on a return value  no-return-await
  190:12  error  Redundant use of `await` on a return value  no-return-await

C:\BRUJULA CRIPTO\packages\app\lib\api\trackUsage.ts
  40:3  error  Unsafe return of a value of type `Promise<any>`  @typescript-eslint/no-unsafe-return

C:\BRUJULA CRIPTO\packages\app\lib\auth\AuthProvider.tsx
  91:50  error    Promise returned in function argument where a void return was expected                                @typescript-eslint/no-misused-promises
  96:6   warning  React Hook useEffect has a missing dependency: 't'. Either include it or remove the dependency array  react-hooks/exhaustive-deps

C:\BRUJULA CRIPTO\packages\functions\src\admin\adminPriceHandlers.ts
   93:43  warning  Async arrow function has a complexity of 19. Maximum allowed is 10  complexity
  245:11  error    Unsafe assignment of an `any` value                                 @typescript-eslint/no-unsafe-assignment
  278:22  error    Unexpected any. Specify a different type                            @typescript-eslint/no-explicit-any
  285:17  error    Unsafe member access .firstTwoHoursUsed on an `any` value           @typescript-eslint/no-unsafe-member-access
  286:17  error    Unsafe member access .firstTwoHoursCost on an `any` value           @typescript-eslint/no-unsafe-member-access
  287:17  error    Unsafe member access .additionalHoursUsed on an `any` value         @typescript-eslint/no-unsafe-member-access
  288:17  error    Unsafe member access .additionalHoursCost on an `any` value         @typescript-eslint/no-unsafe-member-access
  296:17  error    Unsafe member access .firstTwoHoursUsed on an `any` value           @typescript-eslint/no-unsafe-member-access
  297:17  error    Unsafe member access .firstTwoHoursCost on an `any` value           @typescript-eslint/no-unsafe-member-access
  298:17  error    Unsafe member access .additionalHoursUsed on an `any` value         @typescript-eslint/no-unsafe-member-access
  299:17  error    Unsafe member access .additionalHoursCost on an `any` value         @typescript-eslint/no-unsafe-member-access
  302:15  error    Unsafe member access .totalCost on an `any` value                   @typescript-eslint/no-unsafe-member-access
  307:7   error    Unsafe assignment of an `any` value                                 @typescript-eslint/no-unsafe-assignment

C:\BRUJULA CRIPTO\packages\functions\src\admin\serviceDirectoryHandlers.ts
   95:37  warning  Async arrow function has a complexity of 12. Maximum allowed is 10      complexity
   99:11  error    Unsafe assignment of an `any` value                                     @typescript-eslint/no-unsafe-assignment
  106:59  error    Unexpected any. Specify a different type                                @typescript-eslint/no-explicit-any
  112:7   error    Unsafe assignment of an `any` value                                     @typescript-eslint/no-unsafe-assignment
  112:25  error    Unsafe call of a(n) `any` typed value                                   @typescript-eslint/no-unsafe-call
  112:30  error    Unsafe member access .trim on an `any` value                            @typescript-eslint/no-unsafe-member-access
  115:7   error    Unsafe assignment of an `any` value                                     @typescript-eslint/no-unsafe-assignment
  115:32  error    Unsafe call of a(n) `any` typed value                                   @typescript-eslint/no-unsafe-call
  115:44  error    Unsafe member access .trim on an `any` value                            @typescript-eslint/no-unsafe-member-access
  118:7   error    Unsafe assignment of an `any` value                                     @typescript-eslint/no-unsafe-assignment
  118:28  error    Unsafe call of a(n) `any` typed value                                   @typescript-eslint/no-unsafe-call
  118:36  error    Unsafe member access .trim on an `any` value                            @typescript-eslint/no-unsafe-member-access
  121:7   error    Unsafe assignment of an `any` value                                     @typescript-eslint/no-unsafe-assignment
  121:28  error    Unsafe call of a(n) `any` typed value                                   @typescript-eslint/no-unsafe-call
  121:36  error    Unsafe member access .trim on an `any` value                            @typescript-eslint/no-unsafe-member-access
  131:66  error    Unsafe argument of type `any` assigned to a parameter of type `string`  @typescript-eslint/no-unsafe-argument
  163:11  error    Unsafe assignment of an `any` value                                     @typescript-eslint/no-unsafe-assignment
  170:66  error    Unsafe argument of type `any` assigned to a parameter of type `string`  @typescript-eslint/no-unsafe-argument
  236:11  error    Unsafe assignment of an `any` value                                     @typescript-eslint/no-unsafe-assignment
  243:72  error    Unsafe argument of type `any` assigned to a parameter of type `string`  @typescript-eslint/no-unsafe-argument

C:\BRUJULA CRIPTO\packages\functions\src\admin\setAdminRole.ts
  20:9   error  Unsafe assignment of an `any` value                                     @typescript-eslint/no-unsafe-assignment
  30:44  error  Unsafe argument of type `any` assigned to a parameter of type `string`  @typescript-eslint/no-unsafe-argument
  32:51  error  Unsafe argument of type `any` assigned to a parameter of type `string`  @typescript-eslint/no-unsafe-argument

C:\BRUJULA CRIPTO\packages\functions\src\admin\siteContentHandlers.ts
  64:9  error  Unsafe assignment of an `any` value  @typescript-eslint/no-unsafe-assignment

C:\BRUJULA CRIPTO\packages\functions\src\lib\cache.ts
  11:8   error  Forbidden non-null assertion  @typescript-eslint/no-non-null-assertion
  12:10  error  Forbidden non-null assertion  @typescript-eslint/no-non-null-assertion

C:\BRUJULA CRIPTO\packages\functions\src\lib\trackUsage.ts
   39:3   warning  Async arrow function has a complexity of 23. Maximum allowed is 10                                   complexity
   47:13  error    Unsafe assignment of an `any` value                                                                  @typescript-eslint/no-unsafe-assignment
   79:13  error    Unsafe assignment of an `any` value                                                                  @typescript-eslint/no-unsafe-assignment
   87:24  error    Unexpected any. Specify a different type                                                             @typescript-eslint/no-explicit-any
  132:13  error    Unsafe assignment of an `any` value                                                                  @typescript-eslint/no-unsafe-assignment
  152:36  error    Unsafe argument of type `any` assigned to a parameter of type `{}`                                   @typescript-eslint/no-unsafe-argument
  158:16  error    Unsafe argument of type `any` assigned to a parameter of type `PartialWithFieldValue<DocumentData>`  @typescript-eslint/no-unsafe-argument
  172:11  error    Unsafe assignment of an `any` value                                                                  @typescript-eslint/no-unsafe-assignment
  181:9   error    Unsafe assignment of an `any` value                                                                  @typescript-eslint/no-unsafe-assignment
  224:13  error    Unsafe assignment of an `any` value                                                                  @typescript-eslint/no-unsafe-assignment
  233:9   error    Unsafe assignment of an `any` value                                                                  @typescript-eslint/no-unsafe-assignment

C:\BRUJULA CRIPTO\packages\functions\src\payments\createCheckout.ts
   24:38  warning  Async arrow function has a complexity of 13. Maximum allowed is 10  complexity
   31:11  error    Unsafe assignment of an `any` value                                 @typescript-eslint/no-unsafe-assignment
   48:9   error    Unsafe assignment of an `any` value                                 @typescript-eslint/no-unsafe-assignment
   75:7   error    Unsafe assignment of an `any` value                                 @typescript-eslint/no-unsafe-assignment
   75:56  error    Unsafe member access .price on an `any` value                       @typescript-eslint/no-unsafe-member-access
   76:7   error    Unsafe assignment of an `any` value                                 @typescript-eslint/no-unsafe-assignment
   76:60  error    Unsafe member access .price on an `any` value                       @typescript-eslint/no-unsafe-member-access
   81:25  error    Unexpected any. Specify a different type                            @typescript-eslint/no-explicit-any
  137:7   error    Unsafe assignment of an `any` value                                 @typescript-eslint/no-unsafe-assignment
  154:7   error    Unsafe assignment of an `any` value                                 @typescript-eslint/no-unsafe-assignment

C:\BRUJULA CRIPTO\packages\functions\src\payments\createStripePortalSession.ts
   55:13  error  Unsafe assignment of an `any` value  @typescript-eslint/no-unsafe-assignment
   62:13  error  Unsafe assignment of an `any` value  @typescript-eslint/no-unsafe-assignment
   78:9   error  Unsafe assignment of an `any` value  @typescript-eslint/no-unsafe-assignment
   90:11  error  Unsafe assignment of an `any` value  @typescript-eslint/no-unsafe-assignment
  110:9   error  Unsafe assignment of an `any` value  @typescript-eslint/no-unsafe-assignment

C:\BRUJULA CRIPTO\packages\functions\src\payments\stripeWebhooks.ts
  61:13  error  Unsafe assignment of an `any` value                                                  @typescript-eslint/no-unsafe-assignment
  61:32  error  Unsafe argument of type `any` assigned to a parameter of type `string`               @typescript-eslint/no-unsafe-argument
  61:32  error  Unsafe call of a(n) `any` typed value                                                @typescript-eslint/no-unsafe-call
  61:45  error  Unsafe member access .toString on an `any` value                                     @typescript-eslint/no-unsafe-member-access
  63:59  error  Unsafe member access .type on an `any` value                                         @typescript-eslint/no-unsafe-member-access
  65:21  error  Unsafe member access .type on an `any` value                                         @typescript-eslint/no-unsafe-member-access
  67:48  error  Unsafe argument of type `any` assigned to a parameter of type `StripeSession`        @typescript-eslint/no-unsafe-argument
  67:54  error  Unsafe member access .data on an `any` value                                         @typescript-eslint/no-unsafe-member-access
  71:43  error  Unsafe argument of type `any` assigned to a parameter of type `StripeSubscription`   @typescript-eslint/no-unsafe-argument
  71:49  error  Unsafe member access .data on an `any` value                                         @typescript-eslint/no-unsafe-member-access
  75:43  error  Unsafe argument of type `any` assigned to a parameter of type `StripeSubscription`   @typescript-eslint/no-unsafe-argument
  75:49  error  Unsafe member access .data on an `any` value                                         @typescript-eslint/no-unsafe-member-access
  79:47  error  Unsafe argument of type `any` assigned to a parameter of type `StripeInvoice`        @typescript-eslint/no-unsafe-argument
  79:53  error  Unsafe member access .data on an `any` value                                         @typescript-eslint/no-unsafe-member-access
  83:46  error  Unsafe argument of type `any` assigned to a parameter of type `StripePaymentIntent`  @typescript-eslint/no-unsafe-argument
  83:52  error  Unsafe member access .data on an `any` value                                         @typescript-eslint/no-unsafe-member-access
  87:54  error  Unsafe member access .type on an `any` value                                         @typescript-eslint/no-unsafe-member-access

C:\BRUJULA CRIPTO\packages\functions\src\public\handleContactForm.ts
   90:60  error  Unexpected any. Specify a different type         @typescript-eslint/no-explicit-any
   91:13  error  Unsafe assignment of an `any` value              @typescript-eslint/no-unsafe-assignment
   91:20  error  Unsafe call of a(n) `any` typed value            @typescript-eslint/no-unsafe-call
   91:24  error  Unsafe member access .path on an `any` value     @typescript-eslint/no-unsafe-member-access
   92:13  error  Unsafe assignment of an `any` value              @typescript-eslint/no-unsafe-assignment
   92:26  error  Unsafe member access .message on an `any` value  @typescript-eslint/no-unsafe-member-access
  106:9   error  Unsafe assignment of an `any` value              @typescript-eslint/no-unsafe-assignment
  106:36  error  Unexpected any. Specify a different type         @typescript-eslint/no-explicit-any
