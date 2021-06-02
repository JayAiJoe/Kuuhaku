function handleLogin() {


	$.post('/loginAttempt', {username: $('#user').val(), password: $('#pass').val() }, function(data, status){
		if(data=='invalid'){
			$('#error').text('Invalid Credentials');
		}
		else{
			window.location.href = "/landing";
		}
	})

	return;
}