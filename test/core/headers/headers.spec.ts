import {expect} from 'chai';
import {Headers} from './../../../src/core/headers/headers';

describe('Headers', () => {

  it('should be composable, with ability to create one header from another', () => {
    let firstHeaders = new Headers({
      'Content-Type': 'application/json',
      'X-Custom-Header': 'Unit test'
    });

    let secondHeaders = new Headers(firstHeaders);
    let thirdHeaders = new Headers(secondHeaders);

    expect(thirdHeaders.get('Content-Type')).to.equal('application/json');
  });

  it('should not change initial headers which were used to create new once', () => {
    let firstHeaders = new Headers();
    let secondHeaders = new Headers(firstHeaders);
    secondHeaders.append('Content-Type', 'application/json');

    expect(firstHeaders.has('Content-Type')).to.equal(false);
  });

  it('should be able to store all values for the same key', () => {
    let firstHeaders = new Headers();
    firstHeaders.append('foo', 'a');
    firstHeaders.append('foo', 'b');
    firstHeaders.append('foo', 'c');
    let secondHeaders = new Headers(firstHeaders);

    expect(secondHeaders.getAll('foo')).to.deep.equal(['a', 'b', 'c']);
  });

  it('should store only the last value when initialized from an object', () => {
    let headers = new Headers({'foo': 'bar', 'fOO': 'baz'});

    expect(headers.get('foo')).to.equal('baz');
  });

  describe('#set', () => {

    it('should reset previous values and set a new value for provided key', () => {
      let headers = new Headers({'foo': 'bar'});
      headers.set('foo', 'baz');

      expect(headers.get('foo')).to.equal('baz');

      headers.set('FOO', 'boo');
      expect(headers.get('foo')).to.equal('boo');
    });

    it('should be able to store original key name format', () => {
      let headers = new Headers();
      headers.set('fOO', 'bar');
      headers.set('foo', 'baz');

      expect(JSON.stringify(headers)).to.deep.equal('{"fOO":["baz"]}');
    });

    it('should be able to transform array of string values to a string', () => {
      let headers = new Headers();
      headers.set('foo', ['bar', 'baz']);

      expect(headers.get('foo')).to.equal('bar,baz');
    });
  });

  describe('#get', () => {

    it('should be case insensitive', () => {
      let headers = new Headers();
      headers.set('foo', 'bar');

      expect(headers.get('foo')).to.equal('bar');
      expect(headers.get('fOO')).to.equal('bar');
    });

    it('should return null if the queried header does not exist', () => {
      let headers = new Headers({'foo': 'bar'});
      headers.set('baz', 'boo');

      expect(headers.get('bar')).to.equal(null);
    });

    it('should be able to return first value that matches given name', () => {
      let headers = new Headers();
      headers.append('foo', 'bar');
      headers.append('foo', 'baz');

      expect(headers.get('foo')).to.equal('bar');
    });
  });

  describe('#getAll', () => {

    it('should return values as an array', () => {
      let headers = new Headers({'Content-Type': 'application/json'});

      expect(Array.isArray(headers.getAll('Content-Type'))).to.equal(true);
    });

    it('should be case insensitive', () => {
      let headers = new Headers({'foo': ['bar', 'baz']});

      expect(headers.getAll('foo')).to.deep.equal(['bar', 'baz']);
      expect(headers.getAll('FoO')).to.deep.equal(['bar', 'baz']);
    });

    it('should return null if the queried header does not exist', () => {
      let emptyHeaders = new Headers();

      expect(emptyHeaders.getAll('foo')).to.equal(null);
    });
  });

  describe('#delete', () => {

    it('should be case insensitive', () => {
      let headers = new Headers();
      headers.set('foo', 'bar');
      expect(headers.has('foo')).to.equal(true);

      headers.delete('foo');
      expect(headers.has('foo')).to.equal(false);

      headers.set('foo', 'bar');
      expect(headers.has('foo')).to.equal(true);

      headers.delete('fOO');
      expect(headers.has('foo')).to.equal(false);
    });
  });

  describe('#append', () => {

    it('should append a header value to the list of values', () => {
      let headers = new Headers();
      headers.append('foo', 'bar');
      headers.append('foo', 'baz');

      expect(headers.getAll('foo')).to.deep.equal(['bar', 'baz']);
    });

    it('should be able to store original key name format', () => {
      let headers = new Headers();
      headers.append('fOO', 'bar');
      headers.append('foo', 'baz');

      expect(JSON.stringify(headers)).to.deep.equal('{"fOO":["bar","baz"]}')
    });
  });

  describe('#toJSON', () => {

    it('should properly serialize headers', () => {
      let headers = new Headers({'foo': 'bar'});
      headers.append('baz', 'boo');
      headers.set('baz', ['boo', 'bat']);

      expect(headers.toJSON()).to.deep.equal({foo:['bar'], baz: ['boo', 'bat']});
    });

  });

  describe('#forEach', () => {

    it('should iterate through headers and provide normalized names', () => {
      let headers = new Headers({'foo': ['bar', 'baz']});
      headers.append('bat', 'boo');

      headers.forEach((values, name, headers) => {
        expect(values).not.to.be.undefined;
        expect(name).not.to.be.undefined;
        expect(headers).not.to.be.undefined;
      });
    });

  });

  describe('#has', () => {

    it('should be able to define if header with provided key exists or not', () => {
      let headers = new Headers({'Content-Type': 'application/json'});

      expect(headers.has('Content-Type')).to.equal(true);
      expect(headers.has('foo')).to.equal(false);
    });
  });

  describe('#keys', () => {

    it('should return headers keys', () => {
      let headers = new Headers();
      headers.append('foo', 'bar');
      headers.append('baz', 'boo');

      expect(headers.keys()).to.deep.equal(['foo', 'baz']);
    });
  });

  describe('#values', () => {

    it('should return headers values', () => {
      let headers = new Headers();
      headers.append('foo', 'bar');
      headers.append('baz', 'boo');

      expect(headers.values()).to.deep.equal([['bar'], ['boo']]);
    });
  });

  describe('#entries', () => {

    it('should return an iterator with all headers keys and values', () => {
      let headers = new Headers();
      headers.append('foo', 'bar');
      headers.append('baz', 'boo');
      headers.set('foo', ['bar', 'baz']);

      for(let pair of headers.entries()) {
        expect(pair).not.to.be.undefined;
      }
    });
  });

  describe('#fromResponseHeaderString', () => {

    it('should parse headers from response string', () => {
      let responseString = `Content-Length:343\n` +
                            `Content-Type:image/png\n` +
                            `Date:Sat, 29 Oct 2016 20:40:02 GMT\n` +
                            `Last-Modified:Wed, 21 Oct 2015 18:27:50 GMT\n` +
                            `Server:Apache`;
      let headers = Headers.fromResponseHeaderString(responseString);

      expect(headers.get('Content-Length')).to.equal('343');
      expect(headers.get('Content-Type')).to.equal('image/png');
      expect(headers.get('Date')).to.equal('Sat, 29 Oct 2016 20:40:02 GMT');
      expect(headers.get('Last-Modified')).to.equal('Wed, 21 Oct 2015 18:27:50 GMT');
      expect(headers.get('Server')).to.equal('Apache');
    });
  });
});
