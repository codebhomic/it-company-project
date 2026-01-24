<?php
// header("Access-Control-Allow-Origin: http://127.0.0.1:5500");
// header("Access-Control-Allow-Methods: POST, OPTIONS");
// header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "error" => "Method not allowed"
    ]);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);

if (!$input) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => "Invalid JSON data"
    ]);
    exit;
}

$name    = trim(filter_var($input['name'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS));
$email   = trim(filter_var($input['email'] ?? '', FILTER_SANITIZE_EMAIL));
$phone   = trim($input['phone'] ?? '');
$message = trim(filter_var($input['message'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS));

if (!$name || !$email || !$phone || !$message) {
    http_response_code(422);
    echo json_encode([
        "success" => false,
        "error" => "All fields are required"
    ]);
    exit;
}

if (strlen($name) < 2) {
    http_response_code(422);
    echo json_encode([
        "success" => false,
        "error" => "Invalid name"
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode([
        "success" => false,
        "error" => "Invalid email"
    ]);
    exit;
}

if (!preg_match('/^[0-9]{10}$/', $phone)) {
    http_response_code(422);
    echo json_encode([
        "success" => false,
        "error" => "Invalid phone number"
    ]);
    exit;
}

if (strlen($message) < 10) {
    http_response_code(422);
    echo json_encode([
        "success" => false,
        "error" => "Message too short"
    ]);
    exit;
}

// 💾 SAVE DATA (example: file storage)
$entry = [
    "name" => $name,
    "email" => $email,
    "phone" => $phone,
    "message" => $message,
    "time" => date("Y-m-d H:i:s")
];

file_put_contents("contacts.log", json_encode($entry) . PHP_EOL, FILE_APPEND);

// ✅ Success response
echo json_encode([
    "success" => true,
    "message" => "Contact saved successfully"
]);
