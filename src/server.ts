import express from 'express';

import { routes } from "./routes"

const app = express();

app.use(express.json())

app.use((err, req, res, next) => {

  if(err.status === 400)
    return res.status(err.status).send('JSON formatado de forma incorreta!');

  return next(err); 
});

app.use(routes)

app.listen(3333, () => {
  console.log("Server is running ...")
})