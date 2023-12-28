module.exports =  {
  "presets": [
  ["@babel/preset-env", {
    "targets": {
      "node": "current",
      "browsers": [
      "> 0.2%, not dead",
      "not IE 11",
      "Safari > 11, iOS > 11"
      ]
    },
    "useBuiltIns": "entry",
    "corejs": 3
  }]
  ],
  "plugins": [
  "@babel/plugin-proposal-optional-chaining",
  "@babel/plugin-proposal-class-properties"
  ]
}