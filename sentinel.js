(function() {
  var Sentinel;
  jQuery.fn.check = function() {
    var s;
    s = new Sentinel(this);
    window.sentinels[window.sentinels.length] = s;
    return s;
  };
  window.sentinels = [];
  window.Sentinel = Sentinel = (function() {
    function Sentinel(element) {
      this.object = {
        'element': element,
        'validations': [],
        'error_message': 'Error',
        'pass': 'ok',
        'fail': 'ko'
      };
    }
    Sentinel.prototype.init = function() {
      return this.bind_event(this.object);
    };
    Sentinel.prototype.bind_event = function(element) {
      var _this;
      _this = this;
      return ($(element.element)).each(function() {
        ($(document)).delegate("#" + (($(this)).attr('id')), 'focusin', function() {
          return _this.reset_validations($(this));
        });
        if (($(this)).is(':[type=checkbox]')) {
          ($(document)).delegate("#" + (($(this)).attr('id')), 'click', function() {
            return ($(this)).trigger('focusin').trigger('focusout');
          });
        }
        return ($(document)).delegate("#" + (($(this)).attr('id')), 'focusout', function() {
          return _this.validate_all($(this));
        });
      });
    };
    Sentinel.prototype.reset_validations = function(element) {
      return ($(element)).data('valid', true);
    };
    Sentinel.prototype.validate_all = function(element) {
      var result, _this;
      _this = this;
      result = true;
      element.each(function() {
        var el, messages, v, valid, validation, validation_result, _i, _j, _len, _len2, _ref, _ref2;
        el = $(this);
        validation_result = true;
        valid = [];
        messages = [];
        _ref = _this.object.validations;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          validation = _ref[_i];
          _ref2 = _this.validate(validation, el), valid[valid.length] = _ref2[0], messages[messages.length] = _ref2[1];
        }
        for (_j = 0, _len2 = valid.length; _j < _len2; _j++) {
          v = valid[_j];
          validation_result = validation_result && v;
        }
        el.data('valid', el.data('valid') && validation_result);
        if (el.data('valid')) {
          if (typeof _this.callbacks[_this.object.pass] === 'function') {
            _this.callbacks[_this.object.pass](el);
          } else {
            _this.callbacks['ok'](_this.object.el);
          }
        }
        if (!el.data('valid')) {
          if (typeof _this.callbacks[_this.object.fail] === 'function') {
            _this.callbacks[_this.object.fail](el, messages.pop());
          } else {
            _this.callbacks['ko'](el);
          }
        }
        result = result && el.data('valid');
      });
      console.log(result);
      return result;
    };
    Sentinel.prototype.validate = function(validation, element) {
      if (element == null) {
        element = this.object.element;
      }
      if (typeof validation === 'string') {
        return [this.validations[validation](element), this.object.error_message];
      }
      if (typeof validation === 'object') {
        return [this.validations[validation.validation](element), validation.message];
      }
    };
    Sentinel.prototype.validations = {
      email: function(element) {
        var regexp;
        regexp = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return !!(regexp.test(jQuery.trim(element.val())));
      },
      presence: function(element) {
        return (jQuery.trim(element.val())) !== '';
      },
      confirmation: function(element) {
        var compare_to;
        compare_to = element.attr('id').replace(/_\w[^_]+$/, '');
        return element.val() === ($("#" + compare_to)).val();
      },
      acceptance: function(element) {
        console.log(element.val());
        return !!(element.attr('checked'));
      }
    };
    Sentinel.prototype.callbacks = {
      ok: function(element, message) {
        if (element.parent().hasClass('field_with_errors')) {
          element.parent().removeClass('field_with_errors');
        }
        if (!element.parent().hasClass('ok')) {
          element.parent().addClass('ok');
        }
        return element.parent().find('div.error').remove();
      },
      ko: function(element, message) {
        if (element.parent().hasClass('ok')) {
          element.parent().removeClass('ok');
        }
        if (!element.parent().hasClass('field_with_errors')) {
          element.parent().addClass('field_with_errors');
        }
        if (element.parent().find('div.error').length === 0) {
          return element.parent().append('<div class="error">' + message + '</div>');
        }
      }
    };
    Sentinel.prototype.add_custom_validator = function(name, func) {
      return this.validators[name] = func;
    };
    Sentinel.prototype.add_custom_callback = function(name, func) {
      return this.callbacks[name] = func;
    };
    Sentinel.prototype["with"] = function(validations) {
      if (validations instanceof Array) {
        this.object.validations = validations;
      }
      if (!(validations instanceof Array)) {
        this.object.validations[this.object.validations.length] = validations;
      }
      return this;
    };
    Sentinel.prototype.pass = function(callback) {
      if (callback) {
        this.object.pass = callback;
      }
      return this;
    };
    Sentinel.prototype.fail = function(callback) {
      if (callback) {
        this.object.fail = callback;
      }
      return this;
    };
    return Sentinel;
  })();
}).call(this);
