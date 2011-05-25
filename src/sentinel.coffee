jQuery.fn.check = () ->
  s = new Sentinel(this)
  window.sentinels[window.sentinels.length] = s
  s
  
window.sentinels = []
window.Sentinel = class Sentinel
  constructor: (element) ->
    @object = {
      'element' : element,
      'validations' : [],
      'error_message' : 'Error', 
      'pass' : 'ok'
      'fail' : 'ko'
      }
  init: ->
    @bind_event @object
  bind_event: (element) ->
    _this = this    
    ($ element.element).each ->
      ($ document).delegate "##{($ this).attr('id')}", 'focusin', ->
        _this.reset_validations ($ this) 
      if ($ this).is(':[type=checkbox]')    
        ($ document).delegate "##{($ this).attr('id')}", 'click', ->
          ($ this).trigger('focusin').trigger('focusout')
        
      ($ document).delegate "##{($ this).attr('id')}", 'focusout', ->
        _this.validate_all ($ this)

  reset_validations: (element) ->
    ($ element).data('valid', true)
    
  validate_all: (element) ->
    _this = this
    result = true
    element.each ->
      el = ($ this)
      validation_result = true
      valid = []
      messages = []
      [valid[valid.length], messages[messages.length]] = (_this.validate validation, el) for validation in _this.object.validations
      (validation_result = validation_result && v) for v in valid
      el.data('valid', el.data('valid') && validation_result)
      (if typeof _this.callbacks[_this.object.pass] == 'function' then _this.callbacks[_this.object.pass](el) else _this.callbacks['ok'](_this.object.el)) if el.data('valid')
      (if typeof _this.callbacks[_this.object.fail] == 'function' then _this.callbacks[_this.object.fail](el, messages.pop()) else _this.callbacks['ko'](el)) unless el.data('valid')
      result = result && el.data('valid')
      return
    console.log result
    return result
        
  validate: (validation, element = @object.element) ->
    return [@validations[validation](element), @object.error_message] if typeof validation == 'string'
    return [@validations[validation.validation](element), validation.message] if typeof validation == 'object'
    
  validations: {
      email: (element) ->
        regexp = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
        return !!(regexp.test (jQuery.trim element.val()));
      presence: (element) ->
        return (jQuery.trim element.val()) != ''
      confirmation: (element) ->
        compare_to = element.attr('id').replace(/_\w[^_]+$/, '')
        return element.val() == ($ "##{compare_to}").val()
      acceptance: (element) ->
        console.log element.val()
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
    }
    
  add_custom_validator: (name, func) ->
    @validators[name] = func
    
  add_custom_callback: (name, func) ->
    @callbacks[name] = func
  
  with: (validations) ->
    @object.validations = validations if validations instanceof Array
    @object.validations[@object.validations.length] = validations unless validations instanceof Array
    this
    
  pass: (callback) ->
    @object.pass = callback if callback
    this
    
  fail: (callback) ->
    @object.fail = callback if callback  
    this