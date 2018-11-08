const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let PostModel = {};

const convertId = mongoose.Types.ObjectId;
const setPost = (post) => _.escape(post).trim();

const PostSchema = new mongoose.Schema({
    post: {
        type: String,
        required: true,
        trim: true,
        set: setPost,
    },
    
    poster: {
        type: String,
        required: true,
        ref: 'Account',
    },
    
	postDate: {
		type: String,
		trim: true,
	},
	
    createdDate: {
        type: Date,
        default: Date.now,
    },
});

PostSchema.statics.toAPI = (doc) => ({
    post: doc.post,
    poster: doc.poster,
});

PostSchema.statics.findByPoster = (posterId, callback) => {
    const search = {
        poster: convertId(posterId),
    };
    
    return PostModel.find(search).select('post poster createdDate').exec(callback);
};

PostModel = mongoose.model('Post', PostSchema);

module.exports.PostModel = PostModel;
module.exports.PostSchema = PostSchema;