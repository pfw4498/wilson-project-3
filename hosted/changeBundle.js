"use strict";

var handleChangePass = function handleChangePass(e) {
	e.preventDefault();

	$("#domoMessage").animate({ width: 'hide' }, 350);

	if ($("#oldPass").val() === '' || $("#newPass").val() === '' || $('#newPass2').val() === '') {
		handleError("All fields are required");
		return false;
	}

	if ($("#newPass").val() !== $("#newPass2").val()) {
		handleError("Passwords do not match");
		return false;
	}

	if ($("#oldPass").val() === $("#newPass").val() || $("#oldPass").val() === $('#newPass2').val()) {
		handleError("Password hasn't changed!");
		return false;
	}

	sendAjax('POST', $("#changeForm").attr("action"), $("#changeForm").serialize(), redirect);

	return false;
};

var ChangePassWindow = function ChangePassWindow(props) {
	return React.createElement(
		"form",
		{ id: "changeForm",
			name: "changeForm",
			onSubmit: handleChangePass,
			action: "/changePass",
			method: "POST",
			className: "mainForm"
		},
		React.createElement(
			"label",
			{ htmlFor: "oldPass" },
			"Old Password: "
		),
		React.createElement("input", { id: "oldPass", type: "password", name: "oldPass", placeholder: "Old Password" }),
		React.createElement("br", null),
		React.createElement(
			"label",
			{ htmlFor: "newPass" },
			"New Password: "
		),
		React.createElement("input", { id: "newPass", type: "password", name: "newPass", placeholder: "New Password" }),
		React.createElement("br", null),
		React.createElement(
			"label",
			{ htmlFor: "newPass2" },
			"Retype New Password: "
		),
		React.createElement("input", { id: "newPass2", type: "password", name: "newPass2", placeholder: "Retype New Password" }),
		React.createElement("br", null),
		React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
		React.createElement("input", { id: "changePassSubmit", type: "submit", value: "Change Password" })
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
			{ className: "navlinkCurrent" },
			React.createElement(
				"a",
				{ id: "changePassButton", href: "/changePassPage" },
				"Change Password"
			)
		),
		React.createElement(
			"div",
			{ className: "navlink" },
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

var setup = function setup(csrf) {
	ReactDOM.render(React.createElement(ChangePassWindow, { csrf: csrf }), document.querySelector("#content"));

	ReactDOM.render(React.createElement(Navigation, null), document.querySelector("#navigation"));

	ReactDOM.render(React.createElement(TitleSpace, null), document.querySelector("#titleSpace"));
};

var getToken = function getToken() {
	sendAjax('GET', '/getToken', null, function (result) {
		setup(result.csrfToken);
	});
};

$(document).ready(function () {
	getToken();
});

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
