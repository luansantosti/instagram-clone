const Post = require('../models/Post')
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')


module.exports = {

  // GET LIST OF ITEMS
  async index(req, res) {
    const posts = await Post.find().sort('-createdAt')

    return res.json(posts)
  }, 

  // CREATE POST
  async store(req, res) {
    const { author, place, description, hashtags } = req.body;
    const { filename: image } = req.file;

    // TRANSFORM PNG TO JPG
    const [ name ] = image.split('.')
    const fileName = `${name}.jpg`

    // IMAGE RESIZE
    await sharp(req.file.path)
      .resize(500)
      .jpeg({ quality: 70 })
      .toFile(
        path.resolve(req.file.destination, 'resized', fileName)
      )

    // DELETE ORIGINAL IMAGE
    fs.unlinkSync(req.file.path)

    // SEND TO DATABASE
    const post = await Post.create({
      author, 
      place,
      description,
      hashtags,
      image: fileName,
    })

    req.io.emit('post', post)

    return res.json(post)
  }

}