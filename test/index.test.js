import { JSDOM } from 'jsdom';
import compiler from './compiler';


test('adds 3 to equal 3', (done) => {

    compiler.run(function (err, stats) {

        console.log(JSON.stringify(stats.compilation.assets));

        // const bundleJs = stats.compilation.assets["bundle.js"].source();
        // console.log('bundleJs');
        // console.log(bundleJs);

        expect(3).toBe(3);
        done();

    });
});


