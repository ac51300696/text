var text_app = require("../bin/www");
    boot = text_app.boot;
        shutdown = text_app.shutdown;
        port = text_app.port;
        superagent = require("superagent"),
        expect = require("expect.js");
describe("server", function() {
    before(function() {
        boot();
    });
});
describe("homepage", function() {
    it("should respond to GET", function(done) {
        superagent
            .get("http://localhost:" + port)
            .end(function(res) {
                expect(res.status).to.equal(200);
                done()
            })
    })
});
after(function() {
shutdown()
});