var expect = require("chai").expect;
var sinon = require("sinon");
var ReadlineStub = require("../../helpers/readline");

var Expand = require("../../../lib/prompts/expand");


describe("`expand` prompt", function() {

  beforeEach(function() {
    var self = this;
    this.output = "";

    this._write = Expand.prototype.write;
    Expand.prototype.write = function( str ) {
      self.output += str;
      return this;
    };

    this.rl = new ReadlineStub();
    this.expand = new Expand({
      message: "m",
      name: "m",
      choices: [
        { key: "a", name: "acab" },
        { key: "b", name: "bar" },
        { key: "c", name: "chile" }
      ]
    }, this.rl);
  });

  afterEach(function() {
    Expand.prototype.write = this._write;
  });

  describe("arguments validations", function() {

    it("should throw if `key` is missing", function() {
      var errored = function() {
        return new Expand({
          message: "m",
          name: "m",
          choices: [ "a", "a" ]
        });
      };

      expect(errored).to.throw(/Format error/);
    });

    it("should throw if `key` is duplicate", function() {
      var errored = function() {
        return new Expand({
          message: "m",
          name: "m",
          choices: [
            { key: "a", name: "foo" },
            { key: "a", name: "foo" }
          ]
        });
      };

      expect(errored).to.throw(/Duplicate\ key\ error/);
    });

    it("should throw if `key` is `h`", function() {
      var errored = function() {
        return new Expand({
          message: "m",
          name: "m",
          choices: [
            { key: "h", name: "foo" }
          ]
        });
      };

      expect(errored).to.throw(/Reserved\ key\ error/);
    });

  });

  describe("default", function() {

    it("should be the first choice by default", function( done ) {
      this.expand.run(function( answer ) {
        expect(answer).to.equal("acab");
        done();
      });
      this.rl.emit("line");
    });

    it("should be the `default` argument value", function( done ) {
      this.expand = new Expand({
        message: "m",
        name: "m",
        choices: [
          { key: "a", name: "acab" },
          { key: "b", name: "bar" },
          { key: "c", name: "chile" }
        ],
        default: 1
      }, this.rl);

      this.expand.run(function( answer ) {
        expect(answer).to.equal("bar");
        done();
      });
      this.rl.emit("line");
    });

  });

});