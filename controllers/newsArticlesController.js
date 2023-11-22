import NewsArticle from "../models/NewsArticle.js";

export const getAllNewsArticles = async (req, res) => {
  try {
    const articles = await NewsArticle.find().populate('writer', 'firstName lastName');
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNewsArticleById = async (req, res) => {
  try {
      const article = await NewsArticle.findById(req.params.id)
          .populate('writer', 'firstName lastName username');
      if (!article) {
          return res.status(404).send('Article not found');
      }
      res.json(article);
  } catch (error) {
      res.status(500).send(error.message);
  }
};

export const createNewsArticle = async (req, res) => {
  try {
    const newArticle = new NewsArticle({
      writer: req.body.writerId, 
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
      imageUrl: req.body.imageUrl
    });

    const savedArticle = await newArticle.save();
    res.status(201).json(savedArticle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
  
  export const updateNewsArticle = async (req, res) => {
    try {
      const article = await NewsArticle.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!article) {
        return res.status(404).send('Article not found');
      }
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  export const deleteNewsArticle = async (req, res) => {
    try {
      const article = await NewsArticle.findByIdAndDelete(req.params.id);
      if (!article) {
        return res.status(404).send('Article not found');
      }
      res.status(200).send(`Article ${req.params.id} deleted`);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };