/** 
 * Handlebar util helpers 
 */

var log = require('bunyan').createLogger({
    name: 'handlebars-helpers',
    level: 'TRACE'
});

module.exports = {};

/**
 * ex {{#str_longer_than strName len=10}}
 */
module.exports.stringLongerThan = function(conditional_str, options) {
    if (conditional_str !== undefined && options.hash["len"] && conditional_str.length > parseInt(options.hash["len"])) {
        return options.fn(this);
    }
};

/**
 * Returns an object with keys being custom helper names and values being the corresponding handler functions
 */
module.exports.load_helpers = function () {
    return {
        'strlen_gt': module.exports.stringLongerThan
    };
};
