module.exports = function (wallaby) {
    return {
        files: ['language/src/**/*.ts'],

        tests: ['language/src/**/*.test.ts'],

        env: {
            type: 'node',
        },

        testFramework: 'jest',

        compilers: {
            '**/*.ts': wallaby.compilers.babel(),
            '**/*.tsx': wallaby.compilers.babel(),
        },
    };
};
