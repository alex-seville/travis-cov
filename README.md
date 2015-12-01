## travis-cov

A coverage reporter for [Mocha](https://mochajs.org/)/[Blanket](http://blanketjs.org/) that will fail a [Travis CI](https://travis-ci.org/) build when the coverage threshold is too low.

Threshold is specified in the "package.json" file of the consuming project.

Add the key `travis-cov` to the `config` key in your "package.json" file.  Under that key, you can add any of the following properties:

```
"threshold": <number>
```

See [Blanket.js's "package.json"](https://github.com/alex-seville/blanket/blob/master/package.json#L64-L67) as an example.

### Usage

 1. `npm install travis-cov`
 2. Use a reporter argument, `mocha -R travis-cov`
 3. Change the `scripts.test` property in your "package.json" file to use `mocha -R travis-cov`
 4. Add `travis-cov` to the "package.json" file in the `config` section. Add whichever keys you want (see above).
 5. Set up your project with Travis CI
 6. Commit. If your tests pass and the code coverage is above the threshold then the build will pass; if not, the build will fail.
