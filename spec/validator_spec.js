describe("Sentinel", function() {

  Sentinel.prototype.callbacks.custom_callback = function(){
    console.log('this is a custom callback');
  }
  
  var form = $('<form><input class="required" id="field" /><input class="required" id="field_confirmation" /></form>');
  var sentinel = form.sentinel().check('#field').for('presence, email');
  var field = form.find('#field');
  var field_confirmation = form.find('#field_confirmation')
  

  it("should perform 2 tests on one field", function() {
    expect(sentinel.fields.length).toEqual(1)
    expect(sentinel.fields[0].validations.length).toEqual(2);
  });
  
  it("should have 3 test after another call to for", function(){
    sentinel.for('confirmation')
    expect(sentinel.fields[0].validations.length).toEqual(3);
  });
  
  it("should fail on the presence validator without a value for the field", function(){
    validation = sentinel.validations.presence(field, sentinel.form)
    expect(validation).toBeFalsy();
  });
  
  it("should pass on the presence validator if a value is set", function(){
    field.val('some value');
    validation = sentinel.validations.presence(field, sentinel.form)
    expect(validation).toBeTruthy();
  });
  
  it("should fail on the presence validator with a series of spaces as value", function(){
    field.val('        ');
    validation = sentinel.validations.presence(field, sentinel.form)
    expect(validation).toBeFalsy();
  });
  
  it("should fail on the email validator without a valid email", function(){
    field.val('not a valid email address');
    validation = sentinel.validations.email(field, sentinel.form)
    expect(validation).toBeFalsy();
  });
  
  it("should pass on the email validator with a valid email", function(){
    field.val('valid.email@domain.com');
    validation = sentinel.validations.email(field, sentinel.form)
    expect(validation).toBeTruthy();
  });
  
  it("should not pass on the confirmation validator without a value for the confirmation field", function(){
    sentinel.check('#field_confirmation').for('confirmation');
    field.val('valid.email@domain.com');
    validation = sentinel.validations.confirmation(field_confirmation, sentinel.form);
    expect(validation).toBeFalsy();
  });
  
  it("should not pass on the confirmation validator with a wrong value for the confirmation field", function(){
    sentinel.check('#field_confirmation').for('confirmation');
    field.val('valid.email@domain.com');    
    field_confirmation.val('wrong value');
    validation = sentinel.validations.confirmation(field_confirmation, sentinel.form);
    expect(validation).toBeFalsy();
  });
  
  it("should pass on the confirmation validator with the right value for the confirmation field", function(){
    sentinel.check('#field_confirmation').for('confirmation');
    field.val('valid.email@domain.com');
    field_confirmation.val('valid.email@domain.com');
    validation = sentinel.validations.confirmation(field_confirmation, sentinel.form);
    expect(validation).toBeTruthy();
  });
  
  it("should not assign a custom callback if it doesn't exist", function(){
    sentinel.success('invalid_callback');
    var field = sentinel.fields[sentinel.fields.length-1];
    result = true
    for(var i=0;i<field.validations.length;i++){
      result = result && field.validations[i].success == 'invalid_callback'
    }
    expect(result).toBeFalsy();
  });
  
  it("should assign a custom callback if it does exist", function(){
    sentinel.success('custom_callback');
    var field = sentinel.fields[sentinel.fields.length-1];
    result = true
    for(var i=0;i<field.validations.length;i++){
      result = result && field.validations[i].success == 'custom_callback'
    }
    expect(result).toBeTruthy();
  });
 
 
  
});