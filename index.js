import express from 'express';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import postRoutes from './routes/posts.js';  // Notice the .js extension
import path from "path";
import {fileURLToPath} from "url";

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure view engine
app.set('view engine', 'ejs');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));


// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Use routes
app.use('/posts', postRoutes);

// Main route redirects to posts index
app.get('/', (req, res) => {
    res.redirect('/posts');
});

console.log(__dirname, "public");


app.listen(port, () => {
    console.log(`Blog website running at http://localhost:${port}`);
});
