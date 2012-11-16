## travis-cov

A coverage reporter for [Mocha](http://visionmedia.github.com/mocha/)/[Blanket](http://migrii.github.com/blanket/) that will fail a [travis-ci](https://travis-ci.org/) build when the coverage threshold is too low.

Threshold is specified in the package.json file of the consuming project.

Add the key `"travis-cov-threshold": <number>`.  See [Blanket.js's package.json](https://github.com/Migrii/blanket/blob/live/package.json#L42) as an example.