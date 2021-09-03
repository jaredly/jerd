class SimpleReporter {
    constructor(globalConfig, options) {}

    onRunStart(test) {
        this._numTestSuitesLeft = test.numTotalTestSuites;
        console.log(`${test.numTotalTestSuites} test suites`);
    }

    onRunComplete(test, results) {
        const {
            numFailedTests,
            numPassedTests,
            numTotalTests,
            startTime,
        } = results;

        console.log();
        console.log(
            `${numFailedTests}/${numPassedTests}/${numTotalTests} tests ${
                (Date.now() - startTime) / 1000.0
            }s`,
        );
        console.log();
    }

    onTestResult(test, testResult) {
        for (var i = 0; i < testResult.testResults.length; i++) {
            switch (testResult.testResults[i].status) {
                case 'passed':
                    process.stdout.write('.');
                    break;
                case 'skipped':
                case 'pending':
                case 'todo':
                case 'disabled':
                    process.stdout.write('*');
                    break;
                case 'failed':
                    process.stdout.write('F');
                    break;
            }
        }
    }
}

module.exports = SimpleReporter;
