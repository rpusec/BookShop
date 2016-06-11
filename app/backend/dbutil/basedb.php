<?php

require_once("../../dbinfo.php");

abstract class BaseDB {

	private $conn;

	protected function startConn(){
		if(isset($this->conn))
			mysql_close($this->conn);
		
		$this->conn = mysqli_connect($servername, $username, $password, $dbname);
		return $this->conn;
	}

	protected function endConn(){
		return mysql_close($this->conn);
	}

	protected function presentRSAsArray($result){
		if(mysqli_num_rows($result) > 0)
		{
			$arr = new Array();
			while($row = mysqli_fetch_assoc($result))
				$arr[] = $row;
			return $arr;
		}

		return null;
	}
}