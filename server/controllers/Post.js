const models = require('../models');

const Post = models.Post;

const makerPage = (req, res) => {
    Post.PostModel.findByPoster(req.session.account._id, (err, docs) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ error: 'An error occurred' });
        }
        
        return res.render('app', { csrfToken: req.csrfToken(), posts: docs });
    });
};

const makePost = (req, res) => {
    if (!req.body.post) {
        return res.status(400).json({ error: 'Posts must have content'});
    }
    
	const today = new Date();
	
    const postData = {
        post: req.body.post,
        poster: req.session.account.username,
        postDate: today.toLocaleString('en-US'),
    };
    
    const newPost = new Post.PostModel(postData);
    
    const postPromise = newPost.save();
    
    postPromise.then(() => res.json({ redirect: '/maker' }));
    
    postPromise.catch((err) => {
        console.log(err);
        //if (err.code === 11000) {
        //    return res.status(400).json({ error: 'Domo already exists.'});
        //}
        
        return res.status(400).json({ error: 'An error occurred' });
    });
    
    return postPromise;
};

const getPosts = (request, response) => {
	//const req = request;
	const res = response;
	
	//return Post.PostModel.findByPoster(req.session.account._id, (err, docs) => {
	//	if (err) {
	//		console.log(err);
	//		return res.status(400).json({ error: 'An error occurred' });
	//	}
	//	
	//	return res.json({ posts: docs });
	//});
	
	return Post.PostModel.find({}, (err, docs) => {
		if (err) {
			console.log(err);
			return res.status(400).json({ error: 'An Error Occurred'});
		}
		
		return res.json({ posts: docs });
	});
};

module.exports.makerPage = makerPage;
module.exports.getPosts = getPosts;
module.exports.make = makePost;