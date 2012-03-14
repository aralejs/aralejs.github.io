<?php
$callback = $_REQUEST["_callback"];
$email = $_REQUEST["email"];
$returnmsg = array();
//if(strlen($email) <= 5) {
if($email == "abc@g.cn") {
	$returnmsg["stat"] = "ok";
	$returnmsg["valid"] = true;
} else {
	$returnmsg["stat"] = "ok";
	$returnmsg["valid"] = false;
}

header('Content-type: text/javascript');
echo $callback."(".json_encode($returnmsg).")";
?>
