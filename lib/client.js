window.__ModuleLoader__.load({ id: "dsh-whale-leap", factory: (require) => {
var module = { exports: {} };
var exports = module.exports;

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/index.tsx
var index_exports = {};
__export(index_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(index_exports);

// src/client/i18n.ts
var zh = {
  nav: "\u9CB8\u8DC3",
  intro: "\u4E00\u53EA\u4F1A\u6E38\u52A8\u7684\u9CB8\u9C7C\uFF1A\u7A7A\u767D\u9996\u9875\u3001\u8FDB\u884C\u4E2D\u7684\u4F1A\u8BDD\u4E0E\u4EFB\u52A1\u56FE\u6807\u90FD\u5728\u8FD9\u91CC\u8BBE\u7F6E\u3002",
  tabBackground: "\u80CC\u666F",
  tabMark: "\u4EFB\u52A1\u56FE\u6807",
  groupAppearance: "\u5916\u89C2",
  groupPlayback: "\u64AD\u653E",
  groupIcon: "\u663E\u793A",
  stageHint: "\u5B9E\u65F6\u9884\u89C8",
  color: "\u989C\u8272",
  colorTheme: "\u8DDF\u968F\u4E3B\u9898",
  colorCustom: "\u81EA\u5B9A\u4E49",
  colorHint: "\u8DDF\u968F\u4E3B\u9898\u7684\u6587\u5B57\u8272\u8C03\uFF0C\u6216\u9009\u62E9\u81EA\u5DF1\u7684\u58A8\u8272\u3002",
  size: "\u80CC\u666F\u5927\u5C0F",
  sizeHint: "\u9CB8\u9C7C\u5728\u80CC\u666F\u4E2D\u7684\u7ED8\u5236\u8303\u56F4\u3002",
  strength: "\u58A8\u8272\u6D53\u5EA6",
  strengthHint: "\u9ED8\u8BA4 60%\uFF1B\u62C9\u6EE1 100% \u53EF\u5F97\u5230\u7EAF\u9ED1\u7684\u70B9\u3002",
  auto: "\u5728\u4F1A\u8BDD\u4E2D\u81EA\u52A8\u51FA\u73B0",
  autoHint: "\u5F00\u59CB\u5BF9\u8BDD\u540E\uFF0C\u9CB8\u9C7C\u4F1A\u6309\u95F4\u9694\u81EA\u884C\u51FA\u73B0\u3002",
  playOnSwitch: "\u5207\u6362\u4F1A\u8BDD\u65F6\u7ACB\u5373\u51FA\u73B0",
  playOnSwitchHint: "\u5173\u95ED\u540E\u8FDB\u5165\u4F1A\u8BDD\u4E0D\u4F1A\u7ACB\u523B\u64AD\u653E\uFF0C\u7B49\u4E0B\u4E00\u4E2A\u95F4\u9694\u518D\u51FA\u73B0\u3002",
  interval: "\u51FA\u73B0\u95F4\u9694",
  intervalHint: "\u81EA\u52A8\u51FA\u73B0\u7684\u95F4\u9694\u65F6\u95F4\u3002",
  intervalSeconds: "{seconds} \u79D2",
  markSize: "\u56FE\u6807\u5927\u5C0F",
  markSizeHint: "\u300C\u6DF1\u5EA6\u6C42\u7D22\u300D\u5DE6\u4FA7\u9C7C\u5F62\u56FE\u6807\u7684\u5927\u5C0F\u3002",
  labelSize: "\u6587\u5B57\u5927\u5C0F",
  labelSizeHint: "\u300C\u6DF1\u5EA6\u6C42\u7D22\u4E2D\u300D\u6587\u5B57\u7684\u5B57\u53F7\uFF1B\u8C03\u6574\u4E0D\u4F1A\u6539\u53D8\u884C\u9AD8\u4E0E\u5185\u8FB9\u8DDD\u3002",
  offsetX: "\u6C34\u5E73\u4F4D\u7F6E",
  offsetXHint: "\u8D1F\u6570\u5DE6\u79FB\uFF0C\u6B63\u6570\u53F3\u79FB\u3002",
  offsetY: "\u5782\u76F4\u4F4D\u7F6E",
  offsetYHint: "\u8D1F\u6570\u4E0A\u79FB\uFF0C\u6B63\u6570\u4E0B\u79FB\u3002",
  replaceMark: "\u66FF\u6362\u4EFB\u52A1\u72B6\u6001\u56FE\u6807",
  replaceMarkHint: "\u5173\u95ED\u540E\u300C\u6DF1\u5EA6\u6C42\u7D22\u300D\u5DE6\u4FA7\u6062\u590D DSH \u9ED8\u8BA4\u7684\u9CB8\u5C3E\u56FE\u6807\u3002",
  motion: "\u52A8\u753B",
  motionSwim: "\u6E38\u52A8",
  motionExplore: "\u63A2\u7D22",
  motionHero: "\u9996\u9875\u6E38\u52A8",
  motionSway: "\u5DE6\u53F3\u8F7B\u6446",
  swing: "\u6446\u52A8\u5E45\u5EA6",
  swingHint: "\u53EA\u4F5C\u7528\u4E8E\u6E38\u52A8\u3001\u63A2\u7D22\u548C\u5DE6\u53F3\u8F7B\u6446\uFF1B\u9996\u9875\u6E38\u52A8\u4FDD\u6301\u9996\u9875\u539F\u6837\u3002",
  motionHint: "\u6E38\u52A8\u50CF\u6446\u5C3E\u524D\u8FDB\uFF1B\u63A2\u7D22\u4F1A\u5728\u672A\u77E5\u4E2D\u4E0A\u6D6E\u518D\u4E0B\u6F5C\uFF1B\u9996\u9875\u6E38\u52A8\u4E0E\u7A7A\u767D\u9996\u9875 hover \u4E00\u81F4\uFF1B\u5DE6\u53F3\u8F7B\u6446\u53EA\u662F\u8F7B\u5FAE\u6F02\u79FB\u3002",
  markPreviewHint: "\u4EFB\u52A1\u8FDB\u884C\u65F6\u9C7C\u5F62\u56FE\u6807\u7684\u52A8\u4F5C\u3002",
  runningLabel: "\u6DF1\u5EA6\u6C42\u7D22\u4E2D",
  preview: "\u9884\u89C8",
  previewHint: "\u5F53\u524D\u52A8\u753B\u7684\u5B9E\u65F6\u6548\u679C\u3002",
  selected: "\u5DF2\u9009",
  version: "v{version}",
  checkUpdate: "\u68C0\u67E5\u66F4\u65B0",
  checking: "\u68C0\u67E5\u4E2D\u2026",
  upToDate: "\u5DF2\u662F\u6700\u65B0\u7248\u672C\uFF08{version}\uFF09",
  updateAvailable: "\u53D1\u73B0\u65B0\u7248\u672C {version}",
  updateFailed: "\u68C0\u67E5\u66F4\u65B0\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5\u3002",
  noRelease: "GitHub \u4E0A\u8FD8\u6CA1\u6709\u53D1\u5E03\u7248\u672C\uFF0C\u6682\u65F6\u65E0\u6CD5\u68C0\u67E5\u66F4\u65B0\u3002",
  viewVersion: "\u67E5\u770B {version}"
};
var en = {
  nav: "Whale leap",
  intro: "A whale that swims: set up the blank home, started conversations, and the running mark here.",
  tabBackground: "Background",
  tabMark: "Running icon",
  groupAppearance: "Appearance",
  groupPlayback: "Playback",
  groupIcon: "Display",
  stageHint: "Live preview",
  color: "Color",
  colorTheme: "Follow theme",
  colorCustom: "Custom",
  colorHint: "Match the theme text tone, or pick your own ink color.",
  size: "Background size",
  sizeHint: "How much of the background the whale paints.",
  strength: "Ink strength",
  strengthHint: "60% is the default; 100% saturates the faint dots into solid black.",
  auto: "Show in conversations",
  autoHint: "After a conversation starts, the whale appears on its own at the interval below.",
  playOnSwitch: "Appear when switching conversations",
  playOnSwitchHint: "When off, entering a conversation waits for the next interval instead of playing at once.",
  interval: "Appearance interval",
  intervalHint: "How often the whale reappears on its own.",
  intervalSeconds: "{seconds} s",
  markSize: "Running icon size",
  markSizeHint: "Size of the fish mark beside the running status.",
  labelSize: "Text size",
  labelSizeHint: "Size of the running status label; the row keeps its height and padding.",
  offsetX: "Horizontal position",
  offsetXHint: "Negative moves left, positive moves right.",
  offsetY: "Vertical position",
  offsetYHint: "Negative moves up, positive moves down.",
  replaceMark: "Replace the running icon",
  replaceMarkHint: "When off, the shipped whale tail returns beside the running status.",
  motion: "Motion",
  motionSwim: "Swimming",
  motionExplore: "Explore",
  motionHero: "Home swim",
  motionSway: "Gentle sway",
  swing: "Swing amplitude",
  swingHint: "Scales Swimming, Explore and Gentle sway. Home swim keeps its exact home-page motion.",
  motionHint: "Swimming drifts like a tail stroke; Explore rises then dives into the unknown; Home swim matches hovering the blank home; Gentle sway only floats side to side.",
  markPreviewHint: "Motion of the fish mark while a task runs.",
  runningLabel: "Deep diving",
  preview: "Preview",
  previewHint: "Live preview of the selected motion.",
  selected: "Selected",
  version: "v{version}",
  checkUpdate: "Check for updates",
  checking: "Checking\u2026",
  upToDate: "Up to date ({version})",
  updateAvailable: "Version {version} is available",
  updateFailed: "Update check failed. Try again later.",
  noRelease: "No release on GitHub yet, so updates cannot be checked.",
  viewVersion: "View {version}"
};
var ja = {
  nav: "\u30DB\u30A8\u30FC\u30EB\u30EA\u30FC\u30D7",
  intro: "\u6CF3\u3050\u30AF\u30B8\u30E9\uFF1A\u7A7A\u767D\u30DB\u30FC\u30E0\u3001\u9032\u884C\u4E2D\u306E\u4F1A\u8A71\u3001\u5B9F\u884C\u4E2D\u30A2\u30A4\u30B3\u30F3\u3092\u3053\u3053\u3067\u8A2D\u5B9A\u3057\u307E\u3059\u3002",
  tabBackground: "\u80CC\u666F",
  tabMark: "\u5B9F\u884C\u30A2\u30A4\u30B3\u30F3",
  groupAppearance: "\u5916\u89B3",
  groupPlayback: "\u518D\u751F",
  groupIcon: "\u8868\u793A",
  stageHint: "\u30E9\u30A4\u30D6\u30D7\u30EC\u30D3\u30E5\u30FC",
  color: "\u8272",
  colorTheme: "\u30C6\u30FC\u30DE\u306B\u5408\u308F\u305B\u308B",
  colorCustom: "\u30AB\u30B9\u30BF\u30E0",
  colorHint: "\u30C6\u30FC\u30DE\u306E\u6587\u5B57\u8272\u306B\u5408\u308F\u305B\u308B\u304B\u3001\u597D\u304D\u306A\u30A4\u30F3\u30AF\u8272\u3092\u9078\u3073\u307E\u3059\u3002",
  size: "\u80CC\u666F\u306E\u5927\u304D\u3055",
  sizeHint: "\u30AF\u30B8\u30E9\u3092\u63CF\u304F\u80CC\u666F\u306E\u7BC4\u56F2\u3067\u3059\u3002",
  strength: "\u30A4\u30F3\u30AF\u306E\u6FC3\u3055",
  strengthHint: "\u65E2\u5B9A\u306F 60%\u3002100% \u307E\u3067\u4E0A\u3052\u308B\u3068\u6DE1\u3044\u70B9\u304C\u7D14\u9ED2\u306B\u306A\u308A\u307E\u3059\u3002",
  auto: "\u4F1A\u8A71\u4E2D\u306B\u81EA\u52D5\u8868\u793A",
  autoHint: "\u4F1A\u8A71\u3092\u59CB\u3081\u308B\u3068\u3001\u4E0B\u306E\u9593\u9694\u3067\u30AF\u30B8\u30E9\u304C\u81EA\u52D5\u7684\u306B\u73FE\u308C\u307E\u3059\u3002",
  playOnSwitch: "\u4F1A\u8A71\u306E\u5207\u308A\u66FF\u3048\u6642\u306B\u8868\u793A",
  playOnSwitchHint: "\u30AA\u30D5\u306B\u3059\u308B\u3068\u3001\u4F1A\u8A71\u306B\u5165\u3063\u305F\u76F4\u5F8C\u306B\u306F\u518D\u751F\u305B\u305A\u3001\u6B21\u306E\u9593\u9694\u307E\u3067\u5F85\u3061\u307E\u3059\u3002",
  interval: "\u8868\u793A\u9593\u9694",
  intervalHint: "\u81EA\u52D5\u3067\u518D\u8868\u793A\u3059\u308B\u9593\u9694\u3067\u3059\u3002",
  intervalSeconds: "{seconds} \u79D2",
  markSize: "\u5B9F\u884C\u30A2\u30A4\u30B3\u30F3\u306E\u30B5\u30A4\u30BA",
  markSizeHint: "\u300C\u6DF1\u5EA6\u6C42\u7D22\u300D\u306E\u5DE6\u306B\u3042\u308B\u9B5A\u30A2\u30A4\u30B3\u30F3\u306E\u5927\u304D\u3055\u3067\u3059\u3002",
  labelSize: "\u6587\u5B57\u30B5\u30A4\u30BA",
  labelSizeHint: "\u300C\u6DF1\u5EA6\u6C42\u7D22\u4E2D\u300D\u306E\u6587\u5B57\u30B5\u30A4\u30BA\u3002\u884C\u306E\u9AD8\u3055\u3068\u4F59\u767D\u306F\u5909\u308F\u308A\u307E\u305B\u3093\u3002",
  offsetX: "\u6C34\u5E73\u4F4D\u7F6E",
  offsetXHint: "\u8CA0\u306E\u5024\u3067\u5DE6\u3001\u6B63\u306E\u5024\u3067\u53F3\u3078\u79FB\u52D5\u3057\u307E\u3059\u3002",
  offsetY: "\u5782\u76F4\u4F4D\u7F6E",
  offsetYHint: "\u8CA0\u306E\u5024\u3067\u4E0A\u3001\u6B63\u306E\u5024\u3067\u4E0B\u3078\u79FB\u52D5\u3057\u307E\u3059\u3002",
  replaceMark: "\u5B9F\u884C\u30A2\u30A4\u30B3\u30F3\u3092\u7F6E\u304D\u63DB\u3048\u308B",
  replaceMarkHint: "\u30AA\u30D5\u306B\u3059\u308B\u3068\u300C\u6DF1\u5EA6\u6C42\u7D22\u300D\u306E\u5DE6\u306F\u6A19\u6E96\u306E\u30AF\u30B8\u30E9\u306E\u5C3E\u30A2\u30A4\u30B3\u30F3\u306B\u623B\u308A\u307E\u3059\u3002",
  motion: "\u30A2\u30CB\u30E1\u30FC\u30B7\u30E7\u30F3",
  motionSwim: "\u6CF3\u3050",
  motionExplore: "\u63A2\u7D22",
  motionHero: "\u30DB\u30FC\u30E0\u306E\u52D5\u304D",
  motionSway: "\u5DE6\u53F3\u306B\u63FA\u308C\u308B",
  swing: "\u63FA\u308C\u306E\u5E45",
  swingHint: "\u6CF3\u3050\u30FB\u63A2\u7D22\u30FB\u5DE6\u53F3\u306B\u63FA\u308C\u308B\u306E\u632F\u308C\u5E45\u3067\u3059\u3002\u30DB\u30FC\u30E0\u306E\u52D5\u304D\u306F\u5143\u306E\u307E\u307E\u3067\u3059\u3002",
  motionHint: "\u6CF3\u3050\u306F\u5C3E\u3073\u308C\u3067\u9032\u3080\u3088\u3046\u306B\u52D5\u304D\u3001\u63A2\u7D22\u306F\u672A\u77E5\u3078\u6D6E\u304B\u3093\u3067\u304B\u3089\u6F5C\u308A\u3001\u30DB\u30FC\u30E0\u306E\u52D5\u304D\u306F\u7A7A\u767D\u30DB\u30FC\u30E0\u306E\u30DB\u30D0\u30FC\u3068\u540C\u3058\u3001\u5DE6\u53F3\u306B\u63FA\u308C\u308B\u306F\u3054\u304F\u6D45\u304F\u6F02\u3044\u307E\u3059\u3002",
  markPreviewHint: "\u30BF\u30B9\u30AF\u5B9F\u884C\u4E2D\u306E\u9B5A\u30A2\u30A4\u30B3\u30F3\u306E\u52D5\u304D\u3067\u3059\u3002",
  runningLabel: "\u6DF1\u6398\u308A\u4E2D",
  preview: "\u30D7\u30EC\u30D3\u30E5\u30FC",
  previewHint: "\u9078\u629E\u4E2D\u306E\u30A2\u30CB\u30E1\u30FC\u30B7\u30E7\u30F3\u306E\u30E9\u30A4\u30D6\u8868\u793A\u3067\u3059\u3002",
  selected: "\u9078\u629E\u4E2D",
  version: "v{version}",
  checkUpdate: "\u66F4\u65B0\u3092\u78BA\u8A8D",
  checking: "\u78BA\u8A8D\u4E2D\u2026",
  upToDate: "\u6700\u65B0\u3067\u3059\uFF08{version}\uFF09",
  updateAvailable: "\u65B0\u3057\u3044\u30D0\u30FC\u30B8\u30E7\u30F3 {version} \u304C\u3042\u308A\u307E\u3059",
  updateFailed: "\u66F4\u65B0\u306E\u78BA\u8A8D\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\u5F8C\u3067\u3082\u3046\u4E00\u5EA6\u304A\u8A66\u3057\u304F\u3060\u3055\u3044\u3002",
  noRelease: "GitHub \u306B\u307E\u3060\u30EA\u30EA\u30FC\u30B9\u304C\u306A\u3044\u305F\u3081\u3001\u66F4\u65B0\u3092\u78BA\u8A8D\u3067\u304D\u307E\u305B\u3093\u3002",
  viewVersion: "{version} \u3092\u898B\u308B"
};
var es = {
  nav: "Salto de ballena",
  intro: "Una ballena que nada: configura el inicio vac\xEDo, las conversaciones y el icono de ejecuci\xF3n aqu\xED.",
  tabBackground: "Fondo",
  tabMark: "Icono de ejecuci\xF3n",
  groupAppearance: "Apariencia",
  groupPlayback: "Reproducci\xF3n",
  groupIcon: "Visualizaci\xF3n",
  stageHint: "Vista previa en vivo",
  color: "Color",
  colorTheme: "Seguir el tema",
  colorCustom: "Personalizado",
  colorHint: "Iguala el tono del texto del tema o elige tu propia tinta.",
  size: "Tama\xF1o del fondo",
  sizeHint: "Cu\xE1nto fondo pinta la ballena.",
  strength: "Intensidad de tinta",
  strengthHint: "El 60 % es el valor predeterminado; el 100 % convierte los puntos tenues en negro s\xF3lido.",
  auto: "Aparecer en conversaciones",
  autoHint: "Tras iniciar una conversaci\xF3n, la ballena aparece sola con el intervalo de abajo.",
  playOnSwitch: "Aparecer al cambiar de conversaci\xF3n",
  playOnSwitchHint: "Si se desactiva, entrar en una conversaci\xF3n espera al siguiente intervalo en vez de reproducirse al momento.",
  interval: "Intervalo de aparici\xF3n",
  intervalHint: "Cada cu\xE1nto reaparece sola la ballena.",
  intervalSeconds: "{seconds} s",
  markSize: "Tama\xF1o del icono de ejecuci\xF3n",
  markSizeHint: "Tama\xF1o del pez junto al estado de ejecuci\xF3n.",
  labelSize: "Tama\xF1o del texto",
  labelSizeHint: "Tama\xF1o del texto del estado; la fila conserva su altura y relleno.",
  offsetX: "Posici\xF3n horizontal",
  offsetXHint: "Los valores negativos mueven a la izquierda y los positivos a la derecha.",
  offsetY: "Posici\xF3n vertical",
  offsetYHint: "Los valores negativos mueven hacia arriba y los positivos hacia abajo.",
  replaceMark: "Sustituir el icono de ejecuci\xF3n",
  replaceMarkHint: "Al desactivarlo, la cola de ballena original vuelve junto al estado de ejecuci\xF3n.",
  motion: "Movimiento",
  motionSwim: "Nadar",
  motionExplore: "Explorar",
  motionHero: "Como en el inicio",
  motionSway: "Balanceo suave",
  swing: "Amplitud del balanceo",
  swingHint: "Escala Nadar, Explorar y Balanceo suave. Como en el inicio conserva su movimiento original.",
  motionHint: "Nadar avanza como un golpe de cola; Explorar sube y luego se sumerge en lo desconocido; Como en el inicio coincide con pasar el cursor por el inicio vac\xEDo; Balanceo suave solo flota de lado a lado.",
  markPreviewHint: "Movimiento del pez mientras una tarea est\xE1 en curso.",
  runningLabel: "Razonamiento profundo",
  preview: "Vista previa",
  previewHint: "Vista previa en vivo del movimiento elegido.",
  selected: "Elegido",
  version: "v{version}",
  checkUpdate: "Buscar actualizaciones",
  checking: "Comprobando\u2026",
  upToDate: "Ya est\xE1 actualizado ({version})",
  updateAvailable: "La versi\xF3n {version} est\xE1 disponible",
  updateFailed: "No se pudo comprobar la actualizaci\xF3n. Int\xE9ntalo m\xE1s tarde.",
  noRelease: "A\xFAn no hay una versi\xF3n publicada en GitHub, as\xED que no se pueden comprobar actualizaciones.",
  viewVersion: "Ver {version}"
};
var fr = {
  nav: "Saut de baleine",
  intro: "Une baleine qui nage : r\xE9glez l'accueil vide, les conversations et l'ic\xF4ne d'ex\xE9cution ici.",
  tabBackground: "Fond",
  tabMark: "Ic\xF4ne d'ex\xE9cution",
  groupAppearance: "Apparence",
  groupPlayback: "Lecture",
  groupIcon: "Affichage",
  stageHint: "Aper\xE7u en direct",
  color: "Couleur",
  colorTheme: "Suivre le th\xE8me",
  colorCustom: "Personnalis\xE9e",
  colorHint: "Reprendre le ton du texte du th\xE8me ou choisir sa propre encre.",
  size: "Taille du fond",
  sizeHint: "Surface de fond peinte par la baleine.",
  strength: "Intensit\xE9 de l'encre",
  strengthHint: "60 % par d\xE9faut ; 100 % sature les points les plus p\xE2les en noir uni.",
  auto: "Appara\xEEtre dans les conversations",
  autoHint: "Apr\xE8s le d\xE9but d'une conversation, la baleine appara\xEEt seule selon l'intervalle ci-dessous.",
  playOnSwitch: "Appara\xEEtre en changeant de conversation",
  playOnSwitchHint: "D\xE9sactiv\xE9, entrer dans une conversation attend le prochain intervalle au lieu de jouer imm\xE9diatement.",
  interval: "Intervalle d'apparition",
  intervalHint: "Fr\xE9quence de r\xE9apparition automatique.",
  intervalSeconds: "{seconds} s",
  markSize: "Taille de l'ic\xF4ne d'ex\xE9cution",
  markSizeHint: "Taille du poisson \xE0 c\xF4t\xE9 de l'\xE9tat d'ex\xE9cution.",
  labelSize: "Taille du texte",
  labelSizeHint: "Taille du texte de statut ; la ligne conserve sa hauteur et ses marges.",
  offsetX: "Position horizontale",
  offsetXHint: "Les valeurs n\xE9gatives d\xE9placent vers la gauche, les positives vers la droite.",
  offsetY: "Position verticale",
  offsetYHint: "Les valeurs n\xE9gatives d\xE9placent vers le haut, les positives vers le bas.",
  replaceMark: "Remplacer l'ic\xF4ne d'ex\xE9cution",
  replaceMarkHint: "D\xE9sactiv\xE9, la queue de baleine d'origine revient \xE0 c\xF4t\xE9 de l'\xE9tat d'ex\xE9cution.",
  motion: "Animation",
  motionSwim: "Nager",
  motionExplore: "Explorer",
  motionHero: "Comme \xE0 l'accueil",
  motionSway: "Balancement doux",
  swing: "Amplitude du balancement",
  swingHint: "R\xE8gle Nager, Explorer et Balancement doux. Comme \xE0 l'accueil garde son mouvement d'origine.",
  motionHint: "Nager avance comme un coup de queue ; Explorer monte puis plonge vers l'inconnu ; Comme \xE0 l'accueil reprend le survol de l'accueil vide ; Balancement doux flotte simplement de gauche \xE0 droite.",
  markPreviewHint: "Animation du poisson pendant l'ex\xE9cution d'une t\xE2che.",
  runningLabel: "R\xE9flexion approfondie",
  preview: "Aper\xE7u",
  previewHint: "Aper\xE7u en direct de l'animation choisie.",
  selected: "Choisi",
  version: "v{version}",
  checkUpdate: "V\xE9rifier les mises \xE0 jour",
  checking: "V\xE9rification\u2026",
  upToDate: "\xC0 jour ({version})",
  updateAvailable: "La version {version} est disponible",
  updateFailed: "\xC9chec de la v\xE9rification. R\xE9essayez plus tard.",
  noRelease: "Aucune version publi\xE9e sur GitHub pour l'instant ; impossible de v\xE9rifier les mises \xE0 jour.",
  viewVersion: "Voir {version}"
};
var de = {
  nav: "Wal-Sprung",
  intro: "Ein schwimmender Wal: Leerstart, laufende Unterhaltungen und das Lauf-Symbol werden hier eingestellt.",
  tabBackground: "Hintergrund",
  tabMark: "Lauf-Symbol",
  groupAppearance: "Darstellung",
  groupPlayback: "Wiedergabe",
  groupIcon: "Anzeige",
  stageHint: "Live-Vorschau",
  color: "Farbe",
  colorTheme: "Thema folgen",
  colorCustom: "Eigene",
  colorHint: "Dem Textton des Themas folgen oder eine eigene Tintenfarbe w\xE4hlen.",
  size: "Hintergrundgr\xF6\xDFe",
  sizeHint: "Fl\xE4che, die der Wal im Hintergrund malt.",
  strength: "Tintenst\xE4rke",
  strengthHint: "Standard 60 %; 100 % s\xE4ttigt die blassen Punkte zu tiefem Schwarz.",
  auto: "In Unterhaltungen erscheinen",
  autoHint: "Nach dem Start einer Unterhaltung erscheint der Wal selbstst\xE4ndig im untenstehenden Abstand.",
  playOnSwitch: "Beim Wechsel der Unterhaltung erscheinen",
  playOnSwitchHint: "Aus: Beim \xD6ffnen einer Unterhaltung wird erst nach dem n\xE4chsten Abstand abgespielt.",
  interval: "Erscheinungsabstand",
  intervalHint: "Wie oft der Wal von selbst wiederkehrt.",
  intervalSeconds: "{seconds} s",
  markSize: "Gr\xF6\xDFe des Lauf-Symbols",
  markSizeHint: "Gr\xF6\xDFe des Fischsymbols neben dem Ausf\xFChrungsstatus.",
  labelSize: "Textgr\xF6\xDFe",
  labelSizeHint: "Gr\xF6\xDFe des Statustexts; die Zeile beh\xE4lt H\xF6he und Abstand.",
  offsetX: "Horizontale Position",
  offsetXHint: "Negative Werte verschieben nach links, positive nach rechts.",
  offsetY: "Vertikale Position",
  offsetYHint: "Negative Werte verschieben nach oben, positive nach unten.",
  replaceMark: "Lauf-Symbol ersetzen",
  replaceMarkHint: "Aus: Neben dem Ausf\xFChrungsstatus erscheint wieder der urspr\xFCngliche Wal-Schwanz.",
  motion: "Animation",
  motionSwim: "Schwimmen",
  motionExplore: "Erkunden",
  motionHero: "Wie im Leerstart",
  motionSway: "Sanftes Wiegen",
  swing: "Schwungweite",
  swingHint: "Skaliert Schwimmen, Erkunden und Sanftes Wiegen. Wie im Leerstart bleibt unver\xE4ndert.",
  motionHint: "Schwimmen treibt wie ein Flossenschlag; Erkunden steigt auf und taucht ins Unbekannte; Wie im Leerstart entspricht dem \xDCberfahren des leeren Starts; Sanftes Wiegen schwebt nur seitlich.",
  markPreviewHint: "Bewegung des Fischsymbols w\xE4hrend einer laufenden Aufgabe.",
  runningLabel: "Gr\xFCndliches Nachdenken",
  preview: "Vorschau",
  previewHint: "Live-Vorschau der gew\xE4hlten Animation.",
  selected: "Gew\xE4hlt",
  version: "v{version}",
  checkUpdate: "Nach Updates suchen",
  checking: "Wird gepr\xFCft\u2026",
  upToDate: "Aktuell ({version})",
  updateAvailable: "Version {version} ist verf\xFCgbar",
  updateFailed: "Update-Pr\xFCfung fehlgeschlagen. Bitte sp\xE4ter erneut versuchen.",
  noRelease: "Noch keine Ver\xF6ffentlichung auf GitHub, Updates k\xF6nnen nicht gepr\xFCft werden.",
  viewVersion: "{version} ansehen"
};
var ru = {
  nav: "\u041F\u0440\u044B\u0436\u043E\u043A \u043A\u0438\u0442\u0430",
  intro: "\u041F\u043B\u0430\u0432\u0430\u044E\u0449\u0438\u0439 \u043A\u0438\u0442: \u043F\u0443\u0441\u0442\u043E\u0439 \u0441\u0442\u0430\u0440\u0442\u043E\u0432\u044B\u0439 \u044D\u043A\u0440\u0430\u043D, \u0442\u0435\u043A\u0443\u0449\u0438\u0435 \u0434\u0438\u0430\u043B\u043E\u0433\u0438 \u0438 \u0437\u043D\u0430\u0447\u043E\u043A \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u044F \u043D\u0430\u0441\u0442\u0440\u0430\u0438\u0432\u0430\u044E\u0442\u0441\u044F \u0437\u0434\u0435\u0441\u044C.",
  tabBackground: "\u0424\u043E\u043D",
  tabMark: "\u0417\u043D\u0430\u0447\u043E\u043A \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u044F",
  groupAppearance: "\u0412\u0438\u0434",
  groupPlayback: "\u0412\u043E\u0441\u043F\u0440\u043E\u0438\u0437\u0432\u0435\u0434\u0435\u043D\u0438\u0435",
  groupIcon: "\u041E\u0442\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435",
  stageHint: "\u0416\u0438\u0432\u043E\u0439 \u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440",
  color: "\u0426\u0432\u0435\u0442",
  colorTheme: "\u041A\u0430\u043A \u0432 \u0442\u0435\u043C\u0435",
  colorCustom: "\u0421\u0432\u043E\u0439",
  colorHint: "\u0421\u043B\u0435\u0434\u043E\u0432\u0430\u0442\u044C \u0442\u043E\u043D\u0443 \u0442\u0435\u043A\u0441\u0442\u0430 \u0442\u0435\u043C\u044B \u0438\u043B\u0438 \u0432\u044B\u0431\u0440\u0430\u0442\u044C \u0441\u0432\u043E\u0438 \u0447\u0435\u0440\u043D\u0438\u043B\u0430.",
  size: "\u0420\u0430\u0437\u043C\u0435\u0440 \u0444\u043E\u043D\u0430",
  sizeHint: "\u0421\u043A\u043E\u043B\u044C\u043A\u043E \u0444\u043E\u043D\u0430 \u0440\u0438\u0441\u0443\u0435\u0442 \u043A\u0438\u0442.",
  strength: "\u041F\u043B\u043E\u0442\u043D\u043E\u0441\u0442\u044C \u0447\u0435\u0440\u043D\u0438\u043B",
  strengthHint: "\u041F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E 60%; 100% \u0434\u0435\u043B\u0430\u0435\u0442 \u0431\u043B\u0435\u0434\u043D\u044B\u0435 \u0442\u043E\u0447\u043A\u0438 \u0447\u0438\u0441\u0442\u043E \u0447\u0451\u0440\u043D\u044B\u043C\u0438.",
  auto: "\u041F\u043E\u044F\u0432\u043B\u044F\u0442\u044C\u0441\u044F \u0432 \u0434\u0438\u0430\u043B\u043E\u0433\u0430\u0445",
  autoHint: "\u041F\u043E\u0441\u043B\u0435 \u043D\u0430\u0447\u0430\u043B\u0430 \u0434\u0438\u0430\u043B\u043E\u0433\u0430 \u043A\u0438\u0442 \u043F\u043E\u044F\u0432\u043B\u044F\u0435\u0442\u0441\u044F \u0441\u0430\u043C \u0441 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u043E\u043C \u043D\u0438\u0436\u0435.",
  playOnSwitch: "\u041F\u043E\u044F\u0432\u043B\u044F\u0442\u044C\u0441\u044F \u043F\u0440\u0438 \u0441\u043C\u0435\u043D\u0435 \u0434\u0438\u0430\u043B\u043E\u0433\u0430",
  playOnSwitchHint: "\u0415\u0441\u043B\u0438 \u0432\u044B\u043A\u043B\u044E\u0447\u0435\u043D\u043E, \u043F\u0440\u0438 \u0432\u0445\u043E\u0434\u0435 \u0432 \u0434\u0438\u0430\u043B\u043E\u0433 \u0432\u043E\u0441\u043F\u0440\u043E\u0438\u0437\u0432\u0435\u0434\u0435\u043D\u0438\u0435 \u0436\u0434\u0451\u0442 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u0433\u043E \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u0430.",
  interval: "\u0418\u043D\u0442\u0435\u0440\u0432\u0430\u043B \u043F\u043E\u044F\u0432\u043B\u0435\u043D\u0438\u044F",
  intervalHint: "\u041A\u0430\u043A \u0447\u0430\u0441\u0442\u043E \u043A\u0438\u0442 \u0432\u043E\u0437\u0432\u0440\u0430\u0449\u0430\u0435\u0442\u0441\u044F \u0441\u0430\u043C.",
  intervalSeconds: "{seconds} \u0441",
  markSize: "\u0420\u0430\u0437\u043C\u0435\u0440 \u0437\u043D\u0430\u0447\u043A\u0430 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u044F",
  markSizeHint: "\u0420\u0430\u0437\u043C\u0435\u0440 \u0440\u044B\u0431\u043A\u0438 \u0440\u044F\u0434\u043E\u043C \u0441\u043E \u0441\u0442\u0430\u0442\u0443\u0441\u043E\u043C \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u044F.",
  labelSize: "\u0420\u0430\u0437\u043C\u0435\u0440 \u0442\u0435\u043A\u0441\u0442\u0430",
  labelSizeHint: "\u0420\u0430\u0437\u043C\u0435\u0440 \u0442\u0435\u043A\u0441\u0442\u0430 \u0441\u0442\u0430\u0442\u0443\u0441\u0430; \u0432\u044B\u0441\u043E\u0442\u0430 \u0438 \u043E\u0442\u0441\u0442\u0443\u043F\u044B \u0441\u0442\u0440\u043E\u043A\u0438 \u043D\u0435 \u043C\u0435\u043D\u044F\u044E\u0442\u0441\u044F.",
  offsetX: "\u0413\u043E\u0440\u0438\u0437\u043E\u043D\u0442\u0430\u043B\u044C\u043D\u043E\u0435 \u043F\u043E\u043B\u043E\u0436\u0435\u043D\u0438\u0435",
  offsetXHint: "\u041E\u0442\u0440\u0438\u0446\u0430\u0442\u0435\u043B\u044C\u043D\u044B\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u044F \u0441\u0434\u0432\u0438\u0433\u0430\u044E\u0442 \u0432\u043B\u0435\u0432\u043E, \u043F\u043E\u043B\u043E\u0436\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0435 \u2014 \u0432\u043F\u0440\u0430\u0432\u043E.",
  offsetY: "\u0412\u0435\u0440\u0442\u0438\u043A\u0430\u043B\u044C\u043D\u043E\u0435 \u043F\u043E\u043B\u043E\u0436\u0435\u043D\u0438\u0435",
  offsetYHint: "\u041E\u0442\u0440\u0438\u0446\u0430\u0442\u0435\u043B\u044C\u043D\u044B\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u044F \u0441\u0434\u0432\u0438\u0433\u0430\u044E\u0442 \u0432\u0432\u0435\u0440\u0445, \u043F\u043E\u043B\u043E\u0436\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0435 \u2014 \u0432\u043D\u0438\u0437.",
  replaceMark: "\u0417\u0430\u043C\u0435\u043D\u044F\u0442\u044C \u0437\u043D\u0430\u0447\u043E\u043A \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u044F",
  replaceMarkHint: "\u0415\u0441\u043B\u0438 \u0432\u044B\u043A\u043B\u044E\u0447\u0435\u043D\u043E, \u0440\u044F\u0434\u043E\u043C \u0441\u043E \u0441\u0442\u0430\u0442\u0443\u0441\u043E\u043C \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u044F \u0441\u043D\u043E\u0432\u0430 \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442\u0441\u044F \u0438\u0441\u0445\u043E\u0434\u043D\u044B\u0439 \u0445\u0432\u043E\u0441\u0442 \u043A\u0438\u0442\u0430.",
  motion: "\u0410\u043D\u0438\u043C\u0430\u0446\u0438\u044F",
  motionSwim: "\u041F\u043B\u0430\u0432\u0430\u043D\u0438\u0435",
  motionExplore: "\u0418\u0441\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u043D\u0438\u0435",
  motionHero: "\u041A\u0430\u043A \u043D\u0430 \u0441\u0442\u0430\u0440\u0442\u043E\u0432\u043E\u043C \u044D\u043A\u0440\u0430\u043D\u0435",
  motionSway: "\u041C\u044F\u0433\u043A\u043E\u0435 \u043F\u043E\u043A\u0430\u0447\u0438\u0432\u0430\u043D\u0438\u0435",
  swing: "\u0410\u043C\u043F\u043B\u0438\u0442\u0443\u0434\u0430 \u043F\u043E\u043A\u0430\u0447\u0438\u0432\u0430\u043D\u0438\u044F",
  swingHint: "\u041C\u0430\u0441\u0448\u0442\u0430\u0431\u0438\u0440\u0443\u0435\u0442 \u041F\u043B\u0430\u0432\u0430\u043D\u0438\u0435, \u0418\u0441\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u043D\u0438\u0435 \u0438 \u041C\u044F\u0433\u043A\u043E\u0435 \u043F\u043E\u043A\u0430\u0447\u0438\u0432\u0430\u043D\u0438\u0435. \u041A\u0430\u043A \u043D\u0430 \u0441\u0442\u0430\u0440\u0442\u043E\u0432\u043E\u043C \u044D\u043A\u0440\u0430\u043D\u0435 \u043D\u0435 \u043C\u0435\u043D\u044F\u0435\u0442\u0441\u044F.",
  motionHint: "\u041F\u043B\u0430\u0432\u0430\u043D\u0438\u0435 \u0434\u0432\u0438\u0436\u0435\u0442\u0441\u044F \u043A\u0430\u043A \u0443\u0434\u0430\u0440 \u0445\u0432\u043E\u0441\u0442\u0430; \u0418\u0441\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u043D\u0438\u0435 \u043F\u043E\u0434\u043D\u0438\u043C\u0430\u0435\u0442\u0441\u044F \u0438 \u043D\u044B\u0440\u044F\u0435\u0442 \u0432 \u043D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u043E\u0441\u0442\u044C; \u041A\u0430\u043A \u043D\u0430 \u0441\u0442\u0430\u0440\u0442\u043E\u0432\u043E\u043C \u044D\u043A\u0440\u0430\u043D\u0435 \u043F\u043E\u0432\u0442\u043E\u0440\u044F\u0435\u0442 \u043D\u0430\u0432\u0435\u0434\u0435\u043D\u0438\u0435 \u043D\u0430 \u043F\u0443\u0441\u0442\u043E\u0439 \u044D\u043A\u0440\u0430\u043D; \u041C\u044F\u0433\u043A\u043E\u0435 \u043F\u043E\u043A\u0430\u0447\u0438\u0432\u0430\u043D\u0438\u0435 \u043B\u0438\u0448\u044C \u043F\u043B\u0430\u0432\u043D\u043E \u0441\u043C\u0435\u0449\u0430\u0435\u0442\u0441\u044F \u0432 \u0441\u0442\u043E\u0440\u043E\u043D\u044B.",
  markPreviewHint: "\u0414\u0432\u0438\u0436\u0435\u043D\u0438\u0435 \u0440\u044B\u0431\u043A\u0438 \u0432\u043E \u0432\u0440\u0435\u043C\u044F \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u044F \u0437\u0430\u0434\u0430\u0447\u0438.",
  runningLabel: "\u0413\u043B\u0443\u0431\u043E\u043A\u043E\u0435 \u0440\u0430\u0437\u043C\u044B\u0448\u043B\u0435\u043D\u0438\u0435",
  preview: "\u041F\u0440\u043E\u0441\u043C\u043E\u0442\u0440",
  previewHint: "\u0416\u0438\u0432\u043E\u0439 \u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440 \u0432\u044B\u0431\u0440\u0430\u043D\u043D\u043E\u0439 \u0430\u043D\u0438\u043C\u0430\u0446\u0438\u0438.",
  selected: "\u0412\u044B\u0431\u0440\u0430\u043D\u043E",
  version: "v{version}",
  checkUpdate: "\u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u044F",
  checking: "\u041F\u0440\u043E\u0432\u0435\u0440\u043A\u0430\u2026",
  upToDate: "\u0410\u043A\u0442\u0443\u0430\u043B\u044C\u043D\u0430\u044F \u0432\u0435\u0440\u0441\u0438\u044F ({version})",
  updateAvailable: "\u0414\u043E\u0441\u0442\u0443\u043F\u043D\u0430 \u0432\u0435\u0440\u0441\u0438\u044F {version}",
  updateFailed: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u044F. \u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u0435 \u043F\u043E\u0437\u0436\u0435.",
  noRelease: "\u041D\u0430 GitHub \u0435\u0449\u0451 \u043D\u0435\u0442 \u0440\u0435\u043B\u0438\u0437\u0430, \u043F\u043E\u044D\u0442\u043E\u043C\u0443 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u044F \u043F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u043D\u0435\u043B\u044C\u0437\u044F.",
  viewVersion: "\u041E\u0442\u043A\u0440\u044B\u0442\u044C {version}"
};
var pt = {
  nav: "Salto da baleia",
  intro: "Uma baleia que nada: configure o in\xEDcio vazio, as conversas e o \xEDcone de execu\xE7\xE3o aqui.",
  tabBackground: "Fundo",
  tabMark: "\xCDcone de execu\xE7\xE3o",
  groupAppearance: "Apar\xEAncia",
  groupPlayback: "Reprodu\xE7\xE3o",
  groupIcon: "Exibi\xE7\xE3o",
  stageHint: "Pr\xE9via ao vivo",
  color: "Cor",
  colorTheme: "Seguir o tema",
  colorCustom: "Personalizada",
  colorHint: "Siga o tom do texto do tema ou escolha sua pr\xF3pria tinta.",
  size: "Tamanho do fundo",
  sizeHint: "Quanto do fundo a baleia pinta.",
  strength: "Intensidade da tinta",
  strengthHint: "60% \xE9 o padr\xE3o; 100% transforma os pontos t\xEAnues em preto s\xF3lido.",
  auto: "Aparecer nas conversas",
  autoHint: "Depois que uma conversa come\xE7a, a baleia aparece sozinha no intervalo abaixo.",
  playOnSwitch: "Aparecer ao trocar de conversa",
  playOnSwitchHint: "Desativado, entrar numa conversa espera o pr\xF3ximo intervalo em vez de tocar na hora.",
  interval: "Intervalo de apari\xE7\xE3o",
  intervalHint: "Com que frequ\xEAncia a baleia reaparece sozinha.",
  intervalSeconds: "{seconds} s",
  markSize: "Tamanho do \xEDcone de execu\xE7\xE3o",
  markSizeHint: "Tamanho do peixe ao lado do status de execu\xE7\xE3o.",
  labelSize: "Tamanho do texto",
  labelSizeHint: "Tamanho do texto do status; a linha mant\xE9m altura e espa\xE7amento.",
  offsetX: "Posi\xE7\xE3o horizontal",
  offsetXHint: "Valores negativos movem para a esquerda; positivos, para a direita.",
  offsetY: "Posi\xE7\xE3o vertical",
  offsetYHint: "Valores negativos movem para cima; positivos, para baixo.",
  replaceMark: "Substituir o \xEDcone de execu\xE7\xE3o",
  replaceMarkHint: "Desativado, a cauda de baleia original volta ao lado do status de execu\xE7\xE3o.",
  motion: "Anima\xE7\xE3o",
  motionSwim: "Nadar",
  motionExplore: "Explorar",
  motionHero: "Como no in\xEDcio",
  motionSway: "Balan\xE7o suave",
  swing: "Amplitude do balan\xE7o",
  swingHint: "Escala Nadar, Explorar e Balan\xE7o suave. Como no in\xEDcio mant\xE9m o movimento original.",
  motionHint: "Nadar avan\xE7a como um golpe de cauda; Explorar sobe e mergulha no desconhecido; Como no in\xEDcio imita passar o cursor no in\xEDcio vazio; Balan\xE7o suave apenas flutua de um lado para o outro.",
  markPreviewHint: "Movimento do peixe enquanto uma tarefa est\xE1 em andamento.",
  runningLabel: "Racioc\xEDnio profundo",
  preview: "Pr\xE9via",
  previewHint: "Pr\xE9via ao vivo da anima\xE7\xE3o escolhida.",
  selected: "Selecionado",
  version: "v{version}",
  checkUpdate: "Verificar atualiza\xE7\xF5es",
  checking: "Verificando\u2026",
  upToDate: "J\xE1 est\xE1 atualizado ({version})",
  updateAvailable: "A vers\xE3o {version} est\xE1 dispon\xEDvel",
  updateFailed: "Falha ao verificar atualiza\xE7\xF5es. Tente novamente mais tarde.",
  noRelease: "Ainda n\xE3o h\xE1 uma vers\xE3o publicada no GitHub; n\xE3o \xE9 poss\xEDvel verificar atualiza\xE7\xF5es.",
  viewVersion: "Ver {version}"
};
var DICTIONARIES = { zh, en, ja, es, fr, de, ru, pt };

// src/client/settings/SettingsPage.tsx
var import_react2 = require("react");

// shared/settings.js
var SETTINGS_NAMESPACE = "whale-leap";
var COLOR_MODES = ["theme", "custom"];
var SIZE_RANGE = { min: 0.5, max: 1.5, step: 0.05 };
var OPACITY_RANGE = { min: 0.1, max: 1, step: 0.05 };
var INTERVAL_RANGE = { min: 5, max: 300, step: 5 };
var MARK_SIZE_RANGE = { min: 8, max: 28, step: 1 };
var MARK_LABEL_SIZE_RANGE = { min: 11, max: 20, step: 1 };
var MARK_SWING_RANGE = { min: 0.5, max: 2, step: 0.1 };
var MARK_OFFSET_RANGE = { min: -12, max: 12, step: 0.5 };
var MARK_MOTIONS = ["swim", "explore", "hero", "sway"];
var CUSTOM_COLOR_PATTERN = /^#[0-9a-f]{6}$/;
var DEFAULT_SETTINGS = {
  colorMode: "theme",
  customColor: "#7d9bff",
  size: 1,
  opacity: 0.6,
  autoAppear: false,
  playOnSwitch: true,
  intervalSeconds: 30,
  replaceMark: true,
  markSize: 14,
  markLabelSize: 12,
  markSwing: 1,
  markOffsetX: 0,
  markOffsetY: 0,
  markMotion: "swim"
};

// src/client/whale/artwork.ts
var WHALE_ARTWORK = {
  activeOpacity: 0.65,
  fontSize: 7,
  phrases: [
    "// Everything is a plugin",
    "ctx.plugin(Agent)",
    "await agent.run()",
    'ctx.on("turn/end", next)',
    "const tools = ctx.tools",
    "await session.append(event)",
    "return next()",
    "ctx.effect(() => dispose)",
    "const { skills } = ctx",
    "yield tool.result",
    "type Context = Harness",
    "MCP.connect()",
    "useSession()",
    "const workspace = cwd",
    "await runtime.start()",
    "// Creator Mode"
  ],
  frameRate: 24,
  rippleDurationMs: 5700,
  scale: 1
};

// src/client/whale/code-fill.ts
var LETTERING_SCALE = 1.43;
var LETTERING_WEIGHT = 700;
var LETTERING_PASSES = 3;
var LINE_STEP = 1;
var WORD_GAP_MIN = 0.1;
var MASK_GAIN = 2.2;
var REFERENCE_WIDTH = 1200;
function createCodeFill(options, atlas) {
  const lettering = document.createElement("canvas");
  const mask = document.createElement("canvas");
  const ink = lettering.getContext("2d");
  const matte = mask.getContext("2d");
  if (ink === null || matte === null) return void 0;
  mask.width = atlas.width;
  mask.height = atlas.height;
  const alpha = matte.createImageData(atlas.width, atlas.height);
  const stride = atlas.width * atlas.columns;
  function opacity(pixels, frame, x, y) {
    const offsetX = frame % atlas.columns * atlas.width;
    const offsetY = Math.floor(frame / atlas.columns) * atlas.height;
    return pixels[((offsetY + y) * stride + offsetX + x) * 4 + 1];
  }
  return {
    resize(canvas, width) {
      const height = width * atlas.height / atlas.width;
      const dpr = Math.min(devicePixelRatio, 2);
      lettering.width = Math.ceil(width * dpr);
      lettering.height = Math.ceil(height * dpr);
      ink.setTransform(dpr, 0, 0, dpr, 0, 0);
      const style = getComputedStyle(canvas);
      ink.fillStyle = style.getPropertyValue("--home-whale-code-ink");
      const size = options.fontSize * LETTERING_SCALE * (width / REFERENCE_WIDTH);
      ink.font = `${LETTERING_WEIGHT} ${size}px ${style.fontFamily}`;
      ink.textBaseline = "middle";
      let seed = 2654435769;
      const random = () => {
        seed = Math.imul(seed, 1664525) + 1013904223 >>> 0;
        return seed / 4294967296;
      };
      const words = [];
      for (let y = size; y < height; y += size * LINE_STEP) {
        for (let x = -random() * size * 10; x < width; ) {
          const text = options.phrases[Math.floor(random() * options.phrases.length)];
          const room = ink.measureText(text).width;
          words.push({ text, x, y });
          x += room + size * (WORD_GAP_MIN + random() * 0.65);
        }
      }
      for (let pass = 0; pass < LETTERING_PASSES; pass++) {
        for (const word of words) {
          ink.fillText(word.text, word.x, word.y);
        }
      }
      ink.globalAlpha = 1;
    },
    paint(ctx, pixels, frame, left, top, width, level) {
      for (let y = 0; y < atlas.height; y++) {
        for (let x = 0; x < atlas.width; x++) {
          alpha.data[(y * atlas.width + x) * 4 + 3] = Math.min(255, opacity(pixels, frame, x, y) * MASK_GAIN);
        }
      }
      matte.putImageData(alpha, 0, 0);
      const height = width * atlas.height / atlas.width;
      ctx.globalAlpha = level;
      ctx.drawImage(lettering, left, top, width, height);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "destination-in";
      ctx.drawImage(mask, left, top, width, height);
      ctx.globalCompositeOperation = "source-over";
    },
    dispose() {
      lettering.width = lettering.height = mask.width = mask.height = 0;
    }
  };
}

// src/client/whale/renderer.ts
var ATLAS = { width: 192, height: 108, columns: 12, frames: 137 };
var INK_GAIN = 1.5;
var atlasCache = /* @__PURE__ */ new Map();
var MAX_CANVAS_PIXELS = 5e6;
var NO_WHALE = {
  play: () => {
  },
  prefetch: () => {
  },
  update: () => {
  },
  setAutoPlay: () => {
  },
  dispose: () => {
  }
};
function attachPixelWhale(canvas, options, atlasUrl) {
  const context = canvas.getContext("2d");
  if (context === null) return NO_WHALE;
  const ctx = context;
  const image = new Image();
  const media = matchMedia("(prefers-reduced-motion: reduce)");
  let artwork = options;
  let pixels;
  let started;
  let loading = false;
  let wanted = false;
  let disposed = false;
  let failed = false;
  let visible = true;
  let frame = 0;
  let layoutFrame = 0;
  let last = -Infinity;
  let width = 0;
  let height = 0;
  let lastWidth = -1;
  let lastHeight = -1;
  let lastColor = "";
  let sceneWidth = 0;
  let left = 0;
  let top = 0;
  let fill = "code";
  let code;
  let autoInterval;
  let autoTimer;
  const moving = () => !media.matches;
  const drawable = () => !disposed && !document.hidden && visible && width > 0 && height > 0;
  function clear() {
    ctx.clearRect(0, 0, width, height);
  }
  function stop() {
    cancelAnimationFrame(frame);
    frame = 0;
    started = void 0;
    clear();
  }
  function fail(error) {
    if (disposed) return;
    failed = true;
    stop();
    console.warn("Home whale animation is unavailable; home remains usable. Reload the page to retry.", error);
  }
  function paint(now) {
    clear();
    if (pixels === void 0 || started === void 0) return;
    const progress = (now - started) / artwork.rippleDurationMs;
    if (progress >= 1) {
      started = void 0;
      return;
    }
    const index = Math.floor(progress * ATLAS.frames);
    const offsetX = index % ATLAS.columns * ATLAS.width;
    const offsetY = Math.floor(index / ATLAS.columns) * ATLAS.height;
    const stride = ATLAS.width * ATLAS.columns;
    const cell = sceneWidth / ATLAS.width;
    const fade = Math.min(1, progress * 15, (1 - progress) * 10);
    if (fill === "code" && code !== void 0) {
      code.paint(ctx, pixels, index, left, top, sceneWidth, artwork.activeOpacity * fade);
      return;
    }
    for (let y = 0; y < ATLAS.height; y++) {
      for (let x = 0; x < ATLAS.width; x++) {
        const offset = ((offsetY + y) * stride + offsetX + x) * 4;
        const alpha = pixels[offset + 1] / 255;
        if (alpha < 0.015) continue;
        ctx.globalAlpha = Math.min(1, alpha * artwork.activeOpacity * artwork.activeOpacity * INK_GAIN * fade);
        ctx.beginPath();
        ctx.arc(left + (x + 0.5) * cell, top + (y + 0.5) * cell, pixels[offset] / 255 * cell, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }
  function tick(now) {
    frame = 0;
    if (!drawable()) return;
    if (!moving()) {
      stop();
      return;
    }
    if (now - last + 0.5 >= 1e3 / artwork.frameRate) {
      paint(now);
      last = now;
    }
    if (started !== void 0) frame = requestAnimationFrame(tick);
  }
  function resume() {
    cancelAnimationFrame(frame);
    frame = 0;
    if (disposed) return;
    if (!moving()) {
      stop();
      return;
    }
    if (!drawable()) return;
    paint(performance.now());
    last = performance.now();
    if (started !== void 0) frame = requestAnimationFrame(tick);
  }
  function resize() {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    const requested = Math.min(devicePixelRatio, 2);
    const dpr = Math.min(requested, Math.sqrt(MAX_CANVAS_PIXELS / Math.max(1, width * height)));
    const pixelWidth = Math.round(width * dpr);
    const pixelHeight = Math.round(height * dpr);
    const nextSceneWidth = Math.min(Math.max(width * 0.94, 720), height * 1.6, 1120) * 1.12 * artwork.scale;
    const nextColor = getComputedStyle(canvas).color;
    if (width === lastWidth && height === lastHeight && nextColor === lastColor && nextSceneWidth === sceneWidth) return;
    lastColor = nextColor;
    lastWidth = width;
    lastHeight = height;
    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = nextColor;
    sceneWidth = nextSceneWidth;
    const sceneHeight = sceneWidth * ATLAS.height / ATLAS.width;
    left = (width - sceneWidth) / 2;
    top = height * 0.43 - sceneHeight / 2;
    if (code !== void 0 && sceneWidth > 0) code.resize(canvas, sceneWidth);
    resume();
  }
  function scheduleResize() {
    if (disposed || layoutFrame !== 0) return;
    layoutFrame = requestAnimationFrame(() => {
      layoutFrame = 0;
      resize();
    });
  }
  function begin() {
    if (!moving() || !drawable()) return;
    if (fill === "pixels") {
      code ??= createCodeFill(artwork, ATLAS);
      if (code === void 0) {
        fail(new Error("Home whale code Canvas context is unavailable"));
        return;
      }
      code.resize(canvas, sceneWidth);
    }
    fill = fill === "pixels" ? "code" : "pixels";
    started = performance.now();
    resume();
  }
  image.onload = () => {
    if (disposed) return;
    const source = document.createElement("canvas");
    source.width = image.naturalWidth;
    source.height = image.naturalHeight;
    try {
      if (source.width !== ATLAS.width * ATLAS.columns || source.height !== ATLAS.height * Math.ceil(ATLAS.frames / ATLAS.columns)) {
        throw new Error("Home whale atlas dimensions do not match its frame geometry");
      }
      const reader = source.getContext("2d");
      if (reader === null) {
        fail(new Error("Home whale atlas Canvas context is unavailable"));
        return;
      }
      reader.drawImage(image, 0, 0);
      pixels = reader.getImageData(0, 0, source.width, source.height).data;
      atlasCache.set(atlasUrl, pixels);
    } catch (error) {
      fail(error);
      return;
    } finally {
      source.width = source.height = 0;
      image.removeAttribute("src");
    }
    loading = false;
    if (!wanted) return;
    wanted = false;
    begin();
  };
  image.onerror = () => {
    fail(new Error("Home whale atlas could not be decoded"));
  };
  function play() {
    if (failed || !moving() || !drawable() || started !== void 0) return;
    if (pixels !== void 0) {
      begin();
      return;
    }
    if (loading) {
      wanted = true;
      return;
    }
    loading = true;
    wanted = true;
    image.src = atlasUrl;
  }
  function prefetch() {
    if (disposed || failed || pixels !== void 0 || !moving()) return;
    const cached = atlasCache.get(atlasUrl);
    if (cached !== void 0) {
      pixels = cached;
      return;
    }
    if (loading) return;
    loading = true;
    image.src = atlasUrl;
  }
  function update(next) {
    if (disposed) return;
    artwork = next;
    resize();
  }
  function setAutoPlay(intervalMs, playNow = true) {
    if (disposed) return;
    const next = intervalMs === void 0 || intervalMs <= 0 ? void 0 : intervalMs;
    if (autoTimer !== void 0) {
      clearInterval(autoTimer);
      autoTimer = void 0;
    }
    const enabling = next !== void 0 && autoInterval === void 0;
    autoInterval = next;
    if (next === void 0) return;
    if (enabling && playNow) play();
    autoTimer = setInterval(play, next);
  }
  const sizeObserver = new ResizeObserver(scheduleResize);
  const visibilityObserver = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? false;
    resume();
  });
  const themeObserver = new MutationObserver(scheduleResize);
  sizeObserver.observe(canvas);
  visibilityObserver.observe(canvas);
  themeObserver.observe(document.body, { attributes: true, attributeFilter: ["data-ds-dark-theme", "style"] });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-ds-theme-source", "style"] });
  document.addEventListener("visibilitychange", resume);
  media.addEventListener("change", resume);
  resize();
  const dispose = () => {
    disposed = true;
    stop();
    if (autoTimer !== void 0) {
      clearInterval(autoTimer);
      autoTimer = void 0;
    }
    autoInterval = void 0;
    cancelAnimationFrame(layoutFrame);
    layoutFrame = 0;
    image.onload = image.onerror = null;
    image.removeAttribute("src");
    pixels = void 0;
    code?.dispose();
    code = void 0;
    sizeObserver.disconnect();
    visibilityObserver.disconnect();
    themeObserver.disconnect();
    document.removeEventListener("visibilitychange", resume);
    media.removeEventListener("change", resume);
  };
  return { play, prefetch, update, setAutoPlay, dispose };
}

// src/client/whale/WhaleMarkFish.tsx
var import_react = require("react");

// src/client/whale/fish-paths.ts
var FISH_LOGO_VIEWBOX = { width: 23.16, height: 17.04 };
var FISH_LOGO_PATH = "M22.9168 1.43018C22.6713 1.31018 22.5658 1.53918 22.4223 1.65519C22.3733 1.69269 22.3318 1.74169 22.2903 1.78669C21.9317 2.1697 21.5127 2.42121 20.9657 2.39121C20.1657 2.34621 19.4827 2.59771 18.8787 3.20973C18.7502 2.45521 18.3236 2.0047 17.6746 1.71569C17.3351 1.56568 16.9916 1.41518 16.7536 1.08867C16.5876 0.856163 16.5421 0.597155 16.4591 0.341647C16.4061 0.187643 16.3536 0.0301382 16.1761 0.00363739C15.9836 -0.0263635 15.9081 0.135141 15.8326 0.270145C15.5306 0.822162 15.4136 1.43018 15.4251 2.0462C15.4516 3.43174 16.0366 4.53527 17.1991 5.3203C17.3311 5.4103 17.3651 5.5003 17.3236 5.63181C17.2441 5.90231 17.1501 6.16482 17.0671 6.43533C17.0141 6.60784 16.9351 6.64584 16.7501 6.57033C16.1121 6.30383 15.5611 5.90931 15.074 5.4328C14.2475 4.63328 13.5 3.75075 12.568 3.05973C12.349 2.89822 12.13 2.74822 11.9034 2.60522C10.9524 1.68169 12.028 0.923165 12.277 0.833162C12.5375 0.739159 12.3675 0.41615 11.5259 0.42015C10.6844 0.42365 9.91439 0.705658 8.93286 1.08117C8.78935 1.13767 8.63835 1.17867 8.48384 1.21267C7.59332 1.04367 6.66829 1.00617 5.70226 1.11517C3.88321 1.31768 2.43016 2.1777 1.36213 3.64575C0.0790928 5.4103 -0.222916 7.41536 0.146595 9.50642C0.535106 11.7105 1.66014 13.535 3.38869 14.9616C5.18125 16.4406 7.24581 17.1657 9.60138 17.0266C11.0319 16.9441 12.6245 16.7526 14.421 15.2321C14.874 15.4576 15.3496 15.5476 16.1381 15.6151C16.7456 15.6716 17.3306 15.5851 17.7836 15.4911C18.4931 15.3411 18.4441 14.6841 18.1876 14.5636C16.1081 13.595 16.5646 13.9891 16.1496 13.67C17.2061 12.42 18.8202 10.1979 19.3182 7.17235C19.3672 6.83834 19.4297 6.36783 19.4222 6.09732C19.4182 5.93231 19.4562 5.86831 19.6447 5.84931C20.1657 5.78931 20.6712 5.64681 21.1357 5.3913C22.4833 4.65528 23.0268 3.44624 23.1548 1.9972C23.1738 1.77569 23.1508 1.54668 22.9168 1.43018ZM11.1749 14.4736C9.15936 12.889 8.18184 12.3675 7.77832 12.39C7.40081 12.4125 7.46881 12.8445 7.55182 13.126C7.63882 13.404 7.75182 13.5955 7.91033 13.8396C8.01983 14.0011 8.09533 14.2411 7.80083 14.4216C7.15181 14.8231 6.02327 14.2866 5.97027 14.2601C4.65673 13.4865 3.5587 12.4655 2.78467 11.069C2.03715 9.72493 1.60314 8.28289 1.53164 6.74384C1.51264 6.37233 1.62214 6.24082 1.99215 6.17332C2.47916 6.08332 2.98118 6.06432 3.46769 6.13582C5.52476 6.43633 7.27581 7.35586 8.74385 8.8129C9.58188 9.64243 10.2159 10.634 10.8689 11.6025C11.5634 12.631 12.3105 13.611 13.262 14.4146C13.598 14.6961 13.866 14.9101 14.1225 15.0681C13.349 15.1546 12.058 15.1731 11.1749 14.4746L11.1749 14.4736ZM12.141 8.25988C12.141 8.09488 12.273 7.96338 12.439 7.96338C12.4765 7.96338 12.5105 7.97088 12.541 7.98188C12.5825 7.99688 12.6205 8.01938 12.6505 8.05338C12.7035 8.10588 12.7335 8.18088 12.7335 8.25988C12.7335 8.42489 12.6015 8.55639 12.4355 8.55639C12.2695 8.55639 12.141 8.42489 12.141 8.25988ZM15.1415 9.79893C14.949 9.87793 14.7565 9.94544 14.5715 9.95294C14.2845 9.96794 13.9715 9.85143 13.8015 9.70893C13.5375 9.48742 13.3485 9.36342 13.2695 8.97691C13.2355 8.8119 13.2545 8.55639 13.2845 8.40989C13.3525 8.09438 13.277 7.89187 13.0545 7.70787C12.8735 7.55786 12.643 7.51636 12.39 7.51636C12.2955 7.51636 12.209 7.47486 12.1445 7.44136C12.039 7.38886 11.9519 7.25735 12.035 7.09585C12.0615 7.04335 12.19 6.91584 12.22 6.89334C12.5635 6.69784 12.9595 6.76184 13.326 6.90834C13.6655 7.04735 13.9225 7.30236 14.292 7.66287C14.6695 8.09838 14.7375 8.21838 14.9525 8.54539C15.1225 8.8009 15.277 9.06341 15.3831 9.36392C15.4471 9.55142 15.3641 9.70493 15.1415 9.79893Z";
var FISH_SWIM_UP_PATH = "M22.403 0.567C22.145 0.477 22.068 0.718 21.939 0.85C21.895 0.893 21.86 0.947 21.824 0.997C21.515 1.421 21.13 1.721 20.591 1.77C19.829 1.867 19.221 2.244 18.712 2.958C18.535 2.227 18.116 1.839 17.516 1.626C17.203 1.506 16.887 1.379 16.663 1.064C16.508 0.839 16.462 0.581 16.383 0.329C16.332 0.176 16.283 0.02 16.121 -0.002C15.944 -0.029 15.875 0.133 15.805 0.269C15.52 0.822 15.408 1.43 15.42 2.046C15.449 3.432 16.031 4.532 17.202 5.274C17.337 5.356 17.374 5.445 17.335 5.582C17.261 5.862 17.169 6.134 17.086 6.413C17.032 6.59 16.952 6.63 16.764 6.558C16.118 6.301 15.562 5.909 15.074 5.433C14.248 4.633 13.5 3.751 12.568 3.06C12.349 2.898 12.13 2.748 11.903 2.605C10.952 1.682 12.028 0.923 12.277 0.833C12.537 0.739 12.367 0.416 11.526 0.42C10.684 0.424 9.914 0.706 8.933 1.081C8.789 1.138 8.638 1.179 8.484 1.213C7.593 1.044 6.668 1.006 5.702 1.115C3.883 1.318 2.43 2.178 1.362 3.646C0.079 5.41 -0.223 7.415 0.147 9.506C0.535 11.71 1.66 13.535 3.389 14.962C5.181 16.441 7.246 17.166 9.601 17.027C11.032 16.944 12.624 16.753 14.421 15.232C14.874 15.458 15.35 15.548 16.138 15.615C16.746 15.672 17.331 15.585 17.784 15.491C18.493 15.341 18.444 14.684 18.188 14.564C16.108 13.595 16.565 13.989 16.15 13.67C17.206 12.42 18.82 10.198 19.363 7.086C19.421 6.709 19.484 6.171 19.469 5.866C19.458 5.681 19.493 5.604 19.681 5.556C20.199 5.412 20.691 5.172 21.125 4.806C22.366 3.824 22.758 2.554 22.708 1.1C22.7 0.878 22.649 0.654 22.403 0.567ZM11.175 14.451C9.159 12.726 8.182 12.088 7.778 12.067C7.401 12.047 7.469 12.505 7.552 12.807C7.639 13.103 7.752 13.313 7.91 13.581C8.02 13.758 8.095 14.01 7.801 14.16C7.152 14.487 6.023 13.806 5.97 13.772C4.657 12.85 3.559 11.766 2.785 10.369C2.037 9.025 1.603 7.583 1.532 6.044C1.513 5.672 1.622 5.541 1.992 5.473C2.479 5.383 2.981 5.364 3.468 5.436C5.525 5.736 7.276 6.675 8.744 8.323C9.582 9.299 10.216 10.425 10.869 11.496C11.563 12.592 12.31 13.603 13.262 14.414C13.598 14.696 13.866 14.91 14.123 15.068C13.349 15.154 12.058 15.167 11.175 14.452L11.175 14.451ZM12.141 8.26C12.141 8.095 12.273 7.963 12.439 7.963C12.476 7.963 12.511 7.971 12.541 7.982C12.582 7.997 12.62 8.019 12.65 8.053C12.704 8.106 12.733 8.181 12.733 8.26C12.733 8.425 12.601 8.556 12.435 8.556C12.27 8.556 12.141 8.425 12.141 8.26ZM15.142 9.799C14.949 9.878 14.757 9.945 14.572 9.953C14.284 9.968 13.972 9.851 13.802 9.709C13.537 9.487 13.348 9.363 13.27 8.977C13.236 8.812 13.255 8.556 13.284 8.41C13.352 8.094 13.277 7.892 13.055 7.708C12.873 7.558 12.643 7.516 12.39 7.516C12.296 7.516 12.209 7.475 12.145 7.441C12.039 7.389 11.952 7.257 12.035 7.096C12.062 7.043 12.19 6.916 12.22 6.893C12.563 6.698 12.96 6.762 13.326 6.908C13.665 7.047 13.922 7.302 14.292 7.663C14.669 8.098 14.738 8.218 14.953 8.545C15.123 8.801 15.277 9.063 15.383 9.364C15.447 9.551 15.364 9.705 15.142 9.799Z";
var FISH_SWIM_DOWN_PATH = "M23.271 2.216C23.039 2.071 22.91 2.287 22.755 2.388C22.703 2.42 22.656 2.464 22.61 2.505C22.214 2.848 21.771 3.054 21.225 2.956C20.412 2.784 19.68 2.919 19.005 3.435C18.92 2.663 18.493 2.157 17.808 1.798C17.446 1.621 17.08 1.449 16.83 1.111C16.656 0.872 16.611 0.612 16.524 0.354C16.469 0.198 16.414 0.039 16.223 0.009C16.017 -0.024 15.936 0.137 15.856 0.271C15.539 0.822 15.418 1.43 15.429 2.046C15.454 3.432 16.041 4.538 17.196 5.36C17.325 5.456 17.356 5.547 17.312 5.674C17.229 5.936 17.134 6.191 17.051 6.454C16.999 6.623 16.921 6.659 16.738 6.58C16.107 6.306 15.56 5.909 15.074 5.433C14.248 4.633 13.5 3.751 12.568 3.06C12.349 2.898 12.13 2.748 11.903 2.605C10.952 1.682 12.028 0.923 12.277 0.833C12.537 0.739 12.367 0.416 11.526 0.42C10.684 0.424 9.914 0.706 8.933 1.081C8.789 1.138 8.638 1.179 8.484 1.213C7.593 1.044 6.668 1.006 5.702 1.115C3.883 1.318 2.43 2.178 1.362 3.646C0.079 5.41 -0.223 7.415 0.147 9.506C0.535 11.71 1.66 13.535 3.389 14.962C5.181 16.441 7.246 17.166 9.601 17.027C11.032 16.944 12.624 16.753 14.421 15.232C14.874 15.458 15.35 15.548 16.138 15.615C16.746 15.672 17.331 15.585 17.784 15.491C18.493 15.341 18.444 14.684 18.188 14.564C16.108 13.595 16.565 13.989 16.15 13.67C17.206 12.42 18.82 10.198 19.278 7.246C19.318 6.948 19.375 6.534 19.371 6.293C19.371 6.145 19.411 6.092 19.597 6.098C20.113 6.109 20.619 6.051 21.096 5.891C22.503 5.375 23.169 4.232 23.448 2.804C23.49 2.586 23.491 2.356 23.271 2.216ZM11.175 14.49C9.159 13.005 8.182 12.567 7.778 12.621C7.401 12.673 7.469 13.087 7.552 13.354C7.639 13.619 7.752 13.797 7.91 14.024C8.02 14.175 8.095 14.406 7.801 14.609C7.152 15.063 6.023 14.63 5.97 14.609C4.657 13.941 3.559 12.965 2.785 11.569C2.037 10.225 1.603 8.783 1.532 7.244C1.513 6.872 1.622 6.741 1.992 6.673C2.479 6.583 2.981 6.564 3.468 6.636C5.525 6.936 7.276 7.843 8.744 9.163C9.582 9.888 10.216 10.783 10.869 11.679C11.563 12.659 12.31 13.617 13.262 14.415C13.598 14.696 13.866 14.91 14.123 15.068C13.349 15.155 12.058 15.177 11.175 14.491L11.175 14.49ZM12.141 8.26C12.141 8.095 12.273 7.963 12.439 7.963C12.476 7.963 12.511 7.971 12.541 7.982C12.582 7.997 12.62 8.019 12.65 8.053C12.704 8.106 12.733 8.181 12.733 8.26C12.733 8.425 12.601 8.556 12.435 8.556C12.27 8.556 12.141 8.425 12.141 8.26ZM15.142 9.799C14.949 9.878 14.757 9.945 14.572 9.953C14.284 9.968 13.972 9.851 13.802 9.709C13.537 9.487 13.348 9.363 13.27 8.977C13.236 8.812 13.255 8.556 13.284 8.41C13.352 8.094 13.277 7.892 13.055 7.708C12.873 7.558 12.643 7.516 12.39 7.516C12.296 7.516 12.209 7.475 12.145 7.441C12.039 7.389 11.952 7.257 12.035 7.096C12.062 7.043 12.19 6.916 12.22 6.893C12.563 6.698 12.96 6.762 13.326 6.908C13.665 7.047 13.922 7.302 14.292 7.663C14.669 8.098 14.738 8.218 14.953 8.545C15.123 8.801 15.277 9.063 15.383 9.364C15.447 9.551 15.364 9.705 15.142 9.799Z";

// src/client/whale/running-mark.module.css
var css = { "offset": "offset_ad29e33", "mark": "mark_ad29e33", "svg": "svg_ad29e33" };
var sheet = document.createElement("style");
sheet.dataset.pluginCss = "whale-leap";
sheet.textContent = "/* Start-position offset: shifts the whole mark without touching its internal\n   animation, so users can align the fish with the running label. Inline custom\n   properties carry the two offsets; sway stays on the inner element. */\n.offset_ad29e33 {\n  display: inline-flex;\n  transform: translate(var(--wl-offset-x, 0px), var(--wl-offset-y, 0px));\n}\n\n/* The fish box sizes to the configured icon; the fish keeps its own viewBox ratio\n   inside it and inherits the status color. The padding is the room the motion\n   needs inside the clipped icon frame: without it the fish would drift past the\n   frame and its leading edge would be cut off. */\n.mark_ad29e33 {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  /* Inline width/height are the drawn size; the transparent padding enlarges\n     only the animation room, not the fish. */\n  box-sizing: content-box;\n  padding: 2px;\n  color: inherit;\n}\n\n.svg_ad29e33 {\n  display: block;\n  width: 100%;\n  height: 100%;\n  /* The swim morph's curves poke slightly past the viewBox edges, so the hero\n     does not clip it either. */\n  overflow: visible;\n  transform-origin: 50% 60%;\n}\n\n/* The four motion presets. All of them keep the SMIL body morph; each preset\n   only changes how the fish travels:\n   - swim    drifts forward and back while the nose yaws, so it reads as swimming;\n   - explore searches ahead: rises toward the next idea, noses down, then levels;\n   - hero    replays the blank home's hover swim keys, 1.6 s ease-in-out;\n   - sway    floats gently side to side, dipping slightly at the center. */\n\n/* Side-to-side float (sway preset). Starting and ending at the same extreme\n   keeps the loop seamless; easing only at the extremes means no stall at the\n   center. --wl-swing scales the horizontal travel from the settings page. */\n@keyframes whale-mark-sway {\n  0% {\n    transform: translate3d(calc(var(--wl-swing, 1) * -0.9px), 0, 0) rotate(-1.4deg);\n  }\n\n  50% {\n    transform: translate3d(calc(var(--wl-swing, 1) * 0.9px), -0.3px, 0) rotate(1.4deg);\n  }\n\n  100% {\n    transform: translate3d(calc(var(--wl-swing, 1) * -0.9px), 0, 0) rotate(-1.4deg);\n  }\n}\n\n/* Swimming drift (swim preset): a slow body travel with the nose yawing at a\n   different period, so the combined path never repeats as a flat side swing. */\n@keyframes whale-mark-drift {\n  0%,\n  100% {\n    transform: translate3d(calc(var(--wl-swing, 1) * -1.2px), 0.18px, 0);\n  }\n\n  50% {\n    transform: translate3d(calc(var(--wl-swing, 1) * 1.2px), -0.18px, 0);\n  }\n}\n\n@keyframes whale-mark-yaw {\n  0%,\n  100% {\n    transform: rotate(-1.8deg);\n  }\n\n  50% {\n    transform: rotate(1.8deg);\n  }\n}\n\n/* Explore (explore preset): the fish noses up toward the unknown, dips while\n   searching, then glides level again before the loop restarts. */\n@keyframes whale-mark-explore {\n  0%,\n  100% {\n    transform: translate3d(calc(var(--wl-swing, 1) * -1.2px), 0.4px, 0) rotate(-1.2deg);\n  }\n\n  32% {\n    transform: translate3d(calc(var(--wl-swing, 1) * 1.8px), -1.2px, 0) rotate(-3.6deg);\n  }\n\n  64% {\n    transform: translate3d(calc(var(--wl-swing, 1) * 2.2px), -0.2px, 0) rotate(2.6deg);\n  }\n}\n\n/* Home-hero swim (hero preset): the exact keys the blank home plays on hover. */\n@keyframes whale-mark-hero {\n  0%,\n  100% {\n    transform: none;\n  }\n\n  35% {\n    transform: rotate(-4deg) translate(-0.4px, -0.9px);\n  }\n\n  70% {\n    transform: rotate(1.6deg) translate(0.3px, 0.2px);\n  }\n}\n\n@media (prefers-reduced-motion: no-preference) {\n  .mark_ad29e33[data-motion='swim'] {\n    animation: whale-mark-drift 3.2s ease-in-out infinite;\n  }\n\n  .mark_ad29e33[data-motion='swim'] .svg_ad29e33[data-swimming] {\n    animation: whale-mark-yaw 1.6s ease-in-out infinite;\n  }\n\n  .mark_ad29e33[data-motion='explore'] .svg_ad29e33[data-swimming] {\n    animation: whale-mark-explore 4.2s ease-in-out infinite;\n  }\n\n  .mark_ad29e33[data-motion='hero'] .svg_ad29e33[data-swimming] {\n    animation: whale-mark-hero 1.6s ease-in-out infinite;\n  }\n\n  .mark_ad29e33[data-motion='sway'] .svg_ad29e33[data-swimming] {\n    animation: whale-mark-sway 2.6s ease-in-out infinite;\n  }\n}\n";
document.head.appendChild(sheet);
var running_mark_default = css;

// src/client/whale/WhaleMarkFish.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function prefersReducedMotion() {
  return typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function WhaleMarkFish({ size, motion, swing = 1, offsetX = 0, offsetY = 0 }) {
  const [swimming, setSwimming] = (0, import_react.useState)(() => !prefersReducedMotion());
  (0, import_react.useEffect)(() => {
    if (typeof matchMedia !== "function") return;
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setSwimming(!query.matches);
    };
    sync();
    query.addEventListener("change", sync);
    return () => {
      query.removeEventListener("change", sync);
    };
  }, []);
  const values = `${FISH_LOGO_PATH};${FISH_SWIM_UP_PATH};${FISH_LOGO_PATH};${FISH_SWIM_DOWN_PATH};${FISH_LOGO_PATH}`;
  const style = {
    width: size,
    height: size,
    "--wl-swing": String(swing)
  };
  const offsetStyle = {
    "--wl-offset-x": `${offsetX}px`,
    "--wl-offset-y": `${offsetY}px`
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: running_mark_default.offset, style: offsetStyle, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: running_mark_default.mark, "data-motion": motion, style, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "svg",
    {
      className: running_mark_default.svg,
      "data-swimming": swimming ? "" : void 0,
      viewBox: `0 0 ${FISH_LOGO_VIEWBOX.width} ${FISH_LOGO_VIEWBOX.height}`,
      fill: "none",
      "aria-hidden": "true",
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: FISH_LOGO_PATH, fill: "currentColor", children: swimming && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "animate",
        {
          attributeName: "d",
          values,
          keyTimes: "0;0.35;0.55;0.75;1",
          calcMode: "spline",
          keySplines: "0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1",
          dur: "1.6s",
          repeatCount: "indefinite"
        }
      ) })
    }
  ) }) });
}

// src/client/version.ts
var PLUGIN_VERSION = true ? "0.4.6" : "0.0.0";

// src/client/update.ts
var REPOSITORY = "yingyu4451/dsh-whale-leap";
var RELEASES_URL = `https://github.com/${REPOSITORY}/releases`;
var API = `https://api.github.com/repos/${REPOSITORY}`;
var TIMEOUT_MS = 8e3;
var VERSION_PATTERN = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;
function compareVersions(left, right) {
  const [leftCore, leftPre] = left.split("-", 2);
  const [rightCore, rightPre] = right.split("-", 2);
  const leftParts = leftCore.split(".").map(Number);
  const rightParts = rightCore.split(".").map(Number);
  for (let index = 0; index < 3; index += 1) {
    const delta = (leftParts[index] ?? 0) - (rightParts[index] ?? 0);
    if (delta !== 0) return delta;
  }
  if (leftPre === void 0 && rightPre === void 0) return 0;
  if (leftPre === void 0) return 1;
  if (rightPre === void 0) return -1;
  return leftPre.localeCompare(rightPre);
}
async function probe(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => {
    controller.abort();
  }, TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { accept: "application/vnd.github+json" }
    });
    if (response.status === 404) return { missing: true };
    if (!response.ok) return { error: `HTTP ${response.status}` };
    return { body: await response.json() };
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) };
  } finally {
    clearTimeout(timer);
  }
}
function tagVersion(tag) {
  const version = tag.replace(/^v/iu, "");
  return VERSION_PATTERN.test(version) ? version : void 0;
}
async function latestRelease() {
  const release = await probe(`${API}/releases/latest`);
  if (release.missing !== true && release.error === void 0) {
    const body = release.body;
    const tag = typeof body === "object" && body !== null ? body : void 0;
    const version = typeof tag?.tag_name === "string" ? tagVersion(tag.tag_name) : void 0;
    if (version === void 0) return { error: "Invalid release document" };
    return {
      version,
      url: typeof tag.html_url === "string" ? tag.html_url : RELEASES_URL
    };
  }
  if (release.error !== void 0) return { error: release.error };
  const tags = await probe(`${API}/tags?per_page=30`);
  if (tags.missing === true) return { missing: true };
  if (tags.error !== void 0) return { error: tags.error };
  if (!Array.isArray(tags.body)) return { error: "Invalid tag document" };
  let best;
  for (const entry of tags.body) {
    const name = typeof entry === "object" && entry !== null ? entry.name : void 0;
    const version = typeof name === "string" ? tagVersion(name) : void 0;
    if (version !== void 0 && (best === void 0 || compareVersions(version, best) > 0)) best = version;
  }
  if (best === void 0) return { missing: true };
  return { version: best, url: `${RELEASES_URL}/tag/v${best}` };
}
async function checkForUpdate(currentVersion = PLUGIN_VERSION) {
  const result = await latestRelease();
  if (result.missing === true) return { status: "no-release" };
  if (result.version === void 0) return { status: "failed", error: result.error ?? "Unknown release error" };
  return compareVersions(result.version, currentVersion) > 0 ? { status: "available", latest: result.version, url: result.url } : { status: "latest", latest: result.version, url: result.url };
}

// src/client/atlas.ts
var ATLAS_URL = "whale-leap/assets/atlas.webp";

// src/client/settings/settings.module.css
var css2 = { "section": "section_381892a", "header": "header_381892a", "title": "title_381892a", "intro": "intro_381892a", "headerTop": "headerTop_381892a", "updateButton": "updateButton_381892a", "version": "version_381892a", "updateRow": "updateRow_381892a", "updateNotice": "updateNotice_381892a", "updateLink": "updateLink_381892a", "tabs": "tabs_381892a", "tab": "tab_381892a", "tabSelected": "tabSelected_381892a", "choiceButton": "choiceButton_381892a", "choiceSelected": "choiceSelected_381892a", "motionOption": "motionOption_381892a", "switch": "switch_381892a", "slider": "slider_381892a", "colorInput": "colorInput_381892a", "panel": "panel_381892a", "tabPanel": "tabPanel_381892a", "group": "group_381892a", "groupTitle": "groupTitle_381892a", "card": "card_381892a", "stage": "stage_381892a", "stageCanvas": "stageCanvas_381892a", "stageHint": "stageHint_381892a", "markStage": "markStage_381892a", "markStageOff": "markStageOff_381892a", "markRunning": "markRunning_381892a", "markDivider": "markDivider_381892a", "markIcon": "markIcon_381892a", "markRunningLabel": "markRunningLabel_381892a", "row": "row_381892a", "rowText": "rowText_381892a", "label": "label_381892a", "hint": "hint_381892a", "control": "control_381892a", "sliderField": "sliderField_381892a", "sliderValue": "sliderValue_381892a", "colorGroup": "colorGroup_381892a", "colorField": "colorField_381892a", "colorValue": "colorValue_381892a", "choice": "choice_381892a", "switchThumb": "switchThumb_381892a", "motionGrid": "motionGrid_381892a", "motionTick": "motionTick_381892a", "motionFish": "motionFish_381892a", "motionFooter": "motionFooter_381892a", "motionLabel": "motionLabel_381892a", "note": "note_381892a", "rowStacked": "rowStacked_381892a" };
var sheet2 = document.createElement("style");
sheet2.dataset.pluginCss = "whale-leap";
sheet2.textContent = "/* Whale-leap settings page. Colors and radii come from the host design tokens. */\n\n.section_381892a {\n  display: flex;\n  flex-direction: column;\n  gap: 14px;\n  max-width: 860px;\n  color: var(--dsw-alias-label-primary);\n}\n\n.header_381892a {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n\n.title_381892a {\n  margin: 0;\n  font-size: 20px;\n  font-weight: 600;\n  line-height: 28px;\n}\n\n.intro_381892a {\n  margin: 0;\n  font-size: 13px;\n  line-height: 20px;\n  color: var(--dsw-alias-label-secondary);\n}\n\n.headerTop_381892a {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 10px;\n}\n\n.headerTop_381892a .updateButton_381892a {\n  margin-left: auto;\n}\n\n.version_381892a {\n  font-family: var(--ds-font-family-code), monospace;\n  font-size: 12px;\n  line-height: 20px;\n  color: var(--dsw-alias-label-secondary);\n}\n\n.updateRow_381892a {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 10px;\n  font-size: 12px;\n  line-height: 18px;\n}\n\n.updateButton_381892a {\n  height: 28px;\n  padding: 0 12px;\n  border: 0.5px solid var(--dsw-alias-border-l2);\n  border-radius: var(--dsw-radius-sm);\n  background: var(--dsw-alias-bg-module-platform);\n  color: var(--dsw-alias-label-primary);\n  font: inherit;\n  cursor: pointer;\n}\n\n.updateButton_381892a:hover:not(:disabled) {\n  background: var(--dsw-alias-interactive-bg-hover);\n}\n\n.updateButton_381892a:disabled {\n  opacity: 0.4;\n  cursor: default;\n}\n\n.updateButton_381892a:focus-visible {\n  outline: var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary));\n  outline-offset: 2px;\n}\n\n.updateNotice_381892a {\n  color: var(--dsw-alias-label-secondary);\n}\n\n.updateNotice_381892a[data-status='available'] {\n  color: var(--dsw-alias-label-primary);\n}\n\n.updateNotice_381892a[data-status='failed'] {\n  color: var(--dsw-alias-state-error-primary);\n}\n\n.updateLink_381892a {\n  color: var(--dsw-alias-brand-primary);\n  text-decoration: underline;\n  text-underline-offset: 2px;\n}\n\n.tabs_381892a {\n  display: flex;\n  align-items: center;\n  gap: 2px;\n  padding: 3px;\n  border: 0.5px solid var(--dsw-alias-settings-card-stroke);\n  border-radius: var(--dsw-radius-lg);\n  background: var(--dsw-alias-settings-card-fill);\n}\n\n.tab_381892a,\n.tabSelected_381892a {\n  flex: 1;\n  height: 34px;\n  padding: 0 14px;\n  border: 0;\n  border-radius: var(--dsw-radius-md);\n  background: transparent;\n  color: var(--dsw-alias-label-secondary);\n  font-size: 13px;\n  line-height: 20px;\n  cursor: pointer;\n}\n\n.tab_381892a:hover {\n  background: var(--dsw-alias-interactive-bg-hover);\n  color: var(--dsw-alias-label-primary);\n}\n\n.tabSelected_381892a {\n  background: var(--dsw-alias-bg-layer-1);\n  color: var(--dsw-alias-label-primary);\n  font-weight: 500;\n  box-shadow: 0 1px 2px rgb(0 0 0 / 6%);\n}\n\n.tab_381892a:focus-visible,\n.tabSelected_381892a:focus-visible,\n.choiceButton_381892a:focus-visible,\n.choiceSelected_381892a:focus-visible,\n.motionOption_381892a:focus-visible,\n.switch_381892a:focus-visible,\n.slider_381892a:focus-visible,\n.colorInput_381892a:focus-visible {\n  outline: var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary));\n  outline-offset: 2px;\n}\n\n.panel_381892a {\n  display: flex;\n  flex-direction: column;\n  gap: 14px;\n  min-width: 0;\n}\n\n.tabPanel_381892a {\n  display: flex;\n  flex-direction: column;\n  gap: 14px;\n  min-width: 0;\n}\n\n.group_381892a {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  min-width: 0;\n}\n\n.groupTitle_381892a {\n  margin: 0;\n  font-size: 12px;\n  line-height: 18px;\n  font-weight: 500;\n  color: var(--dsw-alias-label-secondary);\n}\n\n.card_381892a {\n  display: flex;\n  flex-direction: column;\n  border: 0.5px solid var(--dsw-alias-settings-card-stroke);\n  border-radius: var(--dsw-radius-xl);\n  background: var(--dsw-alias-settings-card-fill);\n  padding: 14px 18px;\n}\n\n.stage_381892a {\n  position: relative;\n  width: 100%;\n  aspect-ratio: 16 / 9;\n  overflow: hidden;\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: var(--dsw-radius-md);\n  background: var(--dsw-alias-bg-module-platform);\n  box-sizing: border-box;\n}.stageCanvas_381892a {\n  position: absolute;\n  inset: 0;\n  width: 100%;\n  height: 100%;\n  display: block;\n  color: var(--dsw-alias-label-secondary);\n  pointer-events: none;\n}\n\n.stageHint_381892a {\n  position: absolute;\n  right: 10px;\n  bottom: 8px;\n  padding: 2px 6px;\n  border-radius: var(--dsw-radius-sm);\n  background: var(--dsw-alias-bg-layer-1);\n  font-size: 11px;\n  line-height: 16px;\n  color: var(--dsw-alias-label-secondary);\n  pointer-events: none;\n}\n\n.markStage_381892a {\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: 128px;\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: var(--dsw-radius-md);\n  background: var(--dsw-alias-bg-module-platform);\n  box-sizing: border-box;\n  color: var(--dsw-alias-label-primary);\n}\n\n.markStage_381892a .stageHint_381892a {\n  bottom: 8px;\n}\n\n.markStageOff_381892a {\n  padding: 0 24px;\n  font-size: 12px;\n  line-height: 18px;\n  text-align: center;\n  color: var(--dsw-alias-label-secondary);\n}\n\n.markRunning_381892a {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  max-width: calc(100% - 32px);\n  color: var(--dsw-alias-label-primary);\n}\n\n.markDivider_381892a {\n  flex: none;\n  width: 1px;\n  height: 14px;\n  background: var(--dsw-alias-border-l2);\n}\n\n.markIcon_381892a {\n  display: flex;\n  flex: none;\n  align-items: center;\n  justify-content: center;\n}\n\n.markRunningLabel_381892a {\n  font-size: 13px;\n  line-height: 20px;\n  white-space: nowrap;\n  background: linear-gradient(\n    90deg,\n    var(--dsw-alias-label-tertiary) 20%,\n    var(--dsw-alias-label-primary) 50%,\n    var(--dsw-alias-label-tertiary) 80%\n  );\n  background-size: 200% 100%;\n  background-clip: text;\n  -webkit-background-clip: text;\n  color: transparent;\n  animation: markShimmer 2.4s linear infinite;\n}\n\n@keyframes markShimmer {\n  from {\n    background-position: 180% 0;\n  }\n\n  to {\n    background-position: -80% 0;\n  }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .markRunningLabel_381892a {\n    animation: none;\n    background: none;\n    color: var(--dsw-alias-label-secondary);\n  }\n}\n\n.row_381892a {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 18px;\n  min-height: 56px;\n  padding: 10px 0;\n  border-bottom: 0.5px solid var(--dsw-alias-border-l2);\n}\n\n.card_381892a > .row_381892a:last-child {\n  border-bottom: none;\n}\n\n.rowText_381892a {\n  display: flex;\n  flex: 1;\n  min-width: 0;\n  flex-direction: column;\n  gap: 2px;\n}\n\n.label_381892a {\n  font-size: 14px;\n  font-weight: 400;\n  line-height: 22px;\n  color: var(--dsw-alias-label-primary);\n}\n\n.hint_381892a {\n  font-size: 12px;\n  line-height: 18px;\n  color: var(--dsw-alias-label-secondary);\n}\n\n.control_381892a {\n  display: flex;\n  flex: none;\n  align-items: center;\n  gap: 8px;\n}\n\n.sliderField_381892a {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n\n.slider_381892a {\n  width: 190px;\n  accent-color: var(--dsw-alias-brand-primary);\n}\n\n.slider_381892a:disabled {\n  opacity: 0.4;\n}\n\n.sliderField_381892a:has(.slider_381892a:disabled) .sliderValue_381892a {\n  opacity: 0.4;\n}\n\n.sliderValue_381892a {\n  min-width: 52px;\n  font-size: 13px;\n  line-height: 20px;\n  font-variant-numeric: tabular-nums;\n  text-align: right;\n  color: var(--dsw-alias-label-secondary);\n}\n\n.colorGroup_381892a {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n\n.colorField_381892a {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n\n.colorInput_381892a {\n  width: 40px;\n  height: 28px;\n  padding: 2px;\n  border: 0.5px solid var(--dsw-alias-border-l2);\n  border-radius: var(--dsw-radius-sm);\n  background: transparent;\n}\n\n.colorValue_381892a {\n  font-family: var(--ds-font-family-code);\n  font-size: 12px;\n  line-height: 18px;\n  color: var(--dsw-alias-label-secondary);\n}\n\n.choice_381892a {\n  display: inline-flex;\n  align-items: center;\n  gap: 2px;\n  padding: 2px;\n  border-radius: var(--dsw-radius-md);\n  background: var(--dsw-alias-bg-module-platform);\n}\n\n.choiceButton_381892a,\n.choiceSelected_381892a {\n  height: 28px;\n  padding: 0 12px;\n  border: 0;\n  border-radius: var(--dsw-radius-sm);\n  background: transparent;\n  color: var(--dsw-alias-label-secondary);\n  font-size: 13px;\n  line-height: 20px;\n  cursor: pointer;\n}\n\n.choiceButton_381892a:hover {\n  color: var(--dsw-alias-label-primary);\n}\n\n.choiceSelected_381892a {\n  background: var(--dsw-alias-bg-layer-1);\n  color: var(--dsw-alias-label-primary);\n  font-weight: 500;\n  box-shadow: 0 1px 2px rgb(0 0 0 / 6%);\n}\n\n.choiceButton_381892a:disabled,\n.choiceSelected_381892a:disabled,\n.motionOption_381892a:disabled,\n.switch_381892a:disabled {\n  opacity: 0.4;\n  cursor: default;\n}\n\n.switch_381892a {\n  position: relative;\n  width: 38px;\n  height: 22px;\n  padding: 0;\n  border: 0.5px solid var(--dsw-alias-border-l2);\n  border-radius: 999px;\n  background: var(--dsw-alias-interactive-bg-hover);\n  cursor: pointer;\n  transition: background 0.15s ease;\n}\n\n.switch_381892a[aria-checked='true'] {\n  background: var(--dsw-alias-brand-primary);\n  border-color: transparent;\n}\n\n.switchThumb_381892a {\n  position: absolute;\n  top: 2px;\n  left: 2px;\n  width: 16px;\n  height: 16px;\n  border-radius: 50%;\n  background: var(--dsw-alias-bg-layer-1);\n  transition: transform 0.15s ease;\n}\n\n.switch_381892a[aria-checked='true'] .switchThumb_381892a {\n  transform: translateX(16px);\n}\n\n.motionGrid_381892a {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 10px;\n  margin-bottom: 8px;\n}\n\n.motionOption_381892a {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 2px;\n  padding: 10px 8px 8px;\n  border: 0.5px solid var(--dsw-alias-border-l2);\n  border-radius: var(--dsw-radius-md);\n  background: var(--dsw-alias-bg-module-platform);\n  color: var(--dsw-alias-label-secondary);\n  cursor: pointer;\n}\n\n.motionOption_381892a:hover {\n  border-color: var(--dsw-alias-border-l3);\n  color: var(--dsw-alias-label-primary);\n}\n\n.motionOption_381892a[aria-pressed='true'] {\n  border-color: var(--dsw-alias-border-selected);\n  background: var(--dsw-alias-bg-layer-1);\n  color: var(--dsw-alias-label-primary);\n}\n\n.motionOption_381892a:disabled .motionTick_381892a {\n  visibility: hidden;\n}\n\n.motionFish_381892a {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: 56px;\n}\n\n.motionFooter_381892a {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  min-height: 18px;\n}\n\n.motionLabel_381892a {\n  font-size: 13px;\n  line-height: 18px;\n}\n\n.motionTick_381892a {\n  font-size: 11px;\n  line-height: 16px;\n  padding: 0 5px;\n  border-radius: 999px;\n  background: var(--dsw-alias-bg-module-platform);\n  color: var(--dsw-alias-label-secondary);\n}\n\n.note_381892a {\n  margin: 0 0 10px;\n  font-size: 12px;\n  line-height: 18px;\n  color: var(--dsw-alias-label-secondary);\n}\n\n@media (min-width: 768px) {\n  .stage_381892a {\n    aspect-ratio: auto;\n    height: 240px;\n  }\n}\n\n@media (max-width: 767px) {\n  .row_381892a {\n    flex-wrap: wrap;\n  }\n\n  .slider_381892a {\n    width: 100%;\n  }\n\n  .sliderField_381892a {\n    flex: 1;\n  }\n}\n\n@media (max-width: 520px) {\n  .rowStacked_381892a {\n    flex-wrap: wrap;\n    gap: 8px;\n  }\n\n  .rowStacked_381892a .rowText_381892a {\n    flex: 1 1 100%;\n  }\n\n  .rowStacked_381892a .control_381892a {\n    width: 100%;\n  }\n\n  .rowStacked_381892a .sliderField_381892a {\n    flex: 1;\n  }\n\n  .rowStacked_381892a .slider_381892a {\n    width: 100%;\n  }\n\n  .rowStacked_381892a .colorGroup_381892a {\n    width: 100%;\n    flex-wrap: wrap;\n  }\n\n  .rowStacked_381892a .choice_381892a {\n    width: 100%;\n  }\n\n  .rowStacked_381892a .choiceButton_381892a,\n  .rowStacked_381892a .choiceSelected_381892a {\n    flex: 1;\n  }\n}\n";
document.head.appendChild(sheet2);
var settings_default = css2;

// src/client/settings/SettingsPage.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var TABS = [
  { value: "background", label: "tabBackground" },
  { value: "mark", label: "tabMark" }
];
var MOTION_LABELS = {
  swim: "motionSwim",
  explore: "motionExplore",
  hero: "motionHero",
  sway: "motionSway"
};
var PREVIEW_INTERVAL_MS = 4200;
var PREVIEW_SCALE = 0.5;
var OPTION_FISH_SIZE = 34;
function formatOffsetPx(px) {
  const rounded = Number.isInteger(px) ? String(px) : px.toFixed(1);
  return `${px > 0 ? "+" : ""}${rounded}px`;
}
function Row({ label, hint, control, stack = false }) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: stack ? `${settings_default.row} ${settings_default.rowStacked}` : settings_default.row, children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: settings_default.rowText, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: settings_default.label, children: label }),
      hint !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: settings_default.hint, children: hint })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: settings_default.control, children: control })
  ] });
}
function Group({ title, children }) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("section", { className: settings_default.group, "aria-label": title, children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("h3", { className: settings_default.groupTitle, children: title }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: settings_default.card, children })
  ] });
}
function SliderRow(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    Row,
    {
      stack: true,
      label: props.label,
      hint: props.hint,
      control: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: settings_default.sliderField, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "input",
          {
            id: props.id,
            type: "range",
            className: settings_default.slider,
            min: props.min,
            max: props.max,
            step: props.step,
            value: props.value,
            disabled: props.disabled,
            onChange: (event) => {
              props.onChange(Number(event.target.value));
            }
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: settings_default.sliderValue, children: props.display })
      ] })
    }
  );
}
function ChoiceRow(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: settings_default.choice, role: "group", "aria-label": props.label, children: props.options.map((option) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    "button",
    {
      type: "button",
      className: props.value === option.value ? settings_default.choiceSelected : settings_default.choiceButton,
      "aria-pressed": props.value === option.value,
      disabled: props.disabled,
      onClick: () => {
        props.onChange(option.value);
      },
      children: option.label
    },
    option.value
  )) });
}
function ToggleRow(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    Row,
    {
      label: props.label,
      hint: props.hint,
      control: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        "button",
        {
          type: "button",
          role: "switch",
          "aria-checked": props.checked,
          "aria-label": props.label,
          disabled: props.disabled,
          className: settings_default.switch,
          onClick: () => {
            props.onChange(!props.checked);
          },
          children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: settings_default.switchThumb })
        }
      )
    }
  );
}
function PreviewWhale({ settings }) {
  const whale = (0, import_react2.useRef)(void 0);
  const node = (0, import_react2.useRef)(null);
  const latest = (0, import_react2.useRef)(settings);
  latest.current = settings;
  const canvasRef = (0, import_react2.useCallback)((canvas) => {
    whale.current?.dispose();
    node.current = canvas;
    if (canvas === null) {
      whale.current = void 0;
      return;
    }
    const handle = attachPixelWhale(canvas, WHALE_ARTWORK, ATLAS_URL);
    whale.current = handle;
    handle.prefetch();
    const current = latest.current;
    handle.update({ ...WHALE_ARTWORK, activeOpacity: current.opacity, scale: current.size * PREVIEW_SCALE });
    handle.setAutoPlay(PREVIEW_INTERVAL_MS);
  }, []);
  const { opacity, size, colorMode, customColor } = settings;
  (0, import_react2.useEffect)(() => {
    whale.current?.update({ ...WHALE_ARTWORK, activeOpacity: opacity, scale: size * PREVIEW_SCALE });
  }, [opacity, size, colorMode, customColor]);
  (0, import_react2.useEffect)(() => {
    const canvas = node.current;
    if (canvas === null) return;
    const custom = colorMode === "custom";
    canvas.style.color = custom ? customColor : "";
    canvas.style.setProperty("--home-whale-code-ink", custom ? customColor : "");
  }, [colorMode, customColor]);
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("canvas", { ref: canvasRef, className: settings_default.stageCanvas, "aria-hidden": "true" });
}
function SettingsPage({ t, state, actions, initialTab = "background" }) {
  const settings = (0, import_react2.useSyncExternalStore)(state.subscribe, state.getSnapshot, state.getSnapshot);
  const [tab, setTab] = (0, import_react2.useState)(initialTab);
  const [update, setUpdate] = (0, import_react2.useState)({ status: "idle" });
  const disabled = !settings.writable;
  const custom = settings.colorMode === "custom";
  const checkForUpdates = (0, import_react2.useCallback)(async () => {
    setUpdate({ status: "checking" });
    setUpdate(await checkForUpdate());
  }, []);
  let updateNotice = "";
  if (update.status === "latest" && update.latest !== void 0) {
    updateNotice = t("upToDate", { version: update.latest });
  } else if (update.status === "available" && update.latest !== void 0) {
    updateNotice = t("updateAvailable", { version: update.latest });
  } else if (update.status === "failed") {
    updateNotice = t("updateFailed");
  } else if (update.status === "no-release") {
    updateNotice = t("noRelease");
  }
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("section", { className: settings_default.section, children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("header", { className: settings_default.header, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: settings_default.headerTop, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("h2", { className: settings_default.title, children: t("nav") }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: settings_default.version, children: t("version", { version: PLUGIN_VERSION }) }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "button",
          {
            type: "button",
            className: settings_default.updateButton,
            disabled: update.status === "checking",
            onClick: () => {
              void checkForUpdates();
            },
            children: update.status === "checking" ? t("checking") : t("checkUpdate")
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: settings_default.intro, children: t("intro") }),
      (updateNotice !== "" || update.status === "available") && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: settings_default.updateRow, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: settings_default.updateNotice, role: "status", "data-status": update.status, children: updateNotice }),
        update.status === "available" && update.latest !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "a",
          {
            className: settings_default.updateLink,
            href: update.url ?? RELEASES_URL,
            target: "_blank",
            rel: "noreferrer",
            children: t("viewVersion", { version: update.latest })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: settings_default.tabs, role: "tablist", "aria-label": t("nav"), children: TABS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      "button",
      {
        type: "button",
        role: "tab",
        id: `whale-leap-tab-${item.value}`,
        "aria-selected": tab === item.value,
        "aria-controls": `whale-leap-panel-${item.value}`,
        className: tab === item.value ? settings_default.tabSelected : settings_default.tab,
        onClick: () => {
          setTab(item.value);
        },
        children: t(item.label)
      },
      item.value
    )) }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: settings_default.panel, children: tab === "background" ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
      "div",
      {
        id: "whale-leap-panel-background",
        role: "tabpanel",
        "aria-labelledby": "whale-leap-tab-background",
        className: settings_default.tabPanel,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: settings_default.stage, children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(PreviewWhale, { settings }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: settings_default.stageHint, children: t("stageHint") })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(Group, { title: t("groupAppearance"), children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              Row,
              {
                stack: true,
                label: t("color"),
                hint: t("colorHint"),
                control: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: settings_default.colorGroup, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                    ChoiceRow,
                    {
                      label: t("color"),
                      value: settings.colorMode,
                      disabled,
                      options: COLOR_MODES.map((mode) => ({ value: mode, label: t(mode === "theme" ? "colorTheme" : "colorCustom") })),
                      onChange: actions.setColorMode
                    }
                  ),
                  custom && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: settings_default.colorField, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                      "input",
                      {
                        className: settings_default.colorInput,
                        type: "color",
                        "aria-label": t("colorCustom"),
                        value: settings.customColor,
                        disabled,
                        onChange: (event) => {
                          actions.setCustomColor(event.target.value);
                        }
                      }
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: settings_default.colorValue, children: settings.customColor.toUpperCase() })
                  ] })
                ] })
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              SliderRow,
              {
                id: "whale-leap-size",
                label: t("size"),
                hint: t("sizeHint"),
                value: settings.size,
                min: SIZE_RANGE.min,
                max: SIZE_RANGE.max,
                step: SIZE_RANGE.step,
                display: `${Math.round(settings.size * 100)}%`,
                disabled,
                onChange: actions.setSize
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              SliderRow,
              {
                id: "whale-leap-strength",
                label: t("strength"),
                hint: t("strengthHint"),
                value: settings.opacity,
                min: OPACITY_RANGE.min,
                max: OPACITY_RANGE.max,
                step: OPACITY_RANGE.step,
                display: `${Math.round(settings.opacity * 100)}%`,
                disabled,
                onChange: actions.setOpacity
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(Group, { title: t("groupPlayback"), children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              ToggleRow,
              {
                label: t("auto"),
                hint: t("autoHint"),
                checked: settings.autoAppear,
                disabled,
                onChange: actions.setAutoAppear
              }
            ),
            settings.autoAppear && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                ToggleRow,
                {
                  label: t("playOnSwitch"),
                  hint: t("playOnSwitchHint"),
                  checked: settings.playOnSwitch,
                  disabled,
                  onChange: actions.setPlayOnSwitch
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                SliderRow,
                {
                  id: "whale-leap-interval",
                  label: t("interval"),
                  hint: t("intervalHint"),
                  value: settings.intervalSeconds,
                  min: INTERVAL_RANGE.min,
                  max: INTERVAL_RANGE.max,
                  step: INTERVAL_RANGE.step,
                  display: t("intervalSeconds", { seconds: settings.intervalSeconds }),
                  disabled,
                  onChange: actions.setInterval
                }
              )
            ] })
          ] })
        ]
      }
    ) : /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
      "div",
      {
        id: "whale-leap-panel-mark",
        role: "tabpanel",
        "aria-labelledby": "whale-leap-tab-mark",
        className: settings_default.tabPanel,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: settings_default.markStage, children: [
            settings.replaceMark ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: settings_default.markRunning, children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: settings_default.markDivider, "aria-hidden": "true" }),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: settings_default.markIcon, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                WhaleMarkFish,
                {
                  size: settings.markSize,
                  motion: settings.markMotion,
                  swing: settings.markSwing,
                  offsetX: settings.markOffsetX,
                  offsetY: settings.markOffsetY
                }
              ) }),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                "span",
                {
                  className: settings_default.markRunningLabel,
                  style: { fontSize: `${settings.markLabelSize}px` },
                  "data-running-label": true,
                  children: t("runningLabel")
                }
              )
            ] }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: settings_default.markStageOff, children: t("replaceMarkHint") }),
            settings.replaceMark && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: settings_default.stageHint, children: t("markPreviewHint") })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(Group, { title: t("groupIcon"), children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              ToggleRow,
              {
                label: t("replaceMark"),
                hint: t("replaceMarkHint"),
                checked: settings.replaceMark,
                disabled,
                onChange: actions.setReplaceMark
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              SliderRow,
              {
                id: "whale-leap-mark-size",
                label: t("markSize"),
                hint: t("markSizeHint"),
                value: settings.markSize,
                min: MARK_SIZE_RANGE.min,
                max: MARK_SIZE_RANGE.max,
                step: MARK_SIZE_RANGE.step,
                display: `${settings.markSize}px`,
                disabled: disabled || !settings.replaceMark,
                onChange: actions.setMarkSize
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              SliderRow,
              {
                id: "whale-leap-mark-label-size",
                label: t("labelSize"),
                hint: t("labelSizeHint"),
                value: settings.markLabelSize,
                min: MARK_LABEL_SIZE_RANGE.min,
                max: MARK_LABEL_SIZE_RANGE.max,
                step: MARK_LABEL_SIZE_RANGE.step,
                display: `${settings.markLabelSize}px`,
                disabled: disabled || !settings.replaceMark,
                onChange: actions.setMarkLabelSize
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              SliderRow,
              {
                id: "whale-leap-mark-offset-x",
                label: t("offsetX"),
                hint: t("offsetXHint"),
                value: settings.markOffsetX,
                min: MARK_OFFSET_RANGE.min,
                max: MARK_OFFSET_RANGE.max,
                step: MARK_OFFSET_RANGE.step,
                display: formatOffsetPx(settings.markOffsetX),
                disabled: disabled || !settings.replaceMark,
                onChange: actions.setMarkOffsetX
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              SliderRow,
              {
                id: "whale-leap-mark-offset-y",
                label: t("offsetY"),
                hint: t("offsetYHint"),
                value: settings.markOffsetY,
                min: MARK_OFFSET_RANGE.min,
                max: MARK_OFFSET_RANGE.max,
                step: MARK_OFFSET_RANGE.step,
                display: formatOffsetPx(settings.markOffsetY),
                disabled: disabled || !settings.replaceMark,
                onChange: actions.setMarkOffsetY
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(Group, { title: t("motion"), children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: settings_default.motionGrid, role: "group", "aria-label": t("motion"), children: MARK_MOTIONS.map((motion) => {
              const selected = settings.markMotion === motion;
              return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
                "button",
                {
                  type: "button",
                  className: settings_default.motionOption,
                  "aria-pressed": selected,
                  disabled: disabled || !settings.replaceMark,
                  onClick: () => {
                    actions.setMarkMotion(motion);
                  },
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: settings_default.motionFish, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(WhaleMarkFish, { size: OPTION_FISH_SIZE, motion, swing: settings.markSwing }) }),
                    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: settings_default.motionFooter, children: [
                      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: settings_default.motionLabel, children: t(MOTION_LABELS[motion]) }),
                      selected && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: settings_default.motionTick, children: t("selected") })
                    ] })
                  ]
                },
                motion
              );
            }) }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: settings_default.note, children: t("motionHint") }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              SliderRow,
              {
                id: "whale-leap-mark-swing",
                label: t("swing"),
                hint: t("swingHint"),
                value: settings.markSwing,
                min: MARK_SWING_RANGE.min,
                max: MARK_SWING_RANGE.max,
                step: MARK_SWING_RANGE.step,
                display: `${Math.round(settings.markSwing * 100)}%`,
                disabled: disabled || !settings.replaceMark,
                onChange: actions.setMarkSwing
              }
            )
          ] })
        ]
      }
    ) })
  ] });
}

// src/client/whale/RunningMark.tsx
var import_react3 = require("react");
var import_jsx_runtime3 = require("react/jsx-runtime");
function RunningMark({ state }) {
  const settings = (0, import_react3.useSyncExternalStore)(state.subscribe, state.getSnapshot, state.getSnapshot);
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    WhaleMarkFish,
    {
      size: settings.markSize,
      motion: settings.markMotion,
      swing: settings.markSwing,
      offsetX: settings.markOffsetX,
      offsetY: settings.markOffsetY
    }
  );
}

// src/client/whale/running-label.ts
var STYLE_ID = "whale-leap-running-label-size";
var LABEL_SELECTOR = "[data-chat-running] > span:last-child > span:last-child";
function applyRunningLabelSize(px) {
  if (typeof document === "undefined" || typeof document.getElementById !== "function") return;
  const existing = document.getElementById(STYLE_ID);
  if (px === void 0) {
    existing?.remove();
    return;
  }
  const sheet4 = existing ?? document.createElement("style");
  if (existing === null) {
    sheet4.id = STYLE_ID;
    document.head.append(sheet4);
  }
  sheet4.textContent = `${LABEL_SELECTOR} { font-size: ${px}px; }`;
}

// src/client/whale/WhaleLayer.tsx
var import_react4 = require("react");

// src/client/whale/whale.module.css
var css3 = { "layer": "layer_3e29209", "autoLayer": "autoLayer_3e29209", "canvas": "canvas_3e29209" };
var sheet3 = document.createElement("style");
sheet3.dataset.pluginCss = "whale-leap";
sheet3.textContent = "/* The whale is painted at negative z-index, so its frame must either be the hero\n   stacking context or a dedicated isolating wrapper that keeps the layer above\n   the conversation background. */\n.layer_3e29209 {\n  display: contents;\n}\n\n.autoLayer_3e29209 {\n  position: relative;\n  display: flex;\n  flex: 1;\n  flex-direction: column;\n  min-height: 0;\n  isolation: isolate;\n}\n\n.canvas_3e29209 {\n  --home-whale-code-ink: var(--dsw-alias-label-primary);\n  position: absolute;\n  inset: 0;\n  z-index: -1;\n  width: 100%;\n  height: 100%;\n  display: block;\n  pointer-events: none;\n  color: var(--dsw-alias-label-secondary);\n  filter: grayscale(1);\n  font-family: var(--ds-font-family-code);\n}\n\n.canvas_3e29209[data-whale-ink='custom'] {\n  filter: none;\n}\n";
document.head.appendChild(sheet3);
var whale_default = css3;

// src/client/whale/WhaleLayer.tsx
var import_jsx_runtime4 = require("react/jsx-runtime");
var CONTROLS = 'button, a, input, textarea, select, label, [contenteditable], [role="button"], [role="dialog"], [role="menu"], [role="listbox"], [data-composer-card]';
function isBlankClick(event) {
  if (event.button !== 0) return false;
  const frame = event.currentTarget;
  const target = event.target;
  if (!(target instanceof Element) || !frame.contains(target)) return false;
  if (target.closest(CONTROLS) !== null) return false;
  const selection = document.getSelection();
  return !(selection !== null && !selection.isCollapsed && frame.contains(selection.anchorNode));
}
function canvasPresentation(state) {
  if (state.colorMode !== "custom") return {};
  return { color: state.customColor, "--home-whale-code-ink": state.customColor };
}
function WhaleLayer({ hero, children, state }) {
  const settings = (0, import_react4.useSyncExternalStore)(state.subscribe, state.getSnapshot, state.getSnapshot);
  const whale = (0, import_react4.useRef)(void 0);
  const canvasRef = (0, import_react4.useCallback)((canvas) => {
    whale.current?.dispose();
    if (canvas === null) {
      whale.current = void 0;
      return;
    }
    const handle = attachPixelWhale(canvas, WHALE_ARTWORK, ATLAS_URL);
    whale.current = handle;
    handle.prefetch();
  }, []);
  const { opacity, size, colorMode, customColor } = settings;
  (0, import_react4.useEffect)(() => {
    whale.current?.update({ ...WHALE_ARTWORK, activeOpacity: opacity, scale: size });
  }, [opacity, size, colorMode, customColor]);
  const { autoAppear, intervalSeconds, playOnSwitch } = settings;
  (0, import_react4.useEffect)(() => {
    whale.current?.setAutoPlay(autoAppear && !hero ? intervalSeconds * 1e3 : void 0, playOnSwitch);
  }, [autoAppear, intervalSeconds, playOnSwitch, hero]);
  const onClick = (event) => {
    if (isBlankClick(event)) whale.current?.play();
  };
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
    "div",
    {
      className: hero || !settings.autoAppear ? whale_default.layer : whale_default.autoLayer,
      "data-whale-layer": hero ? "hero" : settings.autoAppear ? "auto" : "plain",
      onClick,
      children: [
        (hero || settings.autoAppear) && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          "canvas",
          {
            ref: canvasRef,
            className: whale_default.canvas,
            "data-whale-ink": settings.colorMode === "custom" ? "custom" : void 0,
            style: canvasPresentation(settings),
            "aria-hidden": "true"
          }
        ),
        children
      ]
    }
  );
}

// src/client/settings.ts
var INITIAL_SETTINGS = { ...DEFAULT_SETTINGS, writable: false };

// src/client/store.ts
var WRITE_DELAY_MS = 150;
function createStore(initial) {
  let value = initial;
  const listeners = /* @__PURE__ */ new Set();
  return {
    getSnapshot: () => value,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    set(next) {
      value = next;
      for (const listener of listeners) listener();
    },
    update(mutator) {
      const draft = { ...value };
      mutator(draft);
      value = draft;
      for (const listener of listeners) listener();
    }
  };
}
function clamp(value, bounds) {
  if (Number.isNaN(value)) return bounds.min;
  return Math.min(bounds.max, Math.max(bounds.min, value));
}
var WhaleSettingsRuntime = class {
  /**
   * Create the runtime and start mirroring the durable section.
   * @param ctx - client context providing effect cleanup.
   * @param host - settings form of the plugin namespace.
   */
  constructor(ctx, host) {
    this.ctx = ctx;
    this.host = host;
    ctx.effect(() => {
      const off = host.subscribe(() => {
        this.adopt();
      });
      this.adopt();
      return () => {
        off();
        this.dispose();
      };
    }, "whale-leap: settings adoption");
  }
  /** Live settings shared with slots and the settings page. */
  store = createStore(INITIAL_SETTINGS);
  pending = 0;
  queued = /* @__PURE__ */ new Map();
  timer;
  disposed = false;
  /**
   * Switch the ink source.
   * @param mode - next color source.
   */
  setColorMode(mode) {
    this.patch({ colorMode: mode });
    this.commit("colorMode", mode);
  }
  /**
   * Pick a custom ink color.
   * @param color - lowercase '#rrggbb' color.
   */
  setCustomColor(color) {
    if (!CUSTOM_COLOR_PATTERN.test(color)) return;
    this.patch({ customColor: color });
    this.schedule("customColor", color);
  }
  /**
   * Resize the background scene.
   * @param size - requested multiplier.
   */
  setSize(size) {
    const next = clamp(size, SIZE_RANGE);
    this.patch({ size: next });
    this.schedule("size", next);
  }
  /**
   * Change the ink strength response.
   * @param opacity - requested response.
   */
  setOpacity(opacity) {
    const next = clamp(opacity, OPACITY_RANGE);
    this.patch({ opacity: next });
    this.schedule("opacity", next);
  }
  /**
   * Enable or disable automatic appearance in started conversations.
   * @param enabled - whether replays should run.
   */
  setAutoAppear(enabled) {
    this.patch({ autoAppear: enabled });
    this.commit("autoAppear", enabled);
  }
  /**
   * Choose whether entering a conversation replays immediately.
   * @param enabled - whether the whale appears as soon as the conversation opens.
   */
  setPlayOnSwitch(enabled) {
    this.patch({ playOnSwitch: enabled });
    this.commit("playOnSwitch", enabled);
  }
  /**
   * Set the automatic replay interval.
   * @param seconds - requested interval.
   */
  setInterval(seconds) {
    const next = clamp(seconds, INTERVAL_RANGE);
    this.patch({ intervalSeconds: next });
    this.schedule("intervalSeconds", next);
  }
  /**
   * Enable or disable replacing the shipped running mark.
   * @param enabled - whether the plugin's fish takes the mark's place.
   */
  setReplaceMark(enabled) {
    this.patch({ replaceMark: enabled });
    this.commit("replaceMark", enabled);
  }
  /**
   * Set the running mark's size.
   * @param px - requested icon size in pixels.
   */
  setMarkSize(px) {
    const next = clamp(px, MARK_SIZE_RANGE);
    this.patch({ markSize: next });
    this.schedule("markSize", next);
  }
  /**
   * Set the running status label size.
   *
   * The label keeps the row's fixed line height, so a larger size never grows
   * the padding around it.
   * @param px - requested label size in pixels.
   */
  setMarkLabelSize(px) {
    const next = clamp(px, MARK_LABEL_SIZE_RANGE);
    this.patch({ markLabelSize: next });
    this.schedule("markLabelSize", next);
  }
  /**
   * Set the running mark's swing amplitude.
   * @param amplitude - requested multiplier.
   */
  setMarkSwing(amplitude) {
    const next = clamp(amplitude, MARK_SWING_RANGE);
    this.patch({ markSwing: next });
    this.schedule("markSwing", next);
  }
  /**
   * Set the running mark's horizontal start offset.
   * @param px - requested offset in pixels.
   */
  setMarkOffsetX(px) {
    const next = clamp(px, MARK_OFFSET_RANGE);
    this.patch({ markOffsetX: next });
    this.schedule("markOffsetX", next);
  }
  /**
   * Set the running mark's vertical start offset.
   * @param px - requested offset in pixels.
   */
  setMarkOffsetY(px) {
    const next = clamp(px, MARK_OFFSET_RANGE);
    this.patch({ markOffsetY: next });
    this.schedule("markOffsetY", next);
  }
  /**
   * Choose the running mark's motion preset.
   * @param motion - accepted preset.
   */
  setMarkMotion(motion) {
    this.patch({ markMotion: motion });
    this.commit("markMotion", motion);
  }
  /** Stop pending work. */
  dispose() {
    this.disposed = true;
    this.queued.clear();
    if (this.timer !== void 0) {
      clearTimeout(this.timer);
      this.timer = void 0;
    }
  }
  /** Adopt the durable section unless local edits or a flush are in flight. */
  adopt() {
    if (this.disposed || this.pending > 0 || this.timer !== void 0) return;
    const snapshot = this.host.getSnapshot();
    if (snapshot.value === void 0) return;
    const section = snapshot.value;
    this.store.set({ ...DEFAULT_SETTINGS, ...section, writable: snapshot.writable });
  }
  /**
   * Replace live values without waiting for the durable round trip.
   * @param patch - fields to overwrite.
   */
  patch(patch) {
    this.store.update((draft) => {
      Object.assign(draft, patch);
    });
  }
  /**
   * Write one field after the current reads settle.
   * @param field - section field name.
   * @param value - next value.
   */
  commit(field, value) {
    if (this.disposed || !this.store.getSnapshot().writable) return;
    this.pending += 1;
    void this.host.set(field, value).finally(() => {
      this.pending -= 1;
      this.adopt();
    });
  }
  /**
   * Queue a slider write and flush it after the debounce window.
   * @param field - section field name.
   * @param value - next value.
   */
  schedule(field, value) {
    if (this.disposed || !this.store.getSnapshot().writable) return;
    this.queued.set(field, value);
    if (this.timer !== void 0) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.flush();
    }, WRITE_DELAY_MS);
  }
  /** Commit every queued slider write in input order. */
  flush() {
    this.timer = void 0;
    const entries = [...this.queued];
    this.queued.clear();
    for (const [field, value] of entries) this.commit(field, value);
  }
};

// src/client/index.tsx
var LOCALE_NS = "settings.whaleLeap";
var inject = ["slots", "locale", "configForms"];
function pageActions(runtime) {
  return {
    setColorMode: (mode) => {
      runtime.setColorMode(mode);
    },
    setCustomColor: (color) => {
      runtime.setCustomColor(color);
    },
    setSize: (size) => {
      runtime.setSize(size);
    },
    setOpacity: (opacity) => {
      runtime.setOpacity(opacity);
    },
    setAutoAppear: (enabled) => {
      runtime.setAutoAppear(enabled);
    },
    setPlayOnSwitch: (enabled) => {
      runtime.setPlayOnSwitch(enabled);
    },
    setInterval: (seconds) => {
      runtime.setInterval(seconds);
    },
    setReplaceMark: (enabled) => {
      runtime.setReplaceMark(enabled);
    },
    setMarkSize: (px) => {
      runtime.setMarkSize(px);
    },
    setMarkLabelSize: (px) => {
      runtime.setMarkLabelSize(px);
    },
    setMarkSwing: (amplitude) => {
      runtime.setMarkSwing(amplitude);
    },
    setMarkOffsetX: (px) => {
      runtime.setMarkOffsetX(px);
    },
    setMarkOffsetY: (px) => {
      runtime.setMarkOffsetY(px);
    },
    setMarkMotion: (motion) => {
      runtime.setMarkMotion(motion);
    }
  };
}
function apply(ctx) {
  const runtime = new WhaleSettingsRuntime(ctx, ctx.configForms.get(SETTINGS_NAMESPACE));
  const state = () => ({ state: runtime.store });
  const actions = pageActions(runtime);
  ctx.effect(() => ctx.locale.register(LOCALE_NS, DICTIONARIES), "whale-leap: dictionaries");
  ctx.slots.inject(
    "conversation.hero.frame",
    () => ctx.slots.register({ name: "conversation.hero.frame", id: "whale-leap", inject: state }, WhaleLayer)
  );
  let releaseMark;
  const syncMark = () => {
    const enabled = runtime.store.getSnapshot().replaceMark;
    if (enabled && releaseMark === void 0) {
      releaseMark = ctx.slots.inject(
        "conversation.chat.running.mark",
        () => ctx.slots.register({ name: "conversation.chat.running.mark", id: "whale-leap", inject: state }, RunningMark)
      );
    } else if (!enabled && releaseMark !== void 0) {
      releaseMark();
      releaseMark = void 0;
    }
  };
  ctx.effect(() => {
    const stopWatching = runtime.store.subscribe(syncMark);
    syncMark();
    return () => {
      stopWatching();
      releaseMark?.();
      releaseMark = void 0;
    };
  }, "whale-leap: running mark registration");
  ctx.effect(() => {
    const syncLabel = () => {
      const snapshot = runtime.store.getSnapshot();
      applyRunningLabelSize(snapshot.replaceMark ? snapshot.markLabelSize : void 0);
    };
    const stopWatching = runtime.store.subscribe(syncLabel);
    syncLabel();
    return () => {
      stopWatching();
      applyRunningLabelSize(void 0);
    };
  }, "whale-leap: running label size");
  ctx.slots.inject(
    "settings.section",
    () => ctx.slots.register(
      {
        name: "settings.section",
        id: "whale-leap",
        order: 30,
        label: () => ctx.locale.bind(LOCALE_NS)("nav"),
        locale: LOCALE_NS,
        inject: () => ({ state: runtime.store, actions })
      },
      SettingsPage
    )
  );
}

return module.exports;
} });

