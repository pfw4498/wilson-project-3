"use strict";

var handlePost = function handlePost(e) {
	e.preventDefault();

	$("#domoMessage").animate({ width: 'hide' }, 350);

	if ($("#postContent").val() == '') {
		handleError("RAWR! All fields are recquired");
		return false;
	}

	sendAjax('POST', $("#postForm").attr("action"), $("#postForm").serialize(), function () {
		loadPostsFromServer();
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
			className: "domoForm"
		},
		React.createElement(
			"label",
			{ htmlFor: "post" },
			"Post Content: "
		),
		React.createElement("input", { id: "postContent", type: "text", name: "post", placeholder: "Type post here..." }),
		React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
		React.createElement("input", { className: "makeDomoSubmit", type: "submit", value: "Post to Feed" })
	);
};

var PostList = function PostList(props) {
	if (props.posts.length === 0) {
		return React.createElement(
			"div",
			{ className: "domoList" },
			React.createElement(
				"h3",
				{ className: "emptyDomo" },
				"No Posts Yet"
			)
		);
	}

	var postNodes = props.posts.map(function (post) {
		return React.createElement(
			"div",
			{ key: post._id, className: "domo" },
			React.createElement("img", { src: "/assets/img/domoface.jpeg", alt: "domo face", className: "domoFace" }),
			React.createElement(
				"h3",
				{ className: "domoName" },
				" Posted By: ",
				post.poster,
				" "
			),
			React.createElement(
				"h3",
				{ className: "domoAge" },
				" ",
				React.createElement(
					"b",
					null,
					"Content: "
				),
				post.post
			),
			React.createElement(
				"h5",
				null,
				" Posted At: ",
				post.postDate
			)
		);
	});

	return React.createElement(
		"div",
		{ className: "domoList" },
		postNodes
	);
};

var loadPostsFromServer = function loadPostsFromServer() {
	sendAjax('GET', '/getPosts', null, function (data) {
		ReactDOM.render(React.createElement(PostList, { posts: data.posts }), document.querySelector("#posts"));
	});
};

var setup = function setup(csrf) {
	ReactDOM.render(React.createElement(PostForm, { csrf: csrf }), document.querySelector("#makePost"));

	ReactDOM.render(React.createElement(PostList, { posts: [] }), document.querySelector("#posts"));

	loadPostsFromServer();
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
