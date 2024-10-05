let buildArgsList;

// `modulePromise` is a promise to the `WebAssembly.module` object to be
//   instantiated.
// `importObjectPromise` is a promise to an object that contains any additional
//   imports needed by the module that aren't provided by the standard runtime.
//   The fields on this object will be merged into the importObject with which
//   the module will be instantiated.
// This function returns a promise to the instantiated module.
export const instantiate = async (modulePromise, importObjectPromise) => {
    let dartInstance;

    function stringFromDartString(string) {
        const totalLength = dartInstance.exports.$stringLength(string);
        let result = '';
        let index = 0;
        while (index < totalLength) {
          let chunkLength = Math.min(totalLength - index, 0xFFFF);
          const array = new Array(chunkLength);
          for (let i = 0; i < chunkLength; i++) {
              array[i] = dartInstance.exports.$stringRead(string, index++);
          }
          result += String.fromCharCode(...array);
        }
        return result;
    }

    function stringToDartString(string) {
        const length = string.length;
        let range = 0;
        for (let i = 0; i < length; i++) {
            range |= string.codePointAt(i);
        }
        if (range < 256) {
            const dartString = dartInstance.exports.$stringAllocate1(length);
            for (let i = 0; i < length; i++) {
                dartInstance.exports.$stringWrite1(dartString, i, string.codePointAt(i));
            }
            return dartString;
        } else {
            const dartString = dartInstance.exports.$stringAllocate2(length);
            for (let i = 0; i < length; i++) {
                dartInstance.exports.$stringWrite2(dartString, i, string.charCodeAt(i));
            }
            return dartString;
        }
    }

    // Prints to the console
    function printToConsole(value) {
      if (typeof dartPrint == "function") {
        dartPrint(value);
        return;
      }
      if (typeof console == "object" && typeof console.log != "undefined") {
        console.log(value);
        return;
      }
      if (typeof print == "function") {
        print(value);
        return;
      }

      throw "Unable to print message: " + js;
    }

    // Converts a Dart List to a JS array. Any Dart objects will be converted, but
    // this will be cheap for JSValues.
    function arrayFromDartList(constructor, list) {
        const length = dartInstance.exports.$listLength(list);
        const array = new constructor(length);
        for (let i = 0; i < length; i++) {
            array[i] = dartInstance.exports.$listRead(list, i);
        }
        return array;
    }

    buildArgsList = function(list) {
        const dartList = dartInstance.exports.$makeStringList();
        for (let i = 0; i < list.length; i++) {
            dartInstance.exports.$listAdd(dartList, stringToDartString(list[i]));
        }
        return dartList;
    }

    // A special symbol attached to functions that wrap Dart functions.
    const jsWrappedDartFunctionSymbol = Symbol("JSWrappedDartFunction");

    function finalizeWrapper(dartFunction, wrapped) {
        wrapped.dartFunction = dartFunction;
        wrapped[jsWrappedDartFunctionSymbol] = true;
        return wrapped;
    }

    // Imports
    const dart2wasm = {

_1: (x0,x1,x2) => x0.set(x1,x2),
_2: (x0,x1,x2) => x0.set(x1,x2),
_6: f => finalizeWrapper(f,x0 => dartInstance.exports._6(f,x0)),
_7: x0 => new window.FinalizationRegistry(x0),
_8: (x0,x1,x2,x3) => x0.register(x1,x2,x3),
_9: (x0,x1) => x0.unregister(x1),
_10: (x0,x1,x2) => x0.slice(x1,x2),
_11: (x0,x1) => x0.decode(x1),
_12: (x0,x1) => x0.segment(x1),
_13: () => new TextDecoder(),
_14: x0 => x0.buffer,
_15: x0 => x0.wasmMemory,
_16: () => globalThis.window._flutter_skwasmInstance,
_17: x0 => x0.rasterStartMilliseconds,
_18: x0 => x0.rasterEndMilliseconds,
_19: x0 => x0.imageBitmaps,
_164: x0 => x0.focus(),
_165: x0 => x0.select(),
_166: (x0,x1) => x0.append(x1),
_167: x0 => x0.remove(),
_170: x0 => x0.unlock(),
_175: x0 => x0.getReader(),
_185: x0 => new MutationObserver(x0),
_204: (x0,x1,x2) => x0.addEventListener(x1,x2),
_205: (x0,x1,x2) => x0.removeEventListener(x1,x2),
_208: x0 => new ResizeObserver(x0),
_211: (x0,x1) => new Intl.Segmenter(x0,x1),
_212: x0 => x0.next(),
_213: (x0,x1) => new Intl.v8BreakIterator(x0,x1),
_290: x0 => x0.close(),
_291: (x0,x1,x2,x3,x4) => ({type: x0,data: x1,premultiplyAlpha: x2,colorSpaceConversion: x3,preferAnimation: x4}),
_292: x0 => new window.ImageDecoder(x0),
_293: x0 => x0.close(),
_294: x0 => ({frameIndex: x0}),
_295: (x0,x1) => x0.decode(x1),
_298: f => finalizeWrapper(f,x0 => dartInstance.exports._298(f,x0)),
_299: f => finalizeWrapper(f,x0 => dartInstance.exports._299(f,x0)),
_300: (x0,x1) => ({addView: x0,removeView: x1}),
_301: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._301(f,arguments.length,x0) }),
_302: f => finalizeWrapper(f,() => dartInstance.exports._302(f)),
_303: (x0,x1) => ({initializeEngine: x0,autoStart: x1}),
_304: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._304(f,arguments.length,x0) }),
_305: x0 => ({runApp: x0}),
_306: x0 => new Uint8Array(x0),
_308: x0 => x0.preventDefault(),
_309: x0 => x0.stopPropagation(),
_310: (x0,x1) => x0.addListener(x1),
_311: (x0,x1) => x0.removeListener(x1),
_312: (x0,x1) => x0.prepend(x1),
_313: x0 => x0.remove(),
_314: x0 => x0.disconnect(),
_315: (x0,x1) => x0.addListener(x1),
_316: (x0,x1) => x0.removeListener(x1),
_319: (x0,x1) => x0.append(x1),
_320: x0 => x0.remove(),
_321: x0 => x0.stopPropagation(),
_325: x0 => x0.preventDefault(),
_326: (x0,x1) => x0.append(x1),
_327: x0 => x0.remove(),
_332: (x0,x1) => x0.appendChild(x1),
_333: (x0,x1,x2) => x0.insertBefore(x1,x2),
_334: (x0,x1) => x0.removeChild(x1),
_335: (x0,x1) => x0.appendChild(x1),
_336: (x0,x1) => x0.transferFromImageBitmap(x1),
_337: (x0,x1) => x0.append(x1),
_338: (x0,x1) => x0.append(x1),
_339: (x0,x1) => x0.append(x1),
_340: x0 => x0.remove(),
_341: x0 => x0.focus(),
_342: x0 => x0.focus(),
_343: x0 => x0.remove(),
_344: x0 => x0.focus(),
_345: x0 => x0.remove(),
_346: (x0,x1) => x0.appendChild(x1),
_347: (x0,x1) => x0.append(x1),
_348: x0 => x0.focus(),
_349: (x0,x1) => x0.append(x1),
_350: x0 => x0.remove(),
_351: (x0,x1) => x0.append(x1),
_352: (x0,x1) => x0.append(x1),
_353: (x0,x1,x2) => x0.insertBefore(x1,x2),
_354: (x0,x1) => x0.append(x1),
_355: (x0,x1,x2) => x0.insertBefore(x1,x2),
_356: x0 => x0.remove(),
_357: x0 => x0.remove(),
_358: x0 => x0.remove(),
_359: (x0,x1) => x0.append(x1),
_360: x0 => x0.remove(),
_361: x0 => x0.remove(),
_362: x0 => x0.getBoundingClientRect(),
_363: x0 => x0.remove(),
_364: x0 => x0.blur(),
_366: x0 => x0.focus(),
_367: x0 => x0.focus(),
_368: x0 => x0.remove(),
_369: x0 => x0.focus(),
_370: x0 => x0.focus(),
_371: x0 => x0.blur(),
_372: x0 => x0.remove(),
_385: (x0,x1) => x0.append(x1),
_386: x0 => x0.remove(),
_387: (x0,x1) => x0.append(x1),
_388: (x0,x1,x2) => x0.insertBefore(x1,x2),
_389: (x0,x1) => x0.append(x1),
_390: x0 => x0.focus(),
_391: x0 => x0.focus(),
_392: x0 => x0.focus(),
_393: x0 => x0.focus(),
_394: x0 => x0.focus(),
_395: (x0,x1) => x0.append(x1),
_396: x0 => x0.focus(),
_397: x0 => x0.blur(),
_398: x0 => x0.remove(),
_400: x0 => x0.preventDefault(),
_401: x0 => x0.focus(),
_402: x0 => x0.preventDefault(),
_403: x0 => x0.preventDefault(),
_404: x0 => x0.preventDefault(),
_405: x0 => x0.focus(),
_406: x0 => x0.focus(),
_407: (x0,x1) => x0.append(x1),
_408: x0 => x0.focus(),
_409: x0 => x0.focus(),
_410: x0 => x0.focus(),
_411: x0 => x0.focus(),
_412: (x0,x1) => x0.observe(x1),
_413: x0 => x0.disconnect(),
_414: (x0,x1) => x0.appendChild(x1),
_415: (x0,x1) => x0.appendChild(x1),
_416: (x0,x1) => x0.appendChild(x1),
_417: (x0,x1) => x0.append(x1),
_418: (x0,x1) => x0.append(x1),
_419: x0 => x0.remove(),
_420: (x0,x1) => x0.append(x1),
_422: (x0,x1) => x0.appendChild(x1),
_423: (x0,x1) => x0.append(x1),
_424: x0 => x0.remove(),
_425: (x0,x1) => x0.append(x1),
_429: (x0,x1) => x0.appendChild(x1),
_430: x0 => x0.remove(),
_981: () => globalThis.window.flutterConfiguration,
_982: x0 => x0.assetBase,
_986: x0 => x0.debugShowSemanticsNodes,
_987: x0 => x0.hostElement,
_988: x0 => x0.multiViewEnabled,
_989: x0 => x0.nonce,
_991: x0 => x0.fontFallbackBaseUrl,
_992: x0 => x0.useColorEmoji,
_996: x0 => x0.console,
_997: x0 => x0.devicePixelRatio,
_998: x0 => x0.document,
_999: x0 => x0.history,
_1000: x0 => x0.innerHeight,
_1001: x0 => x0.innerWidth,
_1002: x0 => x0.location,
_1003: x0 => x0.navigator,
_1004: x0 => x0.visualViewport,
_1005: x0 => x0.performance,
_1006: (x0,x1) => x0.fetch(x1),
_1009: (x0,x1) => x0.dispatchEvent(x1),
_1010: (x0,x1) => x0.matchMedia(x1),
_1011: (x0,x1) => x0.getComputedStyle(x1),
_1013: x0 => x0.screen,
_1014: (x0,x1) => x0.requestAnimationFrame(x1),
_1015: f => finalizeWrapper(f,x0 => dartInstance.exports._1015(f,x0)),
_1020: (x0,x1) => x0.warn(x1),
_1023: () => globalThis.window,
_1024: () => globalThis.Intl,
_1025: () => globalThis.Symbol,
_1028: x0 => x0.clipboard,
_1029: x0 => x0.maxTouchPoints,
_1030: x0 => x0.vendor,
_1031: x0 => x0.language,
_1032: x0 => x0.platform,
_1033: x0 => x0.userAgent,
_1034: x0 => x0.languages,
_1035: x0 => x0.documentElement,
_1036: (x0,x1) => x0.querySelector(x1),
_1039: (x0,x1) => x0.createElement(x1),
_1041: (x0,x1) => x0.execCommand(x1),
_1044: (x0,x1) => x0.createTextNode(x1),
_1045: (x0,x1) => x0.createEvent(x1),
_1050: x0 => x0.head,
_1051: x0 => x0.body,
_1052: (x0,x1) => x0.title = x1,
_1055: x0 => x0.activeElement,
_1057: x0 => x0.visibilityState,
_1058: () => globalThis.document,
_1059: (x0,x1,x2) => x0.addEventListener(x1,x2),
_1060: (x0,x1,x2,x3) => x0.addEventListener(x1,x2,x3),
_1062: (x0,x1,x2,x3) => x0.addEventListener(x1,x2,x3),
_1063: (x0,x1,x2) => x0.removeEventListener(x1,x2),
_1066: f => finalizeWrapper(f,x0 => dartInstance.exports._1066(f,x0)),
_1067: x0 => x0.target,
_1069: x0 => x0.timeStamp,
_1070: x0 => x0.type,
_1071: x0 => x0.preventDefault(),
_1075: (x0,x1,x2,x3) => x0.initEvent(x1,x2,x3),
_1080: x0 => x0.firstChild,
_1086: x0 => x0.parentElement,
_1088: x0 => x0.parentNode,
_1091: (x0,x1) => x0.removeChild(x1),
_1092: (x0,x1) => x0.removeChild(x1),
_1094: (x0,x1) => x0.textContent = x1,
_1097: (x0,x1) => x0.contains(x1),
_1102: x0 => x0.firstElementChild,
_1104: x0 => x0.nextElementSibling,
_1105: x0 => x0.clientHeight,
_1106: x0 => x0.clientWidth,
_1107: x0 => x0.id,
_1108: (x0,x1) => x0.id = x1,
_1111: (x0,x1) => x0.spellcheck = x1,
_1112: x0 => x0.tagName,
_1113: x0 => x0.style,
_1114: (x0,x1) => x0.append(x1),
_1116: x0 => x0.getBoundingClientRect(),
_1119: (x0,x1) => x0.closest(x1),
_1122: (x0,x1) => x0.querySelectorAll(x1),
_1123: x0 => x0.remove(),
_1124: (x0,x1,x2) => x0.setAttribute(x1,x2),
_1125: (x0,x1) => x0.removeAttribute(x1),
_1126: (x0,x1) => x0.tabIndex = x1,
_1129: x0 => x0.scrollTop,
_1130: (x0,x1) => x0.scrollTop = x1,
_1131: x0 => x0.scrollLeft,
_1132: (x0,x1) => x0.scrollLeft = x1,
_1133: x0 => x0.classList,
_1134: (x0,x1) => x0.className = x1,
_1140: (x0,x1) => x0.getElementsByClassName(x1),
_1141: x0 => x0.click(),
_1143: (x0,x1) => x0.hasAttribute(x1),
_1145: (x0,x1) => x0.attachShadow(x1),
_1148: (x0,x1) => x0.getPropertyValue(x1),
_1150: (x0,x1,x2,x3) => x0.setProperty(x1,x2,x3),
_1152: (x0,x1) => x0.removeProperty(x1),
_1154: x0 => x0.offsetLeft,
_1155: x0 => x0.offsetTop,
_1156: x0 => x0.offsetParent,
_1158: (x0,x1) => x0.name = x1,
_1159: x0 => x0.content,
_1160: (x0,x1) => x0.content = x1,
_1173: (x0,x1) => x0.nonce = x1,
_1178: x0 => x0.now(),
_1180: (x0,x1) => x0.width = x1,
_1182: (x0,x1) => x0.height = x1,
_1185: (x0,x1) => x0.getContext(x1),
_1260: x0 => x0.status,
_1261: x0 => x0.headers,
_1262: x0 => x0.body,
_1263: x0 => x0.arrayBuffer(),
_1266: (x0,x1) => x0.get(x1),
_1268: x0 => x0.read(),
_1269: x0 => x0.value,
_1270: x0 => x0.done,
_1272: x0 => x0.name,
_1273: x0 => x0.x,
_1274: x0 => x0.y,
_1277: x0 => x0.top,
_1278: x0 => x0.right,
_1279: x0 => x0.bottom,
_1280: x0 => x0.left,
_1291: x0 => x0.height,
_1292: x0 => x0.width,
_1293: (x0,x1) => x0.value = x1,
_1296: (x0,x1) => x0.placeholder = x1,
_1297: (x0,x1) => x0.name = x1,
_1298: x0 => x0.selectionDirection,
_1299: x0 => x0.selectionStart,
_1300: x0 => x0.selectionEnd,
_1303: x0 => x0.value,
_1304: (x0,x1,x2) => x0.setSelectionRange(x1,x2),
_1308: x0 => x0.readText(),
_1310: (x0,x1) => x0.writeText(x1),
_1311: x0 => x0.altKey,
_1312: x0 => x0.code,
_1313: x0 => x0.ctrlKey,
_1314: x0 => x0.key,
_1315: x0 => x0.keyCode,
_1316: x0 => x0.location,
_1317: x0 => x0.metaKey,
_1318: x0 => x0.repeat,
_1319: x0 => x0.shiftKey,
_1320: x0 => x0.isComposing,
_1321: (x0,x1) => x0.getModifierState(x1),
_1322: x0 => x0.state,
_1325: (x0,x1) => x0.go(x1),
_1326: (x0,x1,x2,x3) => x0.pushState(x1,x2,x3),
_1327: (x0,x1,x2,x3) => x0.replaceState(x1,x2,x3),
_1328: x0 => x0.pathname,
_1329: x0 => x0.search,
_1330: x0 => x0.hash,
_1333: x0 => x0.state,
_1338: f => finalizeWrapper(f,(x0,x1) => dartInstance.exports._1338(f,x0,x1)),
_1340: (x0,x1,x2) => x0.observe(x1,x2),
_1343: x0 => x0.attributeName,
_1344: x0 => x0.type,
_1345: x0 => x0.matches,
_1348: x0 => x0.matches,
_1349: x0 => x0.relatedTarget,
_1350: x0 => x0.clientX,
_1351: x0 => x0.clientY,
_1352: x0 => x0.offsetX,
_1353: x0 => x0.offsetY,
_1356: x0 => x0.button,
_1357: x0 => x0.buttons,
_1358: x0 => x0.ctrlKey,
_1359: (x0,x1) => x0.getModifierState(x1),
_1360: x0 => x0.pointerId,
_1361: x0 => x0.pointerType,
_1362: x0 => x0.pressure,
_1363: x0 => x0.tiltX,
_1364: x0 => x0.tiltY,
_1365: x0 => x0.getCoalescedEvents(),
_1366: x0 => x0.deltaX,
_1367: x0 => x0.deltaY,
_1368: x0 => x0.wheelDeltaX,
_1369: x0 => x0.wheelDeltaY,
_1370: x0 => x0.deltaMode,
_1375: x0 => x0.changedTouches,
_1377: x0 => x0.clientX,
_1378: x0 => x0.clientY,
_1379: x0 => x0.data,
_1380: (x0,x1) => x0.type = x1,
_1381: (x0,x1) => x0.max = x1,
_1382: (x0,x1) => x0.min = x1,
_1383: (x0,x1) => x0.value = x1,
_1384: x0 => x0.value,
_1385: x0 => x0.disabled,
_1386: (x0,x1) => x0.disabled = x1,
_1387: (x0,x1) => x0.placeholder = x1,
_1388: (x0,x1) => x0.name = x1,
_1389: (x0,x1) => x0.autocomplete = x1,
_1390: x0 => x0.selectionDirection,
_1391: x0 => x0.selectionStart,
_1392: x0 => x0.selectionEnd,
_1395: (x0,x1,x2) => x0.setSelectionRange(x1,x2),
_1402: (x0,x1) => x0.add(x1),
_1405: (x0,x1) => x0.noValidate = x1,
_1406: (x0,x1) => x0.method = x1,
_1407: (x0,x1) => x0.action = x1,
_1435: x0 => x0.orientation,
_1436: x0 => x0.width,
_1437: x0 => x0.height,
_1438: (x0,x1) => x0.lock(x1),
_1455: f => finalizeWrapper(f,(x0,x1) => dartInstance.exports._1455(f,x0,x1)),
_1465: x0 => x0.length,
_1467: (x0,x1) => x0.item(x1),
_1468: x0 => x0.length,
_1469: (x0,x1) => x0.item(x1),
_1470: x0 => x0.iterator,
_1471: x0 => x0.Segmenter,
_1472: x0 => x0.v8BreakIterator,
_1475: x0 => x0.done,
_1476: x0 => x0.value,
_1477: x0 => x0.index,
_1481: (x0,x1) => x0.adoptText(x1),
_1482: x0 => x0.first(),
_1484: x0 => x0.next(),
_1485: x0 => x0.current(),
_1497: x0 => x0.hostElement,
_1498: x0 => x0.viewConstraints,
_1500: x0 => x0.maxHeight,
_1501: x0 => x0.maxWidth,
_1502: x0 => x0.minHeight,
_1503: x0 => x0.minWidth,
_1504: x0 => x0.loader,
_1505: () => globalThis._flutter,
_1506: (x0,x1) => x0.didCreateEngineInitializer(x1),
_1507: (x0,x1,x2) => x0.call(x1,x2),
_1508: () => globalThis.Promise,
_1509: f => finalizeWrapper(f,(x0,x1) => dartInstance.exports._1509(f,x0,x1)),
_1514: x0 => x0.length,
_1517: x0 => x0.tracks,
_1521: x0 => x0.image,
_1526: x0 => x0.codedWidth,
_1527: x0 => x0.codedHeight,
_1530: x0 => x0.duration,
_1534: x0 => x0.ready,
_1535: x0 => x0.selectedTrack,
_1536: x0 => x0.repetitionCount,
_1537: x0 => x0.frameCount,
_1585: x0 => globalThis.firebase_core.getApp(x0),
_1586: () => globalThis.firebase_core.getApp(),
_1588: x0 => globalThis.firebase_remote_config.getRemoteConfig(x0),
_1591: x0 => globalThis.firebase_remote_config.fetchAndActivate(x0),
_1601: x0 => x0.settings,
_1604: (x0,x1) => x0.defaultConfig = x1,
_1612: (x0,x1) => x0.minimumFetchIntervalMillis = x1,
_1614: (x0,x1) => x0.fetchTimeoutMillis = x1,
_1640: () => globalThis.Notification.requestPermission(),
_1642: () => globalThis.firebase_core.SDK_VERSION,
_1649: x0 => x0.apiKey,
_1651: x0 => x0.authDomain,
_1653: x0 => x0.databaseURL,
_1655: x0 => x0.projectId,
_1657: x0 => x0.storageBucket,
_1659: x0 => x0.messagingSenderId,
_1661: x0 => x0.measurementId,
_1663: x0 => x0.appId,
_1665: x0 => x0.name,
_1666: x0 => x0.options,
_1667: (x0,x1) => x0.createElement(x1),
_1668: (x0,x1) => x0.debug(x1),
_1669: f => finalizeWrapper(f,x0 => dartInstance.exports._1669(f,x0)),
_1670: f => finalizeWrapper(f,(x0,x1) => dartInstance.exports._1670(f,x0,x1)),
_1671: (x0,x1) => ({createScript: x0,createScriptURL: x1}),
_1672: (x0,x1,x2) => x0.createPolicy(x1,x2),
_1673: (x0,x1) => x0.createScriptURL(x1),
_1674: (x0,x1,x2) => x0.createScript(x1,x2),
_1675: (x0,x1) => x0.appendChild(x1),
_1676: (x0,x1) => x0.appendChild(x1),
_1677: f => finalizeWrapper(f,x0 => dartInstance.exports._1677(f,x0)),
_1689: (x0,x1,x2,x3) => x0.open(x1,x2,x3),
_1690: (x0,x1,x2) => x0.setRequestHeader(x1,x2),
_1691: f => finalizeWrapper(f,x0 => dartInstance.exports._1691(f,x0)),
_1692: (x0,x1,x2) => x0.addEventListener(x1,x2),
_1693: f => finalizeWrapper(f,x0 => dartInstance.exports._1693(f,x0)),
_1694: x0 => x0.send(),
_1695: () => new XMLHttpRequest(),
_1697: (x0,x1,x2,x3) => x0.addEventListener(x1,x2,x3),
_1706: (x0,x1,x2,x3) => x0.removeEventListener(x1,x2,x3),
_1709: (x0,x1,x2,x3) => x0.open(x1,x2,x3),
_1711: (x0,x1) => x0.canShare(x1),
_1712: (x0,x1) => x0.share(x1),
_1714: x0 => ({text: x0}),
_1731: () => new AudioContext(),
_1732: (x0,x1) => x0.createMediaElementSource(x1),
_1733: x0 => x0.createStereoPanner(),
_1734: (x0,x1) => x0.connect(x1),
_1735: x0 => x0.load(),
_1736: x0 => x0.remove(),
_1737: x0 => x0.play(),
_1738: x0 => x0.pause(),
_1739: (x0,x1) => x0.getItem(x1),
_1741: (x0,x1,x2) => x0.setItem(x1,x2),
_1745: () => globalThis.removeSplashFromWeb(),
_1749: (x0,x1) => x0.matchMedia(x1),
_1760: x0 => new Array(x0),
_1767: f => finalizeWrapper(f,x0 => dartInstance.exports._1767(f,x0)),
_1768: f => finalizeWrapper(f,x0 => dartInstance.exports._1768(f,x0)),
_1793: (decoder, codeUnits) => decoder.decode(codeUnits),
_1794: () => new TextDecoder("utf-8", {fatal: true}),
_1795: () => new TextDecoder("utf-8", {fatal: false}),
_1796: v => stringToDartString(v.toString()),
_1797: (d, digits) => stringToDartString(d.toFixed(digits)),
_1801: o => new WeakRef(o),
_1802: r => r.deref(),
_1807: Date.now,
_1809: s => new Date(s * 1000).getTimezoneOffset() * 60 ,
_1810: s => {
      const jsSource = stringFromDartString(s);
      if (!/^\s*[+-]?(?:Infinity|NaN|(?:\.\d+|\d+(?:\.\d*)?)(?:[eE][+-]?\d+)?)\s*$/.test(jsSource)) {
        return NaN;
      }
      return parseFloat(jsSource);
    },
_1811: () => {
          let stackString = new Error().stack.toString();
          let frames = stackString.split('\n');
          let drop = 2;
          if (frames[0] === 'Error') {
              drop += 1;
          }
          return frames.slice(drop).join('\n');
        },
_1812: () => typeof dartUseDateNowForTicks !== "undefined",
_1813: () => 1000 * performance.now(),
_1814: () => Date.now(),
_1815: () => {
      // On browsers return `globalThis.location.href`
      if (globalThis.location != null) {
        return stringToDartString(globalThis.location.href);
      }
      return null;
    },
_1816: () => {
        return typeof process != undefined &&
               Object.prototype.toString.call(process) == "[object process]" &&
               process.platform == "win32"
      },
_1817: () => new WeakMap(),
_1818: (map, o) => map.get(o),
_1819: (map, o, v) => map.set(o, v),
_1820: s => stringToDartString(JSON.stringify(stringFromDartString(s))),
_1821: s => printToConsole(stringFromDartString(s)),
_1830: (o, t) => o instanceof t,
_1832: f => finalizeWrapper(f,x0 => dartInstance.exports._1832(f,x0)),
_1833: f => finalizeWrapper(f,x0 => dartInstance.exports._1833(f,x0)),
_1834: o => Object.keys(o),
_1835: (ms, c) =>
              setTimeout(() => dartInstance.exports.$invokeCallback(c),ms),
_1836: (handle) => clearTimeout(handle),
_1837: (ms, c) =>
          setInterval(() => dartInstance.exports.$invokeCallback(c), ms),
_1838: (handle) => clearInterval(handle),
_1839: (c) =>
              queueMicrotask(() => dartInstance.exports.$invokeCallback(c)),
_1840: () => Date.now(),
_1859: f => finalizeWrapper(f,x0 => dartInstance.exports._1859(f,x0)),
_1870: (x0,x1) => x0.key(x1),
_1871: x0 => x0.trustedTypes,
_1873: (x0,x1) => x0.text = x1,
_1874: (a, i) => a.push(i),
_1875: (a, i) => a.splice(i, 1)[0],
_1877: (a, l) => a.length = l,
_1878: a => a.pop(),
_1879: (a, i) => a.splice(i, 1),
_1881: (a, s) => a.join(s),
_1882: (a, s, e) => a.slice(s, e),
_1883: (a, s, e) => a.splice(s, e),
_1885: a => a.length,
_1887: (a, i) => a[i],
_1888: (a, i, v) => a[i] = v,
_1890: a => a.join(''),
_1891: (o, a, b) => o.replace(a, b),
_1893: (s, t) => s.split(t),
_1894: s => s.toLowerCase(),
_1895: s => s.toUpperCase(),
_1896: s => s.trim(),
_1897: s => s.trimLeft(),
_1898: s => s.trimRight(),
_1900: (s, p, i) => s.indexOf(p, i),
_1901: (s, p, i) => s.lastIndexOf(p, i),
_1902: (o, offsetInBytes, lengthInBytes) => {
      var dst = new ArrayBuffer(lengthInBytes);
      new Uint8Array(dst).set(new Uint8Array(o, offsetInBytes, lengthInBytes));
      return new DataView(dst);
    },
_1903: (o, start, length) => new Uint8Array(o.buffer, o.byteOffset + start, length),
_1904: (o, start, length) => new Int8Array(o.buffer, o.byteOffset + start, length),
_1905: (o, start, length) => new Uint8ClampedArray(o.buffer, o.byteOffset + start, length),
_1906: (o, start, length) => new Uint16Array(o.buffer, o.byteOffset + start, length),
_1907: (o, start, length) => new Int16Array(o.buffer, o.byteOffset + start, length),
_1908: (o, start, length) => new Uint32Array(o.buffer, o.byteOffset + start, length),
_1909: (o, start, length) => new Int32Array(o.buffer, o.byteOffset + start, length),
_1911: (o, start, length) => new BigInt64Array(o.buffer, o.byteOffset + start, length),
_1912: (o, start, length) => new Float32Array(o.buffer, o.byteOffset + start, length),
_1913: (o, start, length) => new Float64Array(o.buffer, o.byteOffset + start, length),
_1914: Object.is,
_1915: (t, s) => t.set(s),
_1917: (o) => new DataView(o.buffer, o.byteOffset, o.byteLength),
_1919: o => o.buffer,
_1920: o => o.byteOffset,
_1921: Function.prototype.call.bind(Object.getOwnPropertyDescriptor(DataView.prototype, 'byteLength').get),
_1922: (b, o) => new DataView(b, o),
_1923: (b, o, l) => new DataView(b, o, l),
_1924: Function.prototype.call.bind(DataView.prototype.getUint8),
_1925: Function.prototype.call.bind(DataView.prototype.setUint8),
_1926: Function.prototype.call.bind(DataView.prototype.getInt8),
_1927: Function.prototype.call.bind(DataView.prototype.setInt8),
_1928: Function.prototype.call.bind(DataView.prototype.getUint16),
_1929: Function.prototype.call.bind(DataView.prototype.setUint16),
_1930: Function.prototype.call.bind(DataView.prototype.getInt16),
_1931: Function.prototype.call.bind(DataView.prototype.setInt16),
_1932: Function.prototype.call.bind(DataView.prototype.getUint32),
_1933: Function.prototype.call.bind(DataView.prototype.setUint32),
_1934: Function.prototype.call.bind(DataView.prototype.getInt32),
_1935: Function.prototype.call.bind(DataView.prototype.setInt32),
_1938: Function.prototype.call.bind(DataView.prototype.getBigInt64),
_1939: Function.prototype.call.bind(DataView.prototype.setBigInt64),
_1940: Function.prototype.call.bind(DataView.prototype.getFloat32),
_1941: Function.prototype.call.bind(DataView.prototype.setFloat32),
_1942: Function.prototype.call.bind(DataView.prototype.getFloat64),
_1943: Function.prototype.call.bind(DataView.prototype.setFloat64),
_1959: s => stringToDartString(stringFromDartString(s).toUpperCase()),
_1960: s => stringToDartString(stringFromDartString(s).toLowerCase()),
_1962: (s, m) => {
          try {
            return new RegExp(s, m);
          } catch (e) {
            return String(e);
          }
        },
_1963: (x0,x1) => x0.exec(x1),
_1964: (x0,x1) => x0.test(x1),
_1965: (x0,x1) => x0.exec(x1),
_1966: (x0,x1) => x0.exec(x1),
_1967: x0 => x0.pop(),
_1971: (x0,x1,x2) => x0[x1] = x2,
_1973: o => o === undefined,
_1974: o => typeof o === 'boolean',
_1975: o => typeof o === 'number',
_1977: o => typeof o === 'string',
_1980: o => o instanceof Int8Array,
_1981: o => o instanceof Uint8Array,
_1982: o => o instanceof Uint8ClampedArray,
_1983: o => o instanceof Int16Array,
_1984: o => o instanceof Uint16Array,
_1985: o => o instanceof Int32Array,
_1986: o => o instanceof Uint32Array,
_1987: o => o instanceof Float32Array,
_1988: o => o instanceof Float64Array,
_1989: o => o instanceof ArrayBuffer,
_1990: o => o instanceof DataView,
_1991: o => o instanceof Array,
_1992: o => typeof o === 'function' && o[jsWrappedDartFunctionSymbol] === true,
_1994: o => {
            const proto = Object.getPrototypeOf(o);
            return proto === Object.prototype || proto === null;
          },
_1995: o => o instanceof RegExp,
_1996: (l, r) => l === r,
_1997: o => o,
_1998: o => o,
_1999: o => o,
_2000: b => !!b,
_2001: o => o.length,
_2004: (o, i) => o[i],
_2005: f => f.dartFunction,
_2006: l => arrayFromDartList(Int8Array, l),
_2007: l => arrayFromDartList(Uint8Array, l),
_2008: l => arrayFromDartList(Uint8ClampedArray, l),
_2009: l => arrayFromDartList(Int16Array, l),
_2010: l => arrayFromDartList(Uint16Array, l),
_2011: l => arrayFromDartList(Int32Array, l),
_2012: l => arrayFromDartList(Uint32Array, l),
_2013: l => arrayFromDartList(Float32Array, l),
_2014: l => arrayFromDartList(Float64Array, l),
_2015: (data, length) => {
          const view = new DataView(new ArrayBuffer(length));
          for (let i = 0; i < length; i++) {
              view.setUint8(i, dartInstance.exports.$byteDataGetUint8(data, i));
          }
          return view;
        },
_2016: l => arrayFromDartList(Array, l),
_2017: stringFromDartString,
_2018: stringToDartString,
_2019: () => ({}),
_2020: () => [],
_2021: l => new Array(l),
_2022: () => globalThis,
_2023: (constructor, args) => {
      const factoryFunction = constructor.bind.apply(
          constructor, [null, ...args]);
      return new factoryFunction();
    },
_2024: (o, p) => p in o,
_2025: (o, p) => o[p],
_2026: (o, p, v) => o[p] = v,
_2027: (o, m, a) => o[m].apply(o, a),
_2029: o => String(o),
_2030: (p, s, f) => p.then(s, f),
_2031: s => {
      let jsString = stringFromDartString(s);
      if (/[[\]{}()*+?.\\^$|]/.test(jsString)) {
          jsString = jsString.replace(/[[\]{}()*+?.\\^$|]/g, '\\$&');
      }
      return stringToDartString(jsString);
    },
_2033: x0 => x0.input,
_2034: x0 => x0.index,
_2035: x0 => x0.groups,
_2036: x0 => x0.length,
_2038: (x0,x1) => x0[x1],
_2040: (x0,x1) => x0.exec(x1),
_2042: x0 => x0.flags,
_2043: x0 => x0.multiline,
_2044: x0 => x0.ignoreCase,
_2045: x0 => x0.unicode,
_2046: x0 => x0.dotAll,
_2047: (x0,x1) => x0.lastIndex = x1,
_2049: (o, p) => o[p],
_2050: (o, p, v) => o[p] = v,
_2051: (o, p) => delete o[p],
_2821: x0 => x0.error,
_2823: (x0,x1) => x0.src = x1,
_2828: (x0,x1) => x0.crossOrigin = x1,
_2831: (x0,x1) => x0.preload = x1,
_2835: x0 => x0.currentTime,
_2836: (x0,x1) => x0.currentTime = x1,
_2837: x0 => x0.duration,
_2842: (x0,x1) => x0.playbackRate = x1,
_2851: (x0,x1) => x0.loop = x1,
_2855: (x0,x1) => x0.volume = x1,
_2872: x0 => x0.code,
_2873: x0 => x0.message,
_3461: (x0,x1) => x0.type = x1,
_3469: (x0,x1) => x0.crossOrigin = x1,
_3471: (x0,x1) => x0.text = x1,
_3946: () => globalThis.window,
_4011: x0 => x0.navigator,
_4273: x0 => x0.trustedTypes,
_4275: x0 => x0.localStorage,
_4400: x0 => x0.userAgent,
_4620: x0 => x0.length,
_6078: x0 => x0.destination,
_6726: () => globalThis.document,
_6821: x0 => x0.head,
_12944: x0 => x0.name,
_12945: x0 => x0.message,
_13672: () => globalThis.console,
_13699: () => globalThis.window,
_13720: x0 => x0.matches,
_13724: x0 => x0.platform,
_13729: x0 => x0.navigator,
_13736: x0 => x0.status,
_13737: (x0,x1) => x0.responseType = x1,
_13739: x0 => x0.response,
_13743: () => globalThis.window.flutterCanvasKit,
_13745: x0 => x0.name,
_13746: x0 => x0.message,
_13747: x0 => x0.code
    };

    const baseImports = {
        dart2wasm: dart2wasm,


        Math: Math,
        Date: Date,
        Object: Object,
        Array: Array,
        Reflect: Reflect,
    };

    const jsStringPolyfill = {
        "charCodeAt": (s, i) => s.charCodeAt(i),
        "compare": (s1, s2) => {
            if (s1 < s2) return -1;
            if (s1 > s2) return 1;
            return 0;
        },
        "concat": (s1, s2) => s1 + s2,
        "equals": (s1, s2) => s1 === s2,
        "fromCharCode": (i) => String.fromCharCode(i),
        "length": (s) => s.length,
        "substring": (s, a, b) => s.substring(a, b),
    };

    dartInstance = await WebAssembly.instantiate(await modulePromise, {
        ...baseImports,
        ...(await importObjectPromise),
        "wasm:js-string": jsStringPolyfill,
    });

    return dartInstance;
}

// Call the main function for the instantiated module
// `moduleInstance` is the instantiated dart2wasm module
// `args` are any arguments that should be passed into the main function.
export const invoke = (moduleInstance, ...args) => {
    const dartMain = moduleInstance.exports.$getMain();
    const dartArgs = buildArgsList(args);
    moduleInstance.exports.$invokeMain(dartMain, dartArgs);
}

