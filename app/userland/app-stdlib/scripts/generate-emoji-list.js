const fs = require('fs')

const DISALLOWED = new Set([
  '๐ซ',
  '๐ช',
  '๐',
  '๐ก๏ธ'
])

var emojiDataStr = fs.readFileSync(require('path').join(__dirname, 'emoji-data.txt'), 'utf8')

var groups = []
for (let groupStr of emojiDataStr.split('# group: ').slice(1)) {
  let name = (/(.*)\n/.exec(groupStr))[1]
  let emojis = new Set()

  if (name === 'Component') {
    continue // skip
  }

  let re = /$([0-9A-F\.\s]+);/gim
  let match
  while ((match = re.exec(groupStr))) {
    let emoji = match[1].trim().split(' ').map(v => String.fromCodePoint(parseInt(v, 16))).join('') // parse out emoji
    emoji = emoji.replace(/๐ป|๐ผ|๐ฝ|๐พ|๐ฟ/g, '') // strip skin tones
    if (DISALLOWED.has(emoji)) continue // skip disallowed emojis
    emojis.add(emoji)
  }

  groups.push({name, emojis: Array.from(emojis)})
}

fs.writeFileSync(require('path').join(__dirname, 'emoji-list.js'), `
export const SUGGESTED = [
  "โค",
  "๐",
  "๐ฅ",
  "๐",
  "โจ",
  "๐",
  '๐',
  '๐',
  "๐",
  '๐ข',
  "๐",
  "๐ฎ",
  '๐ก',
  "๐ค",
  "๐คญ",
  "๐ค",
  "๐คจ",
  "๐คฏ",
  '๐',
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐ช",
  "๐",
  "โ",
  "๐",
  "๐ค",
]

export const GROUPS = ${JSON.stringify(groups, null, 2)}

export const FULL_LIST = GROUPS.map(({emojis}) => emojis).reduce((acc, v) => acc.concat(v), [])
`)