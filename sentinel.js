/* DO NOT MODIFY. This file was compiled Fri, 20 May 2011 10:32:18 GMT from
 * /Users/marchino/Sites/mmplus/app/coffeescripts/registration/personal_data_validation.coffee
 */

(function() {
  var Sentinel;
  jQuery.fn.check = function() {
    return new Sentinel(this);
  };
  window.Sentinel = Sentinel = (function() {
    function Sentinel(element) {
      this.object = {
        'element': element,
        'validations': ['presence'],
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
      return ($(document)).delegate(_this.object.element.selector, 'focusout', function() {
        var valid, validation, _i, _len, _ref;
        valid = true;
        _ref = _this.object.validations;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          validation = _ref[_i];
          valid = valid && (_this.validate($(_this.object.element), validation));
        }
        if (valid) {
          if (typeof _this.callbacks[_this.object.pass] === 'function') {
            _this.callbacks[_this.object.pass]();
          } else {
            _this.callbacks['ok']();
          }
        }
        if (!valid) {
          if (typeof _this.callbacks[_this.object.fail] === 'function') {
            return _this.callbacks[_this.object.fail]();
          } else {
            return _this.callbacks['ko']();
          }
        }
      });
    };
    Sentinel.prototype.validate = function(element, validation) {
      return this.validations[validation](element);
    };
    Sentinel.prototype.validations = {
      email: function(element) {
        return true;
      },
      presence: function(element) {
        return false;
      }
    };
    Sentinel.prototype.callbacks = {
      ok: function() {},
      ko: function() {
        return alert('error');
      }
    };
    Sentinel.prototype.add_custom_validator = function(name, func) {
      return this.validators[name] = func;
    };
    Sentinel.prototype.add_custom_callback = function(name, func) {
      return this.callbacks[name] = func;
    };
    Sentinel.prototype["with"] = function(validations) {
      if (typeof validations === 'object' && validations.length > 0) {
        this.object.validations = validations;
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