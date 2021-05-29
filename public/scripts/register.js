function handleRegister() {
	if($('#user').val().length == 0) {
		$('#error').text('Enter a username');
	}
	else if($('#pass').val().length == 0) {
		$('#error').text('Enter a password');
	}
	else if($('#pass').val().length < 5) {
		$('#error').text('Password too weak');
	}
	else{
		$.post('/registerAccount', {username: $('#user').val(), password: $('#pass').val() }, function(data, status){
			if(data=='taken'){
				$('#error').text('This Username is taken');
			}
			else{
				document.documentElement.innerHTML = data;
			}
		});
	}
	return;
}