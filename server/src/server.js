const express = require('express');
const cors = require('cors');
const app = express();
require('../database/mongoose');

app.use(cors({
    origin: `http://localhost:3000`,
    credentials: true
}));

app.use(express.json());


const PORT = process.env.PORT || 6969;


app.listen(PORT, () => {
    console.log(`listening on PORT ${PORT}`)
});