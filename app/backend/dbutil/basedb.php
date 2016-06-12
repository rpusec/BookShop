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

	protected function addEntity($arrEntityInfo, $tablename, $bindStr){
		parent::startConn();

		$sql = "INSERT INTO $tablename (";
		$values = array();

		foreach($arrEntityInfo as $infoKey => $infoVal)
		{
			$sql .= $infoKey;
			array_push($values, $infoVal);

			if($infoKey != end($arrEntityInfo))
				$sql .= ", ";
			else
				$sql .= ") VALUES (";
		}

		foreach($arrEntityInfo as $infoKey => $infoVal)
		{
			$sql .= '?';

			if($infoKey != end($arrEntityInfo))
				$sql .= ", ";
			else
				$sql .= ") ";
		}

		array_unshift($values, $bindStr);		
		$stmt = (parent::getConn())->prepare($sql);
		call_user_func_array(array($stmt, "bind_param"), $values);
		$stmt->execute();
		$stmt->close();
		parent::closeConn();
		return $stmt->affected_rows === 1;			
	}

	protected function editEntity($entityID, $updateArr, $tablename, $entityIDName){
		parent::startConn();

		$sql = 'UPDATE ' . $tablename . ' SET ';
		$bindStr = "";
		$values = array();

		foreach($updateArr as $updateKey => $updateInfo)
		{
			$sql .= "$updateKey=? ";
			$bindStr .= $updateInfo['type'];
			array_push($values, $updateInfo['value']);
		}

		$sql .= "WHERE $entityIDName=?";
		$bindStr .= "i";
		array_push($values, $userID);
		array_unshift($values, $bindStr);

		$stmt = (parent::getConn())->prepare($sql);
		call_user_func_array(array($stmt, "bind_param"), $values);
		$stmt->execute();
		$stmt->close();
		parent::closeConn();

		return $stmt->affected_rows === 1;
	}

	protected function deleteEntity($entityID, $tablename, $entityIDName){
		parent::startConn();
		$stmt = (parent::getConn())->prepare("DELETE FROM $tablename WHERE $entityIDName=?");
		$stmt->bind_param("i", $entityID);
		$stmt->execute();
		$stmt->close();
		parent::closeConn();
		return $stmt->affected_rows === 1;
	}
}