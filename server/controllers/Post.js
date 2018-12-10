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
    if (!req.body.post && !req.body.image) {
        return res.status(400).json({ error: 'Posts must have content'});
    }
    
	const today = new Date();
	today.setHours(today.getHours() - 5);
	
	let postData = {};
	
    if (req.body.image) {
		postData = {
    	    post: req.body.post.toString("utf8"),
			image: req.body.image,
    	    poster: req.session.account.username,
    	    postDate: today.toLocaleString('en-US'),
    	};
	}
	else {
		postData = {
    	    post: req.body.post.toString("utf8"),
			image: "",
    	    poster: req.session.account.username,
    	    postDate: today.toLocaleString('en-US'),
    	};
	}
    
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
	
	return Post.PostModel.find({}).sort({_id: -1}).exec((err, docs) => {
		if (err) {
			console.log(err);
			return res.status(400).json({ error: 'Could Not Get Posts'});
		}
		
		return res.json({ posts: docs });
	});
};

const searchPosts = (request, response) => {
	const req = request;
	const res = response;
	
	if (!req.body.search) {
		return res.status(400).json({ error: 'Search Cannot Be Empty'});
	}
	
	const search = req.body.search;
	
	return Post.PostModel.find({ 
		post: {
			"$regex":search,
			"$options":"i"
		}
	}, null, { limit: parseInt(req.body.limit) }).sort({_id:-1}).exec((err,docs) => {
		if (err) {
			console.log(err);
			return res.status(400).json({ error: 'Could Not Return Search Results'});
		}
		return res.json({ posts: docs });
	});
};

module.exports.makerPage = makerPage;
module.exports.getPosts = getPosts;
module.exports.make = makePost;
module.exports.search = searchPosts;