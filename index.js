const Trie = require('./src/trie');

/**
 * Generates a regular expression that matches the given input strings.
 * @param {Array<string>} inputs
 * @param {string} flags
 * @return {RegExp}
 */
function regexgen(inputs, flags) {
  let trie = new Trie;
  trie.addAll(inputs);
  return trie.toRegExp(flags);
}

regexgen.Trie = Trie;
module.exports = regexgen;

function replaceAsciiWithStr(text) {
  const regex = /\\u([\d\w]{4})/gi;
  return text.replace(regex, function (match, grp) {
    return String.fromCharCode(parseInt(grp, 16));
  });
}

const express = require('express');
const app = express();

// 处理 GET 请求的示例路由
app.get('/api/myendpoint', (req, res) => {
  // 从请求中获取参数
  const keyWord = req.query.keyWord
  console.log("关键字：" + keyWord)
  let keyWords = keyWord.split(",")
  let regular = regexgen(keyWords).source
  let regularStr = replaceAsciiWithStr(regular);
  console.log("正则表达式：" + regularStr)
  res.send(regularStr)
});

// 启动服务器，监听特定端口
app.listen(3000, () => {
  console.log('API 服务器已启动，端口号：3000');
});
