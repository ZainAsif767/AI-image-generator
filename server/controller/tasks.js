const { Configuration, OpenAIApi } = require("openai");
const cloudinary = require('cloudinary').v2;
const Image = require('../Models/Image')

require('dotenv').config()

// Cloudinary Configuration 
// cloudinary.config({
//   cloud_name: "dxl2vlar6",
//   api_key: process.env.CLOUD_API_KEY,
//   api_secret: process.env.CLOUD_API_SECRET
// });

const createImage = async (req, res) =>{
  // OPENAI Configuration
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const response = await openai.createImage({
      prompt: req.body.prompt,
      n:1,
      size: "512x512",
    });

    res.status(200).json({photo: response.data.data[0].url})
    
    // const res = cloudinary.uploader.upload(response.data.data[0].b64_json, {public_id: req.body.prompt})
    // res.then(()=>console.log('success')).catch((err) => console.log(err))
}

const shareImage = async (req, res) => {
  try {
    if (req.body.name && req.body.prompt && req.body.photo){
      const task = await Image.create(req.body)
      return res.status(200).json(task)
    }
    return res.status(500).json({error: "Information In complete"})
  } catch (error) {
    res.status(400).json(error.errors.task.message)
  }
}

const getImage = async (req, res) => {
  try {
    const posts = await Image.find()
    res.status(200).json({posts:posts})
  } catch (error) {
    res.status(500).json({err: error})
  }
}

module.exports = {createImage, shareImage, getImage}