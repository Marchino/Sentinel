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
  
  it("should have 3 test after another call to with", function(){
    sentinel.with({'validation' : 'confirmation', 'error_message' : 'custom error message for this validator'});
    expect(sentinel.object.validations.length).toEqual(3);
  });
  
  it("should fail on the presence validator without a value for the field", function(){
    validation = sentinel.validate('presence')
    expect(validation[0]).toBeFalsy();
  });
  
  it("should pass on the presence validator if a value is set", function(){
    field.val('some value');
    validation = sentinel.validate('presence')
    expect(validation[0]).toBeTruthy();
  });
  
  it("should fail on the presence validator with a series of spaces as value", function(){
    field.val('     ');
    validation = sentinel.validate('presence')
    expect(validation[0]).toBeFalsy();
  });
  
  it("should fail on the email validator without a valid email", function(){
    field.val('not a valid email address');
    validation = sentinel.validate('email')
    expect(validation[0]).toBeFalsy();
  });
  
  it("should pass on the email validator with a valid email", function(){
    field.val('valid.email@domain.com');
    validation = sentinel.validate('email')
    expect(validation[0]).toBeTruthy();
  });
  
  
});