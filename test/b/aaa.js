describe("sum関数のテスト", function(){
    it("1+1=2", function(){
        expect(sum(1, 1)).toBe(2);
    });
    it("-1+1=0", function(){
        expect(sum(-1, 1)).toBe(0);
    });
    it("0+1=1", function(){
        expect(sum(0, 1)).toBe(1); //ミスするテスト
    });
});
