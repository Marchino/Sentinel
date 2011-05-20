describe("Sentinel", function() {
  var field;
  var sentinel;
  
  beforeEach(function() {
    field = $('<input>')
      .attr('id', 'field')
    sentinel = new Sentinel(field);
    sentinel.with(['presence', 'email']);
    
  });

  it("should perform 2 tests on the field", function() {
    expect(sentinel.object.validations.length).toEqual(2);
  });
});