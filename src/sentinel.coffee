jQuery.fn.check = () ->
  new Sentinel(this)


window.Sentinel = class Sentinel
  constructor: (element) ->
    @object = {
      'element' : element,
      'validations' : ['presence'] 
      'pass' : 'ok'
      'fail' : 'ko'
      }
  init: ->
    @bind_event @object
  bind_event: (element) ->
    _this = this
    ($ document).delegate _this.object.element.selector, 'focusout', ->
      valid = true
      valid = valid && (_this.validate validation) for validation in _this.object.validations
      (if typeof _this.callbacks[_this.object.pass] == 'function' then _this.callbacks[_this.object.pass]() else _this.callbacks['ok']()) if valid
      (if typeof _this.callbacks[_this.object.fail] == 'function' then _this.callbacks[_this.object.fail]() else _this.callbacks['ko']()) unless valid
        
  validate: (validation) ->
    @validations[validation](@object.element)
    
  validations: {
      email: (element) ->
        return false
      presence: (element) ->
        return (jQuery.trim element.val()) != ''
      # more validators to be added
    }
    
  callbacks: {
      ok: -> 
        # do nothing, it's all good
      ko: ->
        alert('error')
    }
    
  add_custom_validator: (name, func) ->
    @validators[name] = func
    
  add_custom_callback: (name, func) ->
    @callbacks[name] = func
  
  with: (validations) ->
    @object.validations = validations if typeof validations == 'object' && validations.length > 0
    this
    
  pass: (callback) ->
    @object.pass = callback if callback
    this
    
  fail: (callback) ->
    @object.fail = callback if callback  
    this