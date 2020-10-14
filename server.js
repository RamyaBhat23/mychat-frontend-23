var express = require('express');
const app = express();
app.use(express.static('/dist/my-chat'));

app.get('/*', function(req, res) {
    res.sendFile('index.html', { root: '/dist/my-chat' });
});
app.listen(process.env.PORT || 8080, () => {
    console.log("http://localhost:8080");
});