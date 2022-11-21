const express = require('express');
const mongodb = require('mongodb');

const router = express.Router();

// Get catalog
router.get('/', async (request, response) => {
  const catalog = await loadPostCollection();
  console.log(catalog)
  response.send(await catalog.find({}).toArray());
})
// Add catalog
router.post('/', async (request, response) => {
  try {
    const catalog = await loadPostCollection();
    await catalog.insertOne({
      name: request.body.name,
      description: request.body.description,
      price: request.body.price,
      count: request.body.count,
      image: request.body.image,
      createdAt: new Date()
    });
    response.status(201).send({ sucess: true });
  } catch (e) {
    response.status(500).send({ message: 'Что-то пошло не так, попробуйте снова' });
  }

})
// Delete catalog
router.delete('/:id', async (request, response) => {
  const catalog = await loadPostCollection();
  await catalog.deleteOne({ _id: new mongodb.ObjectId(request.params.id) });
  response.status(200).send({ sucess: true });
})
// Patch catalog


async function loadPostCollection() {
  const client = await mongodb.MongoClient.connect('mongodb+srv://alexandr0095:08SA108ser@cluster0.exetvsg.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true
  }).catch((e) => console.log(e))
  return client.db('fullStack-Nuxt3').collection('catalog');
}
module.exports = router;