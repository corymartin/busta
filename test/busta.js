var busta  = require('../lib/busta');
var assert = require('assert');
var fs     = require('fs');
var path   = require('path');


describe('busta', function() {
  var assets;
  var deploy;
  var script;
  var img;

  beforeEach(function() {
    assets = path.join(__dirname, 'assets');
    deploy = path.join(__dirname, 'deploy');
    script = path.join(assets, 'script.js');
    img    = path.join(assets, 'logo.png');
  });

  afterEach(function() {
    var files = fs.readdirSync(assets);
    files.forEach(function(f) {
      if (!~['script.js', 'logo.png'].indexOf(f)) {
        // Remove fingerprinted files
        fs.unlinkSync( path.join(assets, f) );
      }
    });
    files = fs.readdirSync(deploy);
    files.forEach(function(f) {
      fs.unlinkSync( path.join(deploy, f) );
    });
  });


  describe('base functionality', function() {
    it('should create a copy named <base>-<md5sum>.ext in same dir as orginal', function(done) {
      busta(script, function(err, fi) {
        // New file exists
        assert.ok( fs.existsSync(fi.absolute) );
        // Naming
        assert.ok( (/^script-[a-z0-9]{32}\.js$/i).test(fi.name) );
        assert.ok( /^[a-z0-9]{32}$/i.test(fi.fingerprint) );
        // Same dir as orig
        assert.equal( assets, fi.dir );
        assert.equal( fi.absolute, path.join(assets, fi.name) );
        done();
      });
    });

    it('should create an exact copy of the file', function(done) {
      busta(img, function(err, fi) {
        var orig = fs.readFileSync(img);
        var origStat = fs.statSync(img);
        var copy = fs.readFileSync(fi.absolute);
        var copyStat = fs.statSync(fi.absolute);

        assert.strictEqual(origStat.size, copyStat.size);
        assert.strictEqual(orig.length, copy.length);

        for (var i = 0; i < orig.length; i++ ) {
          assert.strictEqual(orig[i], copy[i]);
        }
        done();
      });
    });
  });


  describe('callback arguments', function() {
    describe('error', function() {
      it('should be an Error if there is an error', function(done) {
        busta('no/such/file', function(err, fi) {
          assert.notEqual(err, null);
          assert.ok(err instanceof Error)
          done();
        });
      });

      it('should be null if no error', function(done) {
        busta(script, function(err, fi) {
          assert.equal(err, null);
          done();
        });
      });
    });

    describe('file info', function() {
      it('should have a `name` property', function(done) {
        busta(img, function(err, fi) {
          assert.ok( (/^logo-[a-z0-9]{32}\.png$/i).test(fi.name) );
          done();
        });
      });

      it('should have an `absolute` property', function(done) {
        busta(img, function(err, fi) {
          assert.equal(path.join(fi.dir, fi.name), fi.absolute);
          done();
        });
      });

      it('should have a `dir` property', function(done) {
        busta(img, function(err, fi) {
          assert.equal(path.dirname(fi.absolute), fi.dir);
          done();
        });
      });

      it('should have a `fingerprint` property', function(done) {
        busta(img, function(err, fi) {
          assert.ok( (/^[a-z0-9]{32}$/i).test(fi.fingerprint) );
          done();
        });
      });
    });
  });


  describe('options', function() {
    it('should create a copy in an alternate directory if specified', function(done) {
      busta(script, {outdir:deploy}, function(err, fi) {
        assert.ok( fs.existsSync(fi.absolute) );
        assert.equal( deploy, fi.dir );
        assert.equal( fi.absolute, path.join(deploy, fi.name) );
        done();
      });
    });

    it('should not prefix the file if `noprefix` option is true', function(done) {
      busta(img, {noprefix:true}, function(err, fi) {
        assert.ok( fs.existsSync(fi.absolute) );
        assert.ok( (/^[a-z0-9]{32}\.png$/i).test(fi.name) );
        assert.strictEqual(fi.fingerprint + '.png', fi.name);
        done();
      });
    });

    it('should prefix the file with `prefix` if specified', function(done) {
      busta(script, {prefix:'yabbadabba'}, function(err, fi) {
        assert.ok( fs.existsSync(fi.absolute) );
        assert.ok( (/^yabbadabba-[a-z0-9]{32}\.js$/i).test(fi.name) );
        done();
      });
    });
  });

});
