const handlePost = (e) => {
	e.preventDefault();
	
	$("#domoMessage").animate({width:'hide'},350);
	
	if ($("#postContent").val() == '') {
		handleError("A post can't be empty");
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
			className="postForm"
		>
			<label htmlFor="post">Post Content: </label>
			<textarea id="postContent" name="post" rows="6" cols="50" maxLength="280" placeholder="Type post here..."></textarea>
			<input type="hidden" name="_csrf" value={props.csrf} />
			<input className="makePostSubmit" type="submit" value="Post to Feed" />
			<label id="charLengthLabel">Max Chars: 280</label>
		</form>
	);
};

const PostList = function(props) {
	if (props.posts.length === 0) {
		return (
			<div className="postList">
				<h3 className="emptyPost">No Posts Yet</h3>
			</div>
		);
	}
	
	const postNodes = props.posts.map(function(post) {
		return (
			<div key={post._id} className="post">
				<div id="postTitle">
					<img src="/assets/img/thoughtBubble.png" alt="post icon" className="domoFace" />
					<h3 className="postName"> Posted By: {post.poster} </h3>
				</div><br />
				<div id="postedContent">
					<h3 className="postContent">{post.post}</h3>
				</div><br />
				<h5> Posted At: {post.postDate}</h5>
			</div>
		);
	});
	
	return (
		<div className="postList">
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