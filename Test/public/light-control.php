<?php
header('Content-Type: application/json');

// Database connection
$servername = "mariadb";
$dbname = "Test";
$username = "test";
$password = "1234";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['error' => "Connection failed: " . $conn->connect_error]));
}

// Handle different HTTP methods
switch($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        // Get current light state
        $sql = "SELECT state FROM LightControl ORDER BY id DESC LIMIT 1";
        $result = $conn->query($sql);
        
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            echo json_encode(['state' => $row['state']]);
        } else {
            echo json_encode(['state' => 'OFF']);
        }
        break;
        
    case 'POST':
        // Update light state
        $data = json_decode(file_get_contents('php://input'), true);
        $state = isset($data['state']) ? $data['state'] : 'OFF';
        
        $sql = "INSERT INTO LightControl (state) VALUES (?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $state);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'state' => $state]);
        } else {
            echo json_encode(['error' => "Error updating light state"]);
        }
        break;
        
    default:
        echo json_encode(['error' => "Method not allowed"]);
}

$conn->close();
?> 