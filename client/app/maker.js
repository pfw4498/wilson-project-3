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

const handleSearch = (e) => {
	e.preventDefault();
	
	$("#domoMessage").animate({width:'hide'},350);
	
	if ($("#searchContent").val() == '') {
		handleError("Search Cannot Be Empty");
		return false;
	}
	
	sendAjax('POST', $("#searchForm").attr("action"), $("#searchForm").serialize(), function(data) {
		//console.log(data.posts);
		ReactDOM.render(
			<PostList posts={data.posts} />, 
			document.querySelector("#posts")
		);
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
			<input className="makePostSubmit" type="submit" value="Post to Feed" onClick={closeModal}/>
			<label id="charLengthLabel">Max Chars: 280</label>
		</form>
	);
};

const SearchForm = (props) => {
	return (
		<form id="searchForm"
			onSubmit={handleSearch}
			name="searchForm"
			action="/search"
			method="POST"
			className="postForm"
		>
			<label htmlFor="search">Search for Content: </label>
			<textarea id="searchContent" name="search" rows="6" cols="50" maxLength="280" placeholder="Type search here..."></textarea>
			<input type="hidden" name="_csrf" value={props.csrf} />
			<input className="makePostSubmit" type="submit" value="Search Posts" onClick={closeModal2}/>
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

const loadSearchFromServer = () => {
	sendAjax('POST', '/search', null, (data) => {
		ReactDOM.render(
			<PostList posts={data.posts} />, 
			document.querySelector("#posts")
		);
	});
};

const setup = function(csrf) {
	//Modal code from: https://www.w3schools.com/howto/howto_css_modals.asp
	const modal = document.querySelector("#myModal");
	const btn = document.querySelector("#myBtn");
	const span = document.getElementsByClassName("close")[0];
	
	const modal2 = document.querySelector("#myModal2");
	const btn2 = document.querySelector("#myBtn2");
	const span2 = document.getElementsByClassName("close")[1];
	
	const btn3 = document.querySelector("#myBtn3");
	
	btn.addEventListener("click", (e) => {
		modal.style.display = "block";
	});
	
	span.addEventListener("click", (e) => {
		modal.style.display = "none";
	});
	
	window.onclick = function(event) {
    	if (event.target == modal) {
			modal.style.display = "none";
    	}
		else if (event.target == modal2) {
			modal2.style.display = "none";
    	}
	}
	
	btn2.addEventListener("click", (e) => {
		modal2.style.display = "block";
	});
	
	span2.addEventListener("click", (e) => {
		modal2.style.display = "none";
	});
	
	btn3.addEventListener("click", (e) => {
		loadPostsFromServer();
	});
	
	ReactDOM.render(
		<PostForm csrf={csrf} />, 
		document.querySelector("#postModalContent")
	);
	
	ReactDOM.render(
		<SearchForm csrf={csrf} />, 
		document.querySelector("#searchModalContent")
	);
	
	ReactDOM.render(
		<PostList posts={[]} />, 
		document.querySelector("#posts")
	);
	
	loadPostsFromServer();
};

const closeModal = () => {
	const modal = document.querySelector("#myModal");
	modal.style.display = "none";
};

const closeModal2 = () => {
	const modal = document.querySelector("#myModal2");
	modal.style.display = "none";
};

const getToken = () => {
	sendAjax('GET', '/getToken', null, (result) => {
		setup(result.csrfToken);
	});
};

$(document).ready(function() {
	getToken();
});