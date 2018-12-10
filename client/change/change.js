const handleChangePass = (e) => {
	e.preventDefault();
	
	$("#domoMessage").animate({width:'hide'},350);
	
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

const ChangePassWindow = (props) => {
	return (
	<form id="changeForm"
		name="changeForm"
		onSubmit={handleChangePass}
		action="/changePass"
		method="POST"
		className="mainForm"
		>
		<label htmlFor="oldPass">Old Password: </label>
		<input id="oldPass" type="password" name="oldPass" placeholder="Old Password" /><br />
		<label htmlFor="newPass">New Password: </label>
		<input id="newPass" type="password" name="newPass" placeholder="New Password" /><br />
		<label htmlFor="newPass2">Retype New Password: </label>
		<input id="newPass2" type="password" name="newPass2" placeholder="Retype New Password" /><br />
		<input type="hidden" name="_csrf" value={props.csrf} />
		<input id="changePassSubmit" type="submit" value="Change Password" />
	</form>
	);
};

const Navigation = () => {
	return (
		<div>
			<a href="/login"><img id="logo" src="/assets/img/face.png" alt="face logo"/></a>
    		<div className="navlink"><a href="/logout">Log out</a></div>
			<div className="navlinkCurrent"><a id="changePassButton" href="/changePassPage">Change Password</a>
			</div>
			<div className="navlink"><a id="postFeedButton" href="/maker">Post Feed</a></div>
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

const setup = function(csrf) {
	ReactDOM.render(
		<ChangePassWindow csrf={csrf} />,
		document.querySelector("#content")
	);
	
	ReactDOM.render(
		<Navigation />,
		document.querySelector("#navigation")
	);
	
	ReactDOM.render(
		<TitleSpace />,
		document.querySelector("#titleSpace")
	);
};

const getToken = () => {
	sendAjax('GET', '/getToken', null, (result) => {
		setup(result.csrfToken);
	});
};

$(document).ready(function() {
	getToken();
});

const handleError = (message) => {
	$("#errorMessage").text(message);
	$("#domoMessage").animate({width:'toggle'},350);
};

const redirect = (response) => {
	$("#domoMessage").animate({width:'hide'},350);
	window.location = response.redirect;
};

const sendAjax = (type, action, data, success) => {
	$.ajax({
		cache: false,
		type: type,
		url: action,
		data: data,
		dataType: "json",
		success: success,
		error: function(xhr, status, error) {
			var messageObj = JSON.parse(xhr.responseText);
			handleError(messageObj.error);
		}
	});
};