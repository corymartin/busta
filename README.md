Busta
=====

Util to fingerprint asset filenames.


Installation
------------

```bash
$ npm install busta
```

or install CLI util globally

```bash
$ npm install -g busta
```

API
---

### busta(filename, [options,] callback)

__Arguments__

- __filename__ `String` File to fingerprint/bust.
- __options__ `Object` *optional*
  - __outdir__ `String`   : Directory to create new file in. Default is same as the original file.
  - __prefix__ `String`   : String to prepend filename with. Default is base of original file.
  - __noprefix__ `Boolean` : If true filename will not be prepended with prefix. Default is `false`.
  - __encoding__ `String` : Used with hasher. Default is `"utf8"`.
  - __hash__ `String|Function` : Used with hasher. Default is `"md5"`. If value is a function,
    the function will be passed the file contents and it must return a string.
- __callback(err, newfile)__ `Function` Where `newfile` has the following properties:
  - `name` Fingerprinted filename.
  - `absolute` Absolute path.
  - `dir` Directory of file.
  - `fingerprint`

```js
var busta = require('busta');

busta('assets/js/example.js', function(err, fileinfo) {
  if (err) throw err;
  console.log('File %j created', fileinfo.name);
});
// => File "assets/js/example-6c7473255395b5d9f020065b3915cc86.js" created

busta('assets/js/example.js', {noprefix: true}, function(err, fileinfo) {
  if (err) throw err;
  console.log('File %j created', fileinfo.name);
});
// => File "assets/js/6c7473255395b5d9f020065b3915cc86.js" created
```

- - - - - - - - - - - - - - -

Command Line Usage
------------------

```bash
$ busta --file <file-to-bust> [options]

Options:

  -h, --help                 output usage information
  -V, --version              output the version number
  -f, --file <file>          file to bust - required
  -o, --outdir <outdir>      directory to write new file to
  -p, --prefix <prefix>      filename prefix - default is base name of file
  -n, --noprefix             do not use a file prefix
  -e, --encoding <encoding>  encoding used by hasher - default is utf8
  -H, --hash <hash>          hash algorithm - default is md5
```

### Examples

```bash
$ busta --file assets/js/example.js
# => Creates assets/js/example-6c7473255395b5d9f020065b3915cc86.js

$ busta --file assets/js/example.js --noprefix
# => Creates assets/js/6c7473255395b5d9f020065b3915cc86.js

$ busta --file assets/js/example.js --prefix super-duper
# => Creates assets/js/super-duper-6c7473255395b5d9f020065b3915cc86.js

$ busta --file assets/js/example.js --outdir deploy/app
# => Creates deploy/app/example-6c7473255395b5d9f020065b3915cc86.js
```
