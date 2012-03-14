<?php
$email = $_POST["email"];
$returnmsg = array();
//if(strlen($email) <= 5) {
if($email == "abc@g.cn") {
	$returnmsg["stat"] = "ok";
	$returnmsg["valid"] = true;
} else {
	$returnmsg["stat"] = "ok";
	$returnmsg["valid"] = false;
}

echo json_encode($returnmsg);
?>
