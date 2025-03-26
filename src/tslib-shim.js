// This file provides minimal tslib functionality to avoid dependency issues
Object.defineProperty(exports, "__esModule", { value: true });
exports.__extends = exports.__assign = exports.__rest = exports.__decorate = exports.__param = exports.__metadata = exports.__awaiter = exports.__generator = exports.__createBinding = exports.__exportStar = exports.__values = exports.__read = exports.__spread = exports.__spreadArrays = exports.__spreadArray = exports.__await = exports.__asyncGenerator = exports.__asyncDelegator = exports.__asyncValues = exports.__makeTemplateObject = exports.__importStar = exports.__importDefault = exports.__classPrivateFieldGet = exports.__classPrivateFieldSet = void 0;

// Some basic implementations
exports.__assign = function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
};

exports.__importDefault = function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};

exports.__importStar = function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
