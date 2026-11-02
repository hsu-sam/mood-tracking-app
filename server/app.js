import express from 'express';

const app = express();

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res
    .status(200)
    .json({ message: 'Hello from the server side!', app: 'Mood Tracking App' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
