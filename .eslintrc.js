const base = require("@mendix/pluggable-widgets-tools/configs/eslint.ts.base.json");

module.exports = {
    ...base,
    "rules": {
        "linebreak-style": ["off"],
        "prettier/prettier": [
            "error",
            {
              "endOfLine": "auto"
            }
          ]
    }
};
