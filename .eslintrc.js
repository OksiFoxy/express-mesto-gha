// module.exports = {
//     "env": {
//         "browser": true,
//         "es2021": true
//     },
//     "extends": [
//         "eslint:recommended",
//         "plugin:react/recommended",
//         "extends": "airbnb-base"
//     ],
//     "parserOptions": {
//         "ecmaVersion": "latest"
//     },
//     "plugins": [
//         "react"
//     ],
//     "rules": {
//     }
// }

{
  "extends": "airbnb-base",
  "rules": {
    "no-underscore-dangle": ["error", { "allow": ["_id"] }]
  }
}