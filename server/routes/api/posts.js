const express = require('express');
const mongodb = require('mongodb');

const router = express.Router();

// Get posts
router.get('/', async (request, response) => {
  const posts = await loadPostCollection();
  response.send(await posts.find({}).toArray());
})
// Add posts
router.post('/', async (request, response) => {
  const posts = await loadPostCollection();
  await posts.insertOne({
    text: request.body.text,
    createdAt: new Date()
  });
  response.status(201).send({ sucess: true });
})
// Delete posts
router.delete('/:id', async (request, response) => {
  const posts = await loadPostCollection();
  await posts.deleteOne({ _id: new mongodb.ObjectId(request.params.id) });
  response.status(200).send({ sucess: true });
})
// Patch posts


async function loadPostCollection() {
  const client = await mongodb.MongoClient.connect('mongodb+srv://alexandr0095:08SA108ser@cluster0.exetvsg.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true
  }).catch((e) => console.log(e))
  return client.db('fullStack-Nuxt3').collection('posts');
}
module.exports = router;