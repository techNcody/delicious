const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
  .then((con) => {
    // console.log(con.connections);
    console.log(`DB connection successfull..`);
  });

const app = require('./app');

// const hostname = process.env.HOST;
// const port = process.env.PORT || 3000;
app.listen(process.env.PORT, () => {
  console.log(`Server running at: ${process.env.PORT}`);
});
