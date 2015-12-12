function Eliza(script) {
  this.script = script;
  this.parseScript();
}

Eliza.prototype.parseScript = function() {
  var keys = this.script.keys;

  // Convert decomp rules to regular expressions
  for (var i = 0; i < keys.length; i++) {
    var decomp = keys[i]["decomp"];

    for (var j = 0; j < decomp.length; j++) {
      var rule = decomp[j]["rule"];

      // Expand asterisks
      var hasAsterisk = /(\S*)(\s*\*\s*)(\S*)/;

      var match = rule.match(hasAsterisk);
      var left = "", right = rule;
      while (match) {
        var leftEnd = match.index + match[1].length;
        var rightStart = leftEnd + match[2].length

        left += right.substring(0, leftEnd);
        if (match[1] !== "") left += "\\b";
        left += "\\s*(.*)\\s*";
        if (match[2] !== "") left += "\\b";
        right = right.substring(rightStart, right.length);
        match = right.match(hasAsterisk);
      }
      rule = left + right;

      // Expand whitespace
      var hasWhitespace = /\s+/g;
      rule = rule.replace(hasWhitespace, "\\s+");

      decomp[j]["rule"] = rule;
    }
  }
}

// Code for testing
var test_script = {
  "keys": [
    {
      "word": "no",
      "weight": 1,
      "decomp": [
        { "rule": "*" },
        { "rule": "foo bar" }, 
        { "rule": "foo * bar"}, 
        { "rule": "* foo bar *" },
        { "rule": "* foo * bar *" },
        { "rule": "foo bar * baz boh" }
      ]
    }
  ]
};

var eliza = new Eliza(test_script);

// Print out the converted rules
var keys = eliza.script.keys;
for (var i = 0; i < keys.length; i++)
  var decomp = keys[i]["decomp"];
  for (var j = 0; j < decomp.length; j++)
    console.log(decomp[j]["rule"]);