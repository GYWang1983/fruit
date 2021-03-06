
function send_sms(type) {
	var mobile = $('#mobile_phone').val();
	if (!check_mobile(mobile)) {
		$('#alert').show().text('请输入正确的手机号');
		return;
	}

	var captcha = '';
	if ($("#captcha").length > 0) {
		captcha = $("#captcha").val();
		if (captcha.length == 0) {
			$('#alert').show().text('请输入图片中的验证码');
			return;
		}
	}
	
	var param = {'step': type, 'mobile': mobile, 'captcha': captcha};
    $.post('sms.php?r=' + Math.random(), param, function(result) {
    	switch(result.error)
    	{
    	case 0:
    	case 4:
    		var timeout = result.smsgap;
    		$('#alert').hide();
    		$('#message').show().text('验证码已发送至' + mobile);
    		$('#sendsms').attr('disabled', true).val('重新发送(' + timeout +')');
    		var clock = setInterval(function() {
    			timeout--;
    			if (timeout > 0) {
    				$('#sendsms').val('重新发送(' + timeout +')');
    			} else {
    				$('#sendsms').removeAttr('disabled').val('重新发送');
    				clearInterval(clock);
    			}
    		}, 1000);
    		break;
    	case 2:
    	case 3:
    	case 7:
    		$('#alert').show().text(result.message);
    		break;
    	case 5:
    	case 6:
    		$('#alert').show().text('短信发送失败，请稍后再试');
    		break;
    	}
    }, 'json');
}

