describe("Dumbass test:", function() {

    var el;

    it("to work correctly", function() {
        var a = 12;
        var b = a;
        expect(a).toBe(b);
        expect(a).not.toBe(null);
    });
});
