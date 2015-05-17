<?php

require_once APP_LIB_PATH . '/AppResponse.php';

$app->post('/product', function() use ($database){
	
	$httpStatus = null;

	try{

		$data = GetHTTPData();

		if (empty($data->sku)){
			$httpStatus = 400;
			throw new Exception('No product was selected.');
		}

		$data->sku = EscapeHtml($data->sku);

		//get product that match input email
		$product = $database->select("products", [
			"sku",
			"name",
			"description",
			"price",
			"url",
			"category"
		], [
			"sku" => $data->sku
		]);

		//check if there is a product then send success
		if ($product){
			$appResponse = new AppResponse(null);

			$appResponse->data = $product;
			$appResponse->SetStatus(200, 'Product retrieved successfully.');
		    
			echo json_encode($appResponse);
		}else{
			$httpStatus = 401;
			throw new Exception('No product was found matching request.');
		}

	} catch (Exception $e){
		ReportError($e, $httpStatus);
	}
});

$app->post('/newproducts', function() use ($database){

	$httpStatus = null;

	try{

		//get recent products
		$products = $database->select("products", [
			"sku",
			"name",
			"price",
			"url",
		], [
			"ORDER" => "dateAdded DESC",
			"LIMIT" => 4
		]);

		//check if there is a product then send success
		if ($products){
			$appResponse = new AppResponse(null);

			$appResponse->data = $products;
			$appResponse->SetStatus(200, 'Products retrieved successfully.');
		    
			echo json_encode($appResponse);
		}else{
			$httpStatus = 401;
			throw new Exception('No products were found matching request.');
		}

	} catch (Exception $e){
		ReportError($e, $httpStatus);
	}
});

// $app->get('/logout', function (){
// 	@session_start();
	
// 	$httpStatus = null;
	
// 	try{

// 		if (isset($_SESSION['email']) && isset($_SESSION['password'])){

// 			// clear session data
// 			@session_destroy();
// 			$_SESSION = array();
// 			@session_write_close();
// 			@setcookie(session_name(),'',0,'/');
// 			@session_regenerate_id(true);
// 		} else{
// 			$httpStatus = 401;
// 			throw new Exception('No user logged in.');
// 		}

// 		$appResponse = new AppResponse(null);

// 		$appResponse->SetStatus(200, 'Logout successful.');

// 		echo json_encode($appResponse);
// 	} catch (Exception $e){
// 		ReportError($e, $httpStatus);
// 	}
// });

// $app->post('/forgot', function() use ($database){
	
// 	$httpStatus = null;
	
// 	try{

// 		$data = GetHTTPData();

// 		if (empty($data->email)){
// 			$httpStatus = 401;
// 			throw new Exception('The "Email" feild is empty.');
// 		}

// 		$email = EscapeHtml($data->email);

// 		// -- TODO should probly also check ip in some way

// 		// -- get ipaddress, not working properly
// 		// $ip = null;

// 		// if (!empty($_SERVER['HTTP_CLIENT_IP'])){
// 		//     $ip = $_SERVER['HTTP_CLIENT_IP'];
// 		// } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])){
// 		//     $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
// 		// } else {
// 		//     $ip = $_SERVER['REMOTE_ADDR'];
// 		// }

// 		// make new user hash
// 		$hash = rtrim(base64_encode(md5(microtime())),"=");

// 		// get date and time of now
// 		$date = date_create();
// 		$now  = date_format($date, 'Y-m-d H:i:s');

// 		// check if there is a match then break
// 		$match = $database->select("users", [
// 			"email",
// 			"name"
// 		], [
// 			"email" => $data->email
// 		]);

// 		if(!$match){
// 			// should break try
// 			$httpStatus = 401;
// 			throw new Exception('Invalid credentials, please try again.');
// 		}

// 		// getting the last reset data
// 		$resetData = $database->select("passwordReset", [
// 			"lastReset"
// 		], [
// 			"email" => $data->email
// 		]);

// 		// using the $resetData above:
// 		// checking if reset in past day
// 		if($resetData){
			
// 			// get date one day ago from now
// 			$now = date("Y-m-d H:i:s");

// 			// get last reset date if it inbetween now and ond day ago 
// 			$recent = $database->select("passwordReset", [
// 				"lastReset"
// 			], [
// 				"lastReset[<>]" => [date('Y-m-d H:i:s', strtotime($now . "-1 days")), $now]
// 			]);

// 			// check if the above exists
// 			if($recent){
// 				$httpStatus = 401;
// 				throw new Exception('You may only use the forgot password tool once a day.');
// 			}else{
// 			// if has not been a recent reset and a matching record exists then update matching record in passwordReset
// 				$database->update('passwordReset', [
// 					'hash'      => $hash,
// 					//'ipaddress' => $ip,
// 					'lastReset' => $now
// 				], [
// 					'email' => $data->email
// 				]);
// 			}
// 		}else{
// 			// insert new record in passwordReset table with new time, new hash, and ip 
// 			$database->insert('passwordReset', [
// 				'email'     => $data->email,
// 				'hash'      => $hash,
// 				//'ipaddress' => $ip
// 			]);
// 		}

// 		// update matching user's hash to retrieve the correct info when at reset page
// 		// this will be updated if the code reaches this point with no exceptions 
// 		$database->update('users', [
// 			'hash' => $hash
// 		], [
// 			'email' => $data->email
// 		]);

// 		// Send reset request email to user
// 		// php mailer stuff

// 		$mail = new PHPMailer;

// 		$mail->isSMTP();                                      // Set mailer to use SMTP
// 		$mail->Host = 'smtp.gmail.com';                       // Specify main and backup SMTP servers
// 		$mail->SMTPAuth = true;                               // Enable SMTP authentication
// 		$mail->Username = 'fatcloud.email.service@gmail.com'; // SMTP username
// 		$mail->Password = 'fatcloudadmin';                    // SMTP password
// 		$mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
// 		$mail->Port = 587;                                    // TCP port to connect to

// 		$mail->setFrom('noreply@fatcloud.com');

// 		$mail->From = 'noreply@fatcloud.com';
// 		$mail->FromName = 'fatcloud.com';
// 		$mail->addAddress($data->email, $match[0]['name']);         // Name is optional
// 		$mail->addReplyTo($data->email, $match[0]['name']);

// 		$mail->isHTML(true);                                  // Set email format to HTML

// 		$mail->Subject = 'Fat Cloud - Reset Password';

// 		$mail->Body    = 'Please click the link below to reset your password: <br><br><a href="http://localhost/school/fatcloud/#!/reset/' . $hash . '">Reset</a>';
// 		$mail->AltBody = 'Please click the link below to reset your password: <a href="http://localhost/school/fatcloud/#!/reset/' . $hash . '">Reset</a>';

// 		if(!$mail->send()) {
// 			$httpStatus = 400;
// 			throw new Exception('Confirmation email could not be sent.' . $mail->ErrorInfo);
// 		} else {
// 			$appResponse = new AppResponse(null);

// 		    $appResponse->SetStatus(200, 'Your request has been sent, please check your email.');
		    
// 			echo json_encode($appResponse);
// 		}
// 	} catch (Exception $e) {
// 		ReportError($e, $httpStatus);
// 	}
// });
// // -- all routes that are used from email:

// $app->post('/confirm', function() use ($database){
	
// 	$httpStatus = null;

// 	try{

// 	 	$data = GetHTTPData();

// 		if (empty($data->email)){
// 			$httpStatus = 401;
// 			throw new Exception('Invalid credentials, please try again.');
// 		}else if(empty($data->hash)){
// 			$httpStatus = 401;
// 			throw new Exception('Invalid credentials, please try again.');
// 		}

// 		$data->email = EscapeHtml($data->email);
// 		$data->hash = EscapeHtml($data->hash);

// 		// now check if there is a match and if so then update active to = 1;

// 		// get match
// 		$match = $database->select('users', [
// 			'email',
// 			'active'
// 		], [
// 			"AND" => [
// 				"email" => $data->email,
// 				"hash"  => $data->hash
// 			]
// 		]);

// 		// check match
// 		if($match){
// 			if($match[0]['active'] == 0){
// 				$database->update('users', [
// 					'active' => 1
// 				], [
// 					"AND" => [
// 						"email"  => $data->email,
// 						"hash"   => $data->hash,
// 						"active" => 0
// 					]
// 				]);
// 			}else{
// 				// should break try
// 				$httpStatus = 401;
// 				throw new Exception('Your account is already active.');
// 			}
// 		}else{
// 			// should break try
// 			$httpStatus = 401;
// 			throw new Exception('Your account does not exist.');
// 		}

// 		$appResponse = new AppResponse(null);

// 	    $appResponse->SetStatus(200, 'Account activation successful!');
	    
// 		echo json_encode($appResponse);
// 	} catch (Exception $e){
// 		ReportError($e, $httpStatus);
// 	}
// });

// $app->post('/reset', function() use ($database){
	
// 	$httpStatus = null;

// 	if (!function_exists('password_hash')){
// 		require_once APP_LIB_PATH . '/PasswordHashing/passwordLib.php';
// 	}

// 	try{

// 	 	$data = GetHTTPData();

// 		if (empty($data->password)){
// 			$httpStatus = 400;
// 			throw new Exception('The "password" feild is empty.');
// 		} elseif (empty($data->conPassword)){
// 			$httpStatus = 400;
// 			throw new Exception('The "Confirm Password" feild is empty.');
// 		} elseif (empty($data->hash)){
// 			$httpStatus = 401;
// 			throw new Exception('Invalid credentials, please try again.');
// 		} elseif ($data->password != $data->conPassword){
// 			$httpStatus = 401;
// 			throw new Exception('Your new password and the confirmed password do not match.');
// 		}

// 		$data->password    = EscapeHtml($data->password);
// 		$data->conPassword = EscapeHtml($data->conPassword);
// 		$data->hash        = EscapeHtml($data->hash);

// 		// get match
// 		$match = $database->select("users", [
// 			"password"
// 		], [
// 			"hash" => $data->hash
// 		]);

// 		// check match
// 		if($match){
// 			if(!password_verify($data->password, $match[0]['password'])){
// 				//hash password
// 				$newPassword = password_hash($data->password, PASSWORD_DEFAULT);

// 				$database->update('users', [
// 					'password' => $newPassword
// 				], [
// 					"hash" => $data->hash
// 				]);
// 			}else{
// 				// should break try
// 				$httpStatus = 401;
// 				throw new Exception('You must use a password that you have not already used.');
// 			}
// 		}else{
// 			// should break try
// 			$httpStatus = 401;
// 			throw new Exception('Your account does not exist.');
// 		}

// 		$appResponse = new AppResponse(null);

// 	    $appResponse->SetStatus(200, 'Password reset successful!');
	    
// 		echo json_encode($appResponse);
// 	} catch (Exception $e){
// 		ReportError($e, $httpStatus);
// 	}
// });

// $app->post('/updateName', function() use ($database){
	
// 	$httpStatus = null;

// 	@session_start();

// 	try{

// 		$data = GetHTTPData();

// 		if (empty($data->name)){
// 			$httpStatus = 400;
// 			throw new Exception('The "name" feild is empty.');
// 		}

// 		$data->name = EscapeHtml($data->name);
	
// 		$update = $database->update("users", [
// 			'name' => $data->name
// 		], [
// 			'email' => $data->email
// 		]);

// 		if ($update){

// 			$appResponse = new AppResponse(null);

// 			$_SESSION['name']    = UnescapeHtml($user[0]['email']);
// 			$_SESSION['password'] = UnescapeHtml($user[0]['password']);

// 			$appResponse->data = $user;
// 			$appResponse->SetStatus(200, 'Login successful.');

// 			// get date and time of now
// 			$date = date_create();
// 			$now  = date_format($date, 'Y-m-d H:i:s');

// 			$database->update('users', [
// 				'lastLogin' => $now
// 			], [
// 				'email' => $user[0]['email']
// 			]);

// 		    echo json_encode($appResponse);
// 		} else{
// 			$httpStatus = 401;
// 			throw new Exception('Invalid credentials, please try again.');
// 		}
// 	} catch (Exception $e){
// 		ReportError($e, $httpStatus);
// 	}
// });