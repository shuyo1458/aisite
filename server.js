const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('public'));

const API_KEY = 'sk-NUZWQZBSjJSzXIha67283bD30a45498bBeFd3b738b54B9E1';
const API_URL = 'https://free.gpt.ge/v1/chat/completions';

// 添加調試日誌
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// 添加根路由處理
app.get('/', (req, res) => {
    console.log('Serving index.html');
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

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

// 添加通配符路由
app.get('*', (req, res) => {
    console.log(`Wildcard route hit: ${req.url}`);
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 添加錯誤處理中間件
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).send('Something broke!');
});

// 為了在本地測試，添加以下代碼
if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

module.exports = app;
