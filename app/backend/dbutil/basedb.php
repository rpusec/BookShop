<?php

require_once("../config/dbconfig.php");

abstract class BaseDB {

	private $conn;

	protected function startConn(){
		if(isset($this->conn))
			$this->conn->close();
		
		$this->conn = new mysqli($servername, $username, $password, $dbname);
		return $this->conn;
	}

	protected function closeConn(){
		return $this->conn->close();
	}

	protected function presentRSAsArray($result){
		if($result->num_rows > 0)
		{
			$arr = array();
			while($row = $result->fetch_assoc())
				$arr[] = $row;
			return $arr;
		}

		return null;
	}
}