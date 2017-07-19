const $ = require("jquery");
exports.newResultField = function(name) {
    return $(`
        <div class="result" data-command="${name}">${name}</div>
    `);
}