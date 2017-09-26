import webpack from 'webpack';
import babelLoader from 'babel-loader';
import MemoryFS from 'memory-fs';

const fs = new MemoryFS();

const webpackConfig = {
    entry: '../src/index.js',
    output: {
        filename: 'bundle.js'
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            loader: babelLoader,
        }]
    }
};

const compiler = webpack(webpackConfig);

/*compiler.inputFileSystem = fs;
compiler.outputFileSystem = fs;
compiler.resolvers.normal.fileSystem = fs;
compiler.resolvers.context.fileSystem = fs;

['readFileSync', 'statSync'].forEach(fn => {
    // Preserve the reference to original function
    fs['mem' + fn] = fs[fn];

    compiler.inputFileSystem[fn] = function(_path) {
        // Fallback to real FS if file is not in the memoryFS
        if (fs.existsSync(_path)) {
            return fs['mem' + fn].apply(fs, arguments);
        } else {
            return realFs[fn].apply(realFs, arguments);
        }
    };
});*/

export default compiler;
