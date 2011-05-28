(function() {
  var Sentinel;
  jQuery.fn.sentinel = function() {
    if (!($(this)).data('sentinel')) {
      ($(this)).data('sentinel', new Sentinel(this));
    }
    return ($(this)).data('sentinel');
  };
  window.Sentinel = Sentinel = (function() {
    function Sentinel(form) {
      this.form = $(form);
    }
    Sentinel.prototype.fields = [];
    Sentinel.prototype.defaults = {
      'success': 'ok',
      'fail': 'ko',
      'error_message': 'Error'
    };
    Sentinel.prototype.validations = {
      email: function(element, context) {
        var regexp;
        regexp = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return !!(regexp.test(jQuery.trim(element.val())));
      },
      presence: function(element, context) {
        return (jQuery.trim(element.val())) !== '';
      },
      confirmation: function(element, context) {
        var compare_to;
        compare_to = element.attr('id').replace(/_\w[^_]+$/, '');
        return element.val() === (context.find("#" + compare_to)).val();
      },
      acceptance: function(element, context) {
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
          element.parent().append('<div class="error">' + message + '</div>');
        }
        if (element.parent().find('div.error').length !== 0) {
          return element.parent().find('div.error').text(message);
        }
      }
    };
    Sentinel.prototype.check = function(selector) {
      this.fields.push({
        'selector': selector,
        'validations': []
      });
      return this;
    };
    Sentinel.prototype["for"] = function(validations) {
      var field, validation, _i, _len, _ref;
      field = this.fields.pop();
      _ref = validations.split(',');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        validation = _ref[_i];
        field.validations.push({
          'validation': validation
        });
      }
      this.fields.push(field);
      return this;
    };
    Sentinel.prototype.error_message = function(error_message) {
      var field, validation, _i, _len, _ref;
      field = this.fields.pop();
      _ref = field.validations;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        validation = _ref[_i];
        if (!validation.error_message) {
          validation.error_message = error_message;
        }
      }
      this.fields.push(field);
      return this;
    };
    Sentinel.prototype.start = function() {
      var field, _i, _len, _ref;
      _ref = this.fields;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        field = _ref[_i];
        this.set_defaults(field);
      }
      this.bind_events();
      return this;
    };
    Sentinel.prototype.set_defaults = function(field) {
      var i, validation, _ref, _results;
      _results = [];
      for (i = 0, _ref = field.validations.length; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
        validation = field.validations.shift();
        validation = $.extend({}, this.defaults, validation);
        _results.push(field.validations.push(validation));
      }
      return _results;
    };
    Sentinel.prototype.bind_events = function() {
      var field, index, _len, _ref, _this;
      _this = this;
      _ref = this.fields;
      for (index = 0, _len = _ref.length; index < _len; index++) {
        field = _ref[index];
        this.set_local_events(field, index);
      }
      return ($(document)).delegate(this.form.selector, 'submit', function() {
        return _this.validate_all();
      });
    };
    Sentinel.prototype.set_local_events = function(field, index) {
      var _this;
      _this = this;
      return (_this.form.find(field.selector)).each(function() {
        var element;
        element = $(this);
        if (!element.data('selector_index')) {
          element.data('selector_index', []);
        }
        element.data('selector_index').push(index);
        if (element.data('selector_index').length === 1) {
          _this.form.delegate("#" + (($(this)).attr('id')), 'focusin', function() {
            return _this.reset_validations($(this));
          });
          if ($(this)) {
            _this.form.delegate("#" + (($(this)).attr('id')), 'click', function() {
              if (($(this)).is('input:[type=checkbox], input:[type=radio], select')) {
                return ($(this)).trigger('focusin').trigger('focusout');
              }
            });
          }
          return _this.form.delegate("#" + (($(this)).attr('id')), 'focusout', function() {
            return _this.validate($(this));
          });
        }
      });
    };
    Sentinel.prototype.reset_validations = function(element) {
      return ($(element)).data('valid', true);
    };
    Sentinel.prototype.validate_all = function() {
      var field, valid, _i, _len, _ref, _this;
      valid = true;
      _this = this;
      _ref = this.fields;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        field = _ref[_i];
        this.reset_validations(field.selector);
        ($(field.selector)).each(function() {
          var current_validation;
          current_validation = _this.validate($(this, _this.form));
          valid = valid && current_validation;
        });
      }
      return valid;
    };
    Sentinel.prototype.validate = function(element) {
      var valid, validation, validations, _i, _len;
      valid = element.data('valid');
      validations = this.collect_validations(element);
      for (_i = 0, _len = validations.length; _i < _len; _i++) {
        validation = validations[_i];
        valid = valid && this.validations[validation.validation](element, this.form);
        if (!valid) {
          this.callbacks[validation.fail](element, validation.error_message);
          break;
        }
      }
      if (valid) {
        this.callbacks[validation.success](element, validation.error_message);
      }
      element.data('valid', valid);
      return valid;
    };
    Sentinel.prototype.collect_validations = function(element) {
      var selector_index, validations, _i, _len, _ref;
      validations = [];
      _ref = ($(element)).data('selector_index');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        selector_index = _ref[_i];
        validations = validations.concat(this.fields[selector_index].validations);
      }
      return validations;
    };
    return Sentinel;
  })();
}).call(this);
