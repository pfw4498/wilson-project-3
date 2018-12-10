const handlePost = (e) => {
	e.preventDefault();
	
	$("#domoMessage").animate({width:'hide'},350);
	
	if ($("#postContent").val() == '' && $("#imagePost").val() == '') {
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
			<label id="imagePostLabel" htmlFor="image">Image URL (Optional): </label>
			<input id="imagePost" type="text" name="image" placeholder="Image URL..." />
			<input type="hidden" name="_csrf" value={props.csrf} />
			<input id="makePostSubmit" className="makePostSubmit" type="submit" value="Post to Feed" onClick={closeModal}/>
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
			<label htmlFor="limit">Result Count: </label>
			<select id="perPageSelect" name="limit" form="searchForm">
				<option value="5">5</option>
				<option value="10">10</option>
				<option value="20">20</option>
				<option value="50">50</option>
			</select>
			<input type="hidden" name="_csrf" value={props.csrf} />
			<input className="makePostSubmit" type="submit" value="Search Posts" onClick={closeModal2}/>
			<label id="charLengthLabelSearch">Max Chars: 280</label>
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
		//Replace those strange special characters with their actual characters
		const fixedPost = post.post.replace(/&#x27;/g, "'").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");
		
		if (post.image) {
			return (
			<div key={post._id} className="post">
				<div id="postTitle">
					<img src="/assets/img/thoughtBubble.png" alt="post icon" className="domoFace" />
					<h3 className="postName"> Posted By: {post.poster} </h3>
				</div><br />
				<div id="postedContent">
					<img className="postImage" src={post.image} alt="Can't Find Image" />
					<h3 className="postContent">{fixedPost}</h3>
				</div><br />
				<h5> Posted At: {post.postDate}</h5>
			</div>
			);
		}
		else {
			return (
			<div key={post._id} className="post">
				<div id="postTitle">
					<img src="/assets/img/thoughtBubble.png" alt="post icon" className="domoFace" />
					<h3 className="postName"> Posted By: {post.poster} </h3>
				</div><br />
				<div id="postedContent">
					<h3 className="postContent">{fixedPost}</h3>
				</div><br />
				<h5> Posted At: {post.postDate}</h5>
			</div>
			);
		}
		
	});
	
	return (
		<div className="postList">
			{postNodes}
		</div>
	);
};

const Navigation = () => {
	return (
		<div>
			<a href="/login"><img id="logo" src="/assets/img/face.png" alt="face logo"/></a>
    		<div className="navlink"><a href="/logout">Log out</a></div>
			<div className="navlink"><a id="changePassButton" href="/changePassPage">Change Password</a>
			</div>
			<div className="navlinkCurrent"><a id="postFeedButton" href="/maker">Post Feed</a></div>
		</div>
	);
};

const TitleSpace = () => {
	return (
		<div id="appTitle">
			<h1>Thought Poster!</h1>
			<h4><i>"A place to share what's on your mind"</i></h4>
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
	
	ReactDOM.render(
		<Navigation />,
		document.querySelector("#navigation")
	);
	
	ReactDOM.render(
		<TitleSpace />,
		document.querySelector("#titleSpace")
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