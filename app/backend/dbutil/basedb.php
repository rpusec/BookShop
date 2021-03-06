<?php

require_once("../config/dbconfig.php");

abstract class BaseDB {

	private static $conn;

	public static function startConn(){
		if(isset(self::$conn))
			self::$conn->close();
		
		self::$conn = new mysqli(SERVERNAME, USERNAME, PASSWORD, DBNAME);
		return self::$conn;
	}

	public static function getConn(){
		return self::$conn;
	}

	public static function closeConn(){
		return self::$conn->close();
	}

	protected static function presentRSAsArray($result){
		if($result->num_rows > 0)
		{
			$arr = array();
			while($row = $result->fetch_assoc())
				$arr[] = $row;
			return $arr;
		}

		return null;
	}

	protected static function addEntity($arrEntityInfo, $tablename, $bindStr){
		$sql = "INSERT INTO $tablename (";
		$values = array();

		end($arrEntityInfo);
		$lastKey = key($arrEntityInfo);

		foreach($arrEntityInfo as $infoKey => $infoVal)
		{
			$sql .= $infoKey;
			$values[] = &$arrEntityInfo[$infoKey];

			if($infoKey != $lastKey)
				$sql .= ", ";
			else
				$sql .= ") VALUES (";
		}

		foreach($arrEntityInfo as $infoKey => $infoVal)
		{
			$sql .= '?';

			if($infoKey != $lastKey)
				$sql .= ", ";
			else
				$sql .= ") ";
		}

		array_unshift($values, $bindStr);

		$stmt = self::getConn()->prepare($sql);
		call_user_func_array(array($stmt, "bind_param"), $values);
		$stmt->execute();
		$ar = $stmt->affected_rows;
		$stmt->close();
		return $ar === 1;			
	}

	protected static function editEntity($entityID, $updateArr, $tablename, $entityIDName){
		$sql = 'UPDATE ' . $tablename . ' SET ';
		$bindStr = "";
		$values = array();

		end($updateArr);
		$lastKey = key($updateArr);

		foreach($updateArr as $updateKey => $updateInfo)
		{
			$sql .= "$updateKey=?";
			$bindStr .= $updateInfo['type'];
			$values[] = &$updateArr[$updateKey]['value'];

			if($updateKey != $lastKey)
				$sql .= ", ";
		}

		$sql .= " WHERE $entityIDName=?";
		$bindStr .= "i";
		$values[] = &$entityID;
		array_unshift($values, $bindStr);

		$stmt = self::getConn()->prepare($sql);
		call_user_func_array(array($stmt, "bind_param"), $values);
		$stmt->execute();
		$ar = $stmt->affected_rows;
		$stmt->close();

		return $ar === 1;
	}

	protected static function deleteEntity($entityID, $tablename, $entityIDName){
		$stmt = self::getConn()->prepare("DELETE FROM $tablename WHERE $entityIDName=?");
		$stmt->bind_param("i", $entityID);
		$stmt->execute();
		$ar = $stmt->affected_rows;
		$stmt->close();
		return $ar === 1;
	}
}