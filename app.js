require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const validateApiValidation = require('./module/auth');
const { db } = require('./module/db');

app.use(validateApiValidation);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/****************/
/* Routes Start */
/****************/

app.use('/', require('./routes/index'));
app.use('/user', require('./routes/user'));
app.use('/user/getusers', require('./routes/user/getusers'));
app.use('/user/getuserbyid', require('./routes/user/getuserbyid'));
app.use('/user/getuserbyemail', require('./routes/user/getuserbyemail'));
app.use('/user/getuserbyphone', require('./routes/user/getuserbyphone'));
app.use('/user/searchusersbyname', require('./routes/user/searchusersbyname'));
app.use('/user/checkuserauthentication', require('./routes/user/checkuserauthentication'));
app.use('/user/adduser', require('./routes/user/adduser'));
app.use('/user/updateuser', require('./routes/user/updateuser'));
app.use('/user/deleteuser', require('./routes/user/deleteuser'));

/**************/
/* Routes End */
/**************/

const startServer = async () => {

  const connection = await db();

  if (!connection.ok) {
    console.error('Database is unreachable. Server will start, but database routes may fail until the connection works.');
  }

  app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
  });

};

startServer();