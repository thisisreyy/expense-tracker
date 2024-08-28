<?php
$data = file_get_contents('php://input');
$newUser = json_decode($data, true);

$file = 'users.json';
if (file_exists($file)) {
    $currentUsers = json_decode(file_get_contents($file), true);
} else {
    $currentUsers = [];
}

$currentUsers[] = $newUser;
file_put_contents($file, json_encode($currentUsers));
echo json_encode(['status' => 'success']);
?>
