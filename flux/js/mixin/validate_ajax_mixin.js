'use strict';
// require using with validator mixin
module.exports = {
    isValidateAjax: function () {
        if (!this.props.errors) return true;
        for (var field in this.props.errors) {
            if (!this.props.errors.hasOwnProperty(field)) continue;
            if (this.props.errors[field] instanceof Array && this.props.errors[field].length > 0) return true;
        }
        return false;
    },
    validateAjax: function (field, funcValue, except, api, timeout) {
        this.validateAjaxTimeout = this.validateAjaxTimeout || {};
        return function () {
            if(except){
                if(typeof  except == 'object'){
                    if(JSON.stringify(funcValue()).toLowerCase() == JSON.stringify(except).toLowerCase()){
                        return;
                    }
                }else{
                    if(funcValue().toLowerCase() == except.toLowerCase()){
                        return;
                    }
                }
            }
            if (this.props.errors[field]) {
                if (this.validateAjaxTimeout[field]) {
                    clearTimeout(this.validateAjaxTimeout[field]);
                    this.validateAjaxTimeout[field] = null;
                }
                return;
            }
            //this.props.errors[field] = ["checking " + field];
            this.forceUpdate(function () {
                if (this.validateAjaxTimeout[field]) {
                    clearTimeout(this.validateAjaxTimeout[field]);
                }
                this.validateAjaxTimeout[field] = setTimeout(function () {
                    var post = {
                        value: funcValue(),
                        except: except
                    };
                    api(post)
                        .then(function (res) {
                            this.props.errors[field] = null;
                        }.bind(this)).catch(function (err) {
                            this.props.errors[field] = [err.data.message];
                        }.bind(this))
                        .finally(function () {
                            this.validateAjaxTimeout[field] = null;
                            this.forceUpdate();
                        }.bind(this))
                        .done()
                }.bind(this), timeout || 500);
            }.bind(this));
        }.bind(this);
    }
};