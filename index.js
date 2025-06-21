import bodyParser from 'body-parser';
import express from 'express';
const app = express();

// array for temporary storing the form data
let id = 1;
let blogs = [];

// static files
app.use(express.static("assets"));

// body parse middleware
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render("index.ejs");
});

app.get('/blog', (req, res) => {
  res.render("blog.ejs", { blogs });
});

app.post('/blog', (req, res) => {
  const blog_title = req.body["title"];
  const blog_date = req.body["date"];
  const blog_description = req.body["description"];
  const blog_author = req.body["author"];

  const object = {
    id: id++,
    title: blog_title,
    date: blog_date,
    description: blog_description,
    author: blog_author
  };

  blogs.push(object);
  res.render("blog.ejs", { blogs });
});

// get edit route
app.get("/edit/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const blogToEdit = blogs.find(b => b.id === id);
  if (blogToEdit) {
    res.render("edit.ejs", { blog: blogToEdit });
  } else {
    res.status(404).send("Blog not found");
  }
});

// edit post route
app.post("/update/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const blogIndex = blogs.findIndex(b => b.id === id);
  if (blogIndex !== -1) {
    blogs[blogIndex].title = req.body["title"];
    blogs[blogIndex].date = req.body["date"];
    blogs[blogIndex].description = req.body["description"];
    blogs[blogIndex].author = req.body["author"];
    
    res.redirect("/blog");
  } else {
    res.status(404).send("Blog not found for update");
  }
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
