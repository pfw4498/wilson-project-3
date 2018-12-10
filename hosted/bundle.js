"use strict";

var handlePost = function handlePost(e) {
	e.preventDefault();

	$("#domoMessage").animate({ width: 'hide' }, 350);

	if ($("#postContent").val() == '' && $("#imagePost").val() == '') {
		handleError("A post can't be empty");
		return false;
	}

	sendAjax('POST', $("#postForm").attr("action"), $("#postForm").serialize(), function () {
		loadPostsFromServer();
	});

	return false;
};

var handleSearch = function handleSearch(e) {
	e.preventDefault();

	$("#domoMessage").animate({ width: 'hide' }, 350);

	if ($("#searchContent").val() == '') {
		handleError("Search Cannot Be Empty");
		return false;
	}

	sendAjax('POST', $("#searchForm").attr("action"), $("#searchForm").serialize(), function (data) {
		//console.log(data.posts);
		ReactDOM.render(React.createElement(PostList, { posts: data.posts }), document.querySelector("#posts"));
	});

	return false;
};

var PostForm = function PostForm(props) {
	return React.createElement(
		"form",
		{ id: "postForm",
			onSubmit: handlePost,
			name: "postForm",
			action: "/maker",
			method: "POST",
			className: "postForm"
		},
		React.createElement(
			"label",
			{ htmlFor: "post" },
			"Post Content: "
		),
		React.createElement("textarea", { id: "postContent", name: "post", rows: "6", cols: "50", maxLength: "280", placeholder: "Type post here..." }),
		React.createElement(
			"label",
			{ id: "imagePostLabel", htmlFor: "image" },
			"Image URL (Optional): "
		),
		React.createElement("input", { id: "imagePost", type: "text", name: "image", placeholder: "Image URL..." }),
		React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
		React.createElement("input", { id: "makePostSubmit", className: "makePostSubmit", type: "submit", value: "Post to Feed", onClick: closeModal }),
		React.createElement(
			"label",
			{ id: "charLengthLabel" },
			"Max Chars: 280"
		)
	);
};

var SearchForm = function SearchForm(props) {
	return React.createElement(
		"form",
		{ id: "searchForm",
			onSubmit: handleSearch,
			name: "searchForm",
			action: "/search",
			method: "POST",
			className: "postForm"
		},
		React.createElement(
			"label",
			{ htmlFor: "search" },
			"Search for Content: "
		),
		React.createElement("textarea", { id: "searchContent", name: "search", rows: "6", cols: "50", maxLength: "280", placeholder: "Type search here..." }),
		React.createElement(
			"label",
			{ htmlFor: "limit" },
			"Result Count: "
		),
		React.createElement(
			"select",
			{ id: "perPageSelect", name: "limit", form: "searchForm" },
			React.createElement(
				"option",
				{ value: "5" },
				"5"
			),
			React.createElement(
				"option",
				{ value: "10" },
				"10"
			),
			React.createElement(
				"option",
				{ value: "20" },
				"20"
			),
			React.createElement(
				"option",
				{ value: "50" },
				"50"
			)
		),
		React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
		React.createElement("input", { className: "makePostSubmit", type: "submit", value: "Search Posts", onClick: closeModal2 }),
		React.createElement(
			"label",
			{ id: "charLengthLabelSearch" },
			"Max Chars: 280"
		)
	);
};

var PostList = function PostList(props) {
	if (props.posts.length === 0) {
		return React.createElement(
			"div",
			{ className: "postList" },
			React.createElement(
				"h3",
				{ className: "emptyPost" },
				"No Posts Yet"
			)
		);
	}

	var postNodes = props.posts.map(function (post) {
		//Replace those strange special characters with their actual characters
		var fixedPost = post.post.replace(/&#x27;/g, "'").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");

		if (post.image) {
			return React.createElement(
				"div",
				{ key: post._id, className: "post" },
				React.createElement(
					"div",
					{ id: "postTitle" },
					React.createElement("img", { src: "/assets/img/thoughtBubble.png", alt: "post icon", className: "domoFace" }),
					React.createElement(
						"h3",
						{ className: "postName" },
						" Posted By: ",
						post.poster,
						" "
					)
				),
				React.createElement("br", null),
				React.createElement(
					"div",
					{ id: "postedContent" },
					React.createElement("img", { className: "postImage", src: post.image, alt: "Can't Find Image" }),
					React.createElement(
						"h3",
						{ className: "postContent" },
						fixedPost
					)
				),
				React.createElement("br", null),
				React.createElement(
					"h5",
					null,
					" Posted At: ",
					post.postDate
				)
			);
		} else {
			return React.createElement(
				"div",
				{ key: post._id, className: "post" },
				React.createElement(
					"div",
					{ id: "postTitle" },
					React.createElement("img", { src: "/assets/img/thoughtBubble.png", alt: "post icon", className: "domoFace" }),
					React.createElement(
						"h3",
						{ className: "postName" },
						" Posted By: ",
						post.poster,
						" "
					)
				),
				React.createElement("br", null),
				React.createElement(
					"div",
					{ id: "postedContent" },
					React.createElement(
						"h3",
						{ className: "postContent" },
						fixedPost
					)
				),
				React.createElement("br", null),
				React.createElement(
					"h5",
					null,
					" Posted At: ",
					post.postDate
				)
			);
		}
	});

	return React.createElement(
		"div",
		{ className: "postList" },
		postNodes
	);
};

var Navigation = function Navigation() {
	return React.createElement(
		"div",
		null,
		React.createElement(
			"a",
			{ href: "/login" },
			React.createElement("img", { id: "logo", src: "/assets/img/face.png", alt: "face logo" })
		),
		React.createElement(
			"div",
			{ className: "navlink" },
			React.createElement(
				"a",
				{ href: "/logout" },
				"Log out"
			)
		),
		React.createElement(
			"div",
			{ className: "navlink" },
			React.createElement(
				"a",
				{ id: "changePassButton", href: "/changePassPage" },
				"Change Password"
			)
		),
		React.createElement(
			"div",
			{ className: "navlinkCurrent" },
			React.createElement(
				"a",
				{ id: "postFeedButton", href: "/maker" },
				"Post Feed"
			)
		)
	);
};

var TitleSpace = function TitleSpace() {
	return React.createElement(
		"div",
		{ id: "appTitle" },
		React.createElement(
			"h1",
			null,
			"Thought Poster!"
		),
		React.createElement(
			"h4",
			null,
			React.createElement(
				"i",
				null,
				"\"A place to share what's on your mind\""
			)
		)
	);
};

var loadPostsFromServer = function loadPostsFromServer() {
	sendAjax('GET', '/getPosts', null, function (data) {
		ReactDOM.render(React.createElement(PostList, { posts: data.posts }), document.querySelector("#posts"));
	});
};

var setup = function setup(csrf) {
	//Modal code from: https://www.w3schools.com/howto/howto_css_modals.asp
	var modal = document.querySelector("#myModal");
	var btn = document.querySelector("#myBtn");
	var span = document.getElementsByClassName("close")[0];

	var modal2 = document.querySelector("#myModal2");
	var btn2 = document.querySelector("#myBtn2");
	var span2 = document.getElementsByClassName("close")[1];

	var btn3 = document.querySelector("#myBtn3");

	btn.addEventListener("click", function (e) {
		modal.style.display = "block";
	});

	span.addEventListener("click", function (e) {
		modal.style.display = "none";
	});

	window.onclick = function (event) {
		if (event.target == modal) {
			modal.style.display = "none";
		} else if (event.target == modal2) {
			modal2.style.display = "none";
		}
	};

	btn2.addEventListener("click", function (e) {
		modal2.style.display = "block";
	});

	span2.addEventListener("click", function (e) {
		modal2.style.display = "none";
	});

	btn3.addEventListener("click", function (e) {
		loadPostsFromServer();
	});

	ReactDOM.render(React.createElement(PostForm, { csrf: csrf }), document.querySelector("#postModalContent"));

	ReactDOM.render(React.createElement(SearchForm, { csrf: csrf }), document.querySelector("#searchModalContent"));

	ReactDOM.render(React.createElement(PostList, { posts: [] }), document.querySelector("#posts"));

	ReactDOM.render(React.createElement(Navigation, null), document.querySelector("#navigation"));

	ReactDOM.render(React.createElement(TitleSpace, null), document.querySelector("#titleSpace"));

	loadPostsFromServer();
};

var closeModal = function closeModal() {
	var modal = document.querySelector("#myModal");
	modal.style.display = "none";
};

var closeModal2 = function closeModal2() {
	var modal = document.querySelector("#myModal2");
	modal.style.display = "none";
};

var getToken = function getToken() {
	sendAjax('GET', '/getToken', null, function (result) {
		setup(result.csrfToken);
	});
};

$(document).ready(function () {
	getToken();
});
"use strict";

var handleError = function handleError(message) {
	$("#errorMessage").text(message);
	$("#domoMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
	$("#domoMessage").animate({ width: 'hide' }, 350);
	window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
	$.ajax({
		cache: false,
		type: type,
		url: action,
		data: data,
		dataType: "json",
		success: success,
		error: function error(xhr, status, _error) {
			var messageObj = JSON.parse(xhr.responseText);
			handleError(messageObj.error);
		}
	});
};
