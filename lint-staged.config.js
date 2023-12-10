/* eslint-disable */
const micromatch = require('micromatch')

module.exports = {
  '*.{js,ts}': () => 'yarn ts:audit',
  '*': files => {
    const toLint = micromatch(files, ['**/*.{ts,js}']).join(' ')
    const toFormat = files.join(' ')
    return [`yarn eslint --fix ${toLint}`, `yarn prettier --ignore-unknown --write ${toFormat}`]
  },
}
