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

const axios = require('axios');

const openaiApiKey = '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';
const apiUrl = 'https://openai.wndbac.cn/v1/chat/completions';
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${openaiApiKey}`
};


// 处理 GET 请求的示例路由
app.get('/api/expandWrite', async (req, res) => {
  try {
    // 从请求中获取参数
    const question = req.query.question
    const num = req.query.num

    const prompt = `请你扮演相似问题扩写助手，我会给你提供的问题样例和扩写数量，然后你进行扩写，尽量差异化和口语化，输出的问题之间使用换行符进行分隔`;

    const answer = '好的，请你输入问题和扩写数量'

    const command = '扩写问题是：' + question + "\n扩写数量是：" + num

    const requestData = {
      model: 'gpt-3.5-turbo',
      messages: [
        { "role": "system", "content": prompt },
        { "role": "assistant", "content": answer },
        { "role": "user", "content": command },
      ]
    };

    const response = await axios.post(apiUrl, requestData, { headers });
    console.log(JSON.stringify(response.data));
    const content = response.data.choices[0].message.content
    
    // 在返回的内容外包装 <pre> 标签
    const formattedContent = `<pre>${content}</pre>`;
    
    // 设置响应头，指定返回内容为 HTML
    res.setHeader('Content-Type', 'text/html');
    
    // 将带有格式的内容作为响应返回
    res.send(formattedContent);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.get('/api/answer', async (req, res) => {
  try {
    // 从请求中获取参数
    const question = req.query.question
    const num = req.query.num

    const prompt = `请你扮演一位资深的外呼客服，我会提供询问你的问题和让你输出回答的数量，然后你进行回答，回答尽量差异化和口语化，输出的回答之间使用换行符进行分隔`;

    const answer = '好的，请你输入需要我回答的问题和回答问题的数量，我会尽力提供差异化和口语化的回答'

    const command = '回答的问题是：' + question + "\n回答的数量是：" + num

    const requestData = {
      model: 'gpt-3.5-turbo',
      messages: [
        { "role": "system", "content": prompt },
        { "role": "assistant", "content": answer },
        { "role": "user", "content": command },
      ]
    };

    const response = await axios.post(apiUrl, requestData, { headers });
    console.log(JSON.stringify(response.data));
    const content = response.data.choices[0].message.content
    
    // 在返回的内容外包装 <pre> 标签
    const formattedContent = `<pre>${content}</pre>`;
    
    // 设置响应头，指定返回内容为 HTML
    res.setHeader('Content-Type', 'text/html');
    
    // 将带有格式的内容作为响应返回
    res.send(formattedContent);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'An error occurred' });
  }
});



// 启动服务器，监听特定端口
app.listen(3000, () => {
  console.log('API 服务器已启动，端口号：3000');
});
