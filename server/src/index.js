const app = require('./app');
const io = require('./socket');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`>>> Server is running & listening on ${PORT} <<<`);
});

io.attach(app, {
    cors: {
        origin: "*"
    }
});