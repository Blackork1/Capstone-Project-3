import { Router } from 'express';
import fs from 'fs/promises';
const router = Router();

// File path for JSON data
const postsFilePath = './posts.json';

// Utility function to read posts from the JSON file
async function readPosts() {
    try {
        const data = await fs.readFile(postsFilePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading posts:', err);
        return [];
    }
}

// Utility function to write posts to the JSON file
async function writePosts(posts) {
    try {        
        await fs.writeFile(postsFilePath, JSON.stringify(posts, null, 2));
    } catch (err) {
        console.error('Error writing posts:', err);
    }
}

// Index - Show all posts
router.get('/', async (req, res) => {
    const posts = await readPosts();    
    res.render('index', { posts });
});

// New - Show form to create a new post
router.get('/new', (req, res) => {
    res.render('form', { post: {}, isNew: true });
});

// Create - Add a new post to the list
router.post('/', async (req, res) => {
    const { headline, content } = req.body;

    // Get current date/time in 'Europe/Berlin' time zone and format it
    const createdAt = new Intl.DateTimeFormat('de-DE', {
        timeZone: 'Europe/Berlin',     // German time zone
        dateStyle: 'medium',             // Full date (e.g., "Donnerstag, 3. Oktober 2024")
        timeStyle: 'medium'             // Short time (e.g., "14:30")
        }).format(new Date());

    const newPost = {
        id: Date.now(),  // Unique ID based on timestamp
        headline,
        content,
        createdAt,
    };

    // Read existing posts, add new post, and write back to file
    const posts = await readPosts();
    posts.unshift(newPost);
    await writePosts(posts);

    res.redirect('/posts');
});


// Edit - Show form to edit an existing post
router.get('/:id/edit', async (req, res) => {
    const posts = await readPosts();
    const post = posts.find(p => p.id == req.params.id);
    res.render('form', { post, isNew: false });
});

// Update - Modify an existing post
router.put('/:id', async (req, res) => {
    const { headline, content } = req.body;

    //update time as well to text
    const createdAt = new Intl.DateTimeFormat('de-DE', {
        timeZone: 'Europe/Berlin',     // German time zone
        dateStyle: 'medium',             // Full date (e.g., "Donnerstag, 3. Oktober 2024")
        timeStyle: 'medium'             // Short time (e.g., "14:30")
    }).format(new Date());

    //delete the old post
    //first we read all Posts and then we delte the selected post
    let posts = await readPosts();
    posts = posts.filter(p => p.id != req.params.id);

    //we created new object, taking the input from the body
    const newPost = {
        id: Date.now(),
        headline, 
        content,
        createdAt,
    };

    //delete post
    await writePosts(posts);
    //add new Post to first position and write it
    posts.unshift(newPost);
    await writePosts(posts);

    res.redirect('/posts');
});

// Delete - Remove a post
router.delete('/:id', async (req, res) => {
    let posts = await readPosts();
    posts = posts.filter(p => p.id != req.params.id);

    await writePosts(posts);
    res.redirect('/posts');
});

export default router;
