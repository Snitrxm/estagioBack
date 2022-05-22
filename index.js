const express = require('express');
require("dotenv").config();
const app = express();
const User = require('./models/user');
const port = 3002;
let cors = require('cors')
require('./config/database');
const secret = process.env.JWT_TOKEN;
const jwt = require('jsonwebtoken');
const Product = require('./models/product');

app.use(express.json());
app.use(cors());

app.post('/user/all', async (req, res) => {
  const users = await User.find({});
  res.json(users)
})

app.post('/user/register', async (req, res) => {
  const { name, email, password } = req.body;
  
  try{
    const user = await new User({ name, email, password });
    await user.save();
    res.json(user);
  }catch(error){
    res.status(400).json({ error });
  }
})

app.post('/user/login', async (req, res) => {
  const { email, password } = req.body;
  
  try{
    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({err: 'User not found'});
    }else{
        user.isCorrectPassword(password, function(err, same){
            if(!same){
                return res.status(400).json({err: 'Incorrect password'});
            } else{
                const token = jwt.sign({email: email}, secret, {expiresIn: '1d'});
                res.json({user: user, token: token});
            }
        })
    }
} catch(error){
    res.status(400).json(error);
}
})

app.delete('/user/delete/:id', async (req, res) => {
  const { id } = req.params;
  try{
    await User.findByIdAndRemove(id);
    res.json({message: 'User deleted'});
  } catch(error){
    res.status(400).json(error);
  }
})


/* Create Product */

app.post('/product/all', async (req, res) => {
  const products = await Product.find({});
  return res.json(products)
})

app.post('/product/create', async (req, res) => {
  const { name, qtd, price } = req.body;

  try{
    const product = await new Product({name: name, qtd: qtd, price: price});
    await product.save();
    res.json(product);
  } catch(erro){
    res.status(400).json(error);
  }
})

app.put('/product/sell/:id', async (req, res) => {
  const { id } = req.params;
  const { qtd } = req.body;

  const product = await Product.findById(id);

  try{
    if(product.qtd > 0){
      product.qtd = product.qtd - qtd;
      await product.save();
      if(product.qtd <= 0){
        await Product.findByIdAndRemove(id);
      }
      return res.json(product);
    }
  } catch(error){
    console.log(error)
  }
})

app.delete('/product/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Product.findByIdAndRemove(id);
    res.json({message: 'Product deleted'});
  } catch(error){
    console.log(error);
  }
})

app.put('/product/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { name, qtd, price } = req.body;

  try{
    const product = await Product.findById(id);
    if(name != ''){
      product.name = name;
      await product.save();
    }
    if(qtd != ''){
      product.qtd = qtd;
      await product.save();
    }
    if(price != ''){
      product.price = price;
      await product.save();
    }
    res.json(product);
  } catch(error){
    console.log(error);
  }
})

app.get('/product/search/:query', async (req, res) => {
  const { query } = req.params;

  try {
    const products = await Product.findOne({name: query});
    res.json(products);
  }catch(error){
    console.log(error);
  }
})




app.listen(port, () => console.log(`Listening on port ${port}`));