module.exports = {
    "roots": [
        "<rootDir>/src",
        "<rootDir>/test",
    ],
    "transform": {
        "^.+\\.tsx?$": "ts-jest",
        "^.+\\.jsx?$": "ts-jest",
    },
    "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
    "moduleFileExtensions": [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "node",
    ],
    "testEnvironment": "node",
};