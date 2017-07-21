const $ = require("jquery");
exports.newResultField = function(name) {
    return $(`
        <div class="result" data-command="${name}"><div>${name}</div></div>
    `);
}