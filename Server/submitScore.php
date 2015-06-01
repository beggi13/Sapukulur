<?php

$db = new SQLite3('dataScores') or die('Unable to open database');
$query = <<<EOD
 	CREATE TABLE IF NOT EXISTS HighScoreTable (
    name STRING,
    score INT)
EOD;
$db->exec($query) or die('Create db failed');


$name = $_GET['name'];
$score = $_GET['score'];

// prevent too long names
if(strlen($name) > 10){
	$name = substr($name, 0, 10);
}

$query = <<<EOD
 	INSERT INTO HighScoreTable VALUES ( '$name', '$score' )
EOD;
$db->exec($query);


$db->query("DELETE FROM HighScoreTable where score not in (select score from HighScoreTable order by score desc limit 10)");

$getQuery = <<<EOD
 	SELECT * FROM HighScoreTable 
 	WHERE score > 0
 	ORDER BY score DESC
EOD;

$result = $db->query($getQuery) or die('Query failed');

while ($row = $result->fetchArray()){
	//echo json_encode($row);
	echo "<p>{$row['name']} : {$row['score']}\n</p>";
}

?>
