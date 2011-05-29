# $('form').sentinel()
#   .check('.required')
#   .for('presence')
#   .error_message('mandatory field')

jQuery.fn.sentinel = () ->
  ($ this).data 'sentinel', new Sentinel(this) unless ($ this).data 'sentinel'
  return ($ this).data 'sentinel'
  
window.Sentinel = class Sentinel
  constructor: (form) ->
    @form = ($ form)
    
  fields : []
  
  defaults : {
    'success' : 'ok',
    'fail' : 'ko',
    'error_message' : 'Error'
  }
  
  validations: {
    email: (element, context) ->
      regexp = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
      return !!(regexp.test (jQuery.trim element.val()));
    presence: (element, context) ->
      return (jQuery.trim element.val()) != ''
    confirmation: (element, context) ->
      compare_to = element.attr('id').replace(/_\w[^_]+$/, '')
      return element.val() == (context.find "##{compare_to}").val()
    acceptance: (element, context) ->
      return !!(element.attr('checked'))
    # more validators to be added
  }
  
  callbacks: {
    ok: (element, message) -> 
      element.parent().removeClass('field_with_errors') if element.parent().hasClass('field_with_errors')
      element.parent().addClass('ok') unless element.parent().hasClass('ok')
      element.parent().find('div.error').remove()
    ko: (element, message) ->
      element.parent().removeClass('ok') if element.parent().hasClass('ok')
      element.parent().addClass('field_with_errors') unless element.parent().hasClass('field_with_errors')
      element.parent().append('<div class="error">'+message+'</div>') if element.parent().find('div.error').length == 0
      element.parent().find('div.error').text(message) unless element.parent().find('div.error').length == 0
  }
  
  # selector -> string
  check: (selector) ->
    @fields.push { 'selector' : selector, 'validations' : [] }  
    return this
  
  # validation -> comma separated string of validations
  for: (validations) ->
    field = @fields.pop()
    (field.validations.push { 'validation' : validation }) for validation in validations.split(',') 
    @fields.push field
    return this
  
  # error_message -> string  
  error_message: (error_message) ->
    field = @fields.pop()
    for validation in field.validations
      validation.error_message = error_message unless validation.error_message 
    @fields.push field
    return this  
  
  success: (name) ->
    field = @fields.pop()
    for validation in field.validations
      validation.success = name if typeof @validations[name] == 'function' and not validation.success
    @fields.push field
    return this
    
  fail: (name) ->
    field = @fields.pop()
    for validation in field.validations
      validation.fail = name if typeof @validations[name] == 'function' and not validation.success
    @fields.push field
    return this

  start: () ->
    for field in @fields
      @set_defaults field
    @bind_events()        
    this
    
  set_defaults: (field) ->
    for i in [0..(field.validations.length)]
      validation = field.validations.shift()
      validation = $.extend({}, @defaults, validation)
      field.validations.push validation
    
  bind_events: ->
    _this = this
    @set_local_events(field, index) for field,index in @fields
    ($ document).delegate @form.selector, 'submit', ->
      _this.validate_all()
    
  set_local_events: (field, index) ->
    _this = this
    (_this.form.find field.selector).each ->
      element = ($ this)
      element.data('selector_index', []) unless element.data('selector_index')
      element.data('selector_index').push index
      if element.data('selector_index').length == 1
        _this.form.delegate "##{($ this).attr('id')}", 'focusin', ->
          _this.reset_validations ($ this) 
        if ($ this)
          _this.form.delegate "##{($ this).attr('id')}", 'click', ->
            ($ this).trigger('focusin').trigger('focusout') if ($ this).is('input:[type=checkbox], input:[type=radio], select')    
        _this.form.delegate "##{($ this).attr('id')}", 'focusout', ->
          _this.validate ($ this)
      

  reset_validations: (element) ->
    ($ element).data('valid', true)
  
  validate_all: () ->
    valid = true
    _this = this
    for field in @fields
      @reset_validations field.selector
      ($ field.selector).each ->
        console.log(field.selector)
        current_validation = _this.validate ($ this, _this.form)
        valid = valid && current_validation
        return
    return valid
    
  validate: (element) ->
    valid = element.data('valid')
    validations = @collect_validations element
    console.log validations
    for validation in validations
      valid = valid && @validations[validation.validation](element, @form) 
      unless valid
        @callbacks[validation.fail](element, validation.error_message)
        break
    @callbacks[validation.success](element, validation.error_message) if valid
    element.data('valid', valid)
    valid
    
  collect_validations: (element) ->
    validations = []
    for selector_index in ($ element).data('selector_index')
      validations = validations.concat @fields[selector_index].validations
    validations
    
    
      
      
