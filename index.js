    //i use npm package of mws api
import MWSClient from 'mws-api';
import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

module.exports= (app) => {
  app.get('/product', (req, res, next) => {

    const mws = new MWSClient({
      host: 'mws.amazonservices.co.uk', // just for other countries
      accessKeyId: 'key_name',
      secretAccessKey: 'secret_key',
      merchantId: 'marchant_id',
      meta: {
        retry: true,
        next: true, // auto-paginate
        limit: 10,//number of product to be listed
      }
    });

    // just to fetch the orders
    mws.Orders.ListOrders({
      MarketplaceId: 'market_id',
      MaxResultsPerPage: 10,
      CreatedAfter: new Date(1,1,2020),
      CreatedBefore: new Date(1,2,2020)
    })
    .then(({ result, metadata }) => {
      // return result
      res.status(200).json({
        status: 200,
        message: result,
      });
      next(err);
    });
  });
  app.post('/check/email', async (req, res, next)=>{
    const { email } = req.body;
    const checkPasswordInputn = (email) => {
    const validPasswordRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return validPasswordRegex.test(email)
  }
  if(!checkPasswordInputn(email)) {
    return res.status(422).json({
      status: 422,
      error: 'invalid email'
    })
  }
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    const mailOptio = {
      from: 'barefootnomad.noreply@gmail.com',
      to: `${email}`,
      subject: 'Thank you for ...,',
      text: `This is to inform you that ...... of your .........`,
    };

    await transport.sendMail(mailOptio, (err, json) => {
      if (err) return res.json({
          status: 400,
          error: err
        });
      return res.status(200).json({
        status: 200,
        message: 'Email sent b'
      });
    });
    
  });

  app.use((req, res, next) => {
    const err = new Error('Page not found');
    err.status = 404;
    next(err);
  });

  // eslint-disable-next-line no-unused-vars
  app.use((error, req, res, next) => {
    const status = error.status || 500;
    res.status(status);
    res.json({
      status,
      error: error.message,
    });
  });
};
