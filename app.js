import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import bodyparser from 'body-parser';
import path from 'path';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(morgan('combined'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/`));
app.use(express.static(path.join(__dirname, '../public')));


app.use(cors());
app.use('/', (req, res, next) => {
    res.send({
        status: 200,
        message: 'welcome to amazon api endpoints'
    })
    next(err);
});

require('./index.js')(app);

 app.listen(process.env.PORT || 8080);
 console.log(`Server started on port 8080`);

export default app;
