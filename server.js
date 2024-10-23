const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());
app.use(express.static('public'));

const API_KEY = 'sk-NUZWQZBSjJSzXIha67283bD30a45498bBeFd3b738b54B9E1';
const API_URL = 'https://free.gpt.ge/v1/chat/completions';

app.post('/api/chat', async (req, res) => {
    try {
        const response = await axios.post(API_URL, {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: req.body.message }],
        }, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        res.json({ reply: response.data.choices[0].message.content });
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});

// 添加錯誤處理中間件
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// 移除 app.listen，改為導出 app
module.exports = app;
