const handlePost = (e) => {
	e.preventDefault();
	
	$("#domoMessage").animate({width:'hide'},350);
	
	if ($("#postContent").val() == '') {
		handleError("RAWR! All fields are recquired");
		return false;
	}
	
	sendAjax('POST', $("#postForm").attr("action"), $("#postForm").serialize(), function() {
		loadPostsFromServer();
	});
	
	return false;
};

const PostForm = (props) => {
	return (
		<form id="postForm"
			onSubmit={handlePost}
			name="postForm"
			action="/maker"
			method="POST"
			className="domoForm"
		>
			<label htmlFor="post">Post Content: </label>
			<input id="postContent" type="text" name="post" placeholder="Type post here..." />
			<input type="hidden" name="_csrf" value={props.csrf} />
			<input className="makeDomoSubmit" type="submit" value="Post to Feed" />
		</form>
	);
};

const PostList = function(props) {
	if (props.posts.length === 0) {
		return (
			<div className="domoList">
				<h3 className="emptyDomo">No Posts Yet</h3>
			</div>
		);
	}
	
	const postNodes = props.posts.map(function(post) {
		return (
			<div key={post._id} className="domo">
				<img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
				<h3 className="domoName"> Posted By: {post.poster} </h3>
				<h3 className="domoAge"> <b>Content: </b>{post.post}</h3>
				<h5> Posted At: {post.postDate}</h5>
			</div>
		);
	});
	
	return (
		<div className="domoList">
			{postNodes}
		</div>
	);
};

const loadPostsFromServer = () => {
	sendAjax('GET', '/getPosts', null, (data) => {
		ReactDOM.render(
			<PostList posts={data.posts} />, 
			document.querySelector("#posts")
		);
	});
};

const setup = function(csrf) {
	ReactDOM.render(
		<PostForm csrf={csrf} />, 
		document.querySelector("#makePost")
	);
	
	ReactDOM.render(
		<PostList posts={[]} />, 
		document.querySelector("#posts")
	);
	
	loadPostsFromServer();
};

const getToken = () => {
	sendAjax('GET', '/getToken', null, (result) => {
		setup(result.csrfToken);
	});
};

$(document).ready(function() {
	getToken();
});