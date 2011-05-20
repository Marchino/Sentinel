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
  
  it("should fail on the presence validator without a value for the field", function(){
    expect(sentinel.validate('presence')).toBeFalsy();
  });
  
  it("should pass on the presence validator if a value is set", function(){
    field.val('some value');
    expect(sentinel.validate('presence')).toBeTruthy();
  });
  
  it("should fail on the presence validator with a series of spaces as value", function(){
    field.val('     ');
    expect(sentinel.validate('presence')).toBeFalsy();
  });
  
  it("should fail on the email validator without a valid email", function(){
    field.val('not a valid email address');
    expect(sentinel.validate('email')).toBeFalsy();
  });
  
  it("should pass on the email validator with a valid email", function(){
    field.val('valid.email@domain.com');
    expect(sentinel.validate('email')).toBeTruthy();
  });
  
  
});