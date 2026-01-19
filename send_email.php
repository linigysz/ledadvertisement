<?php
header('Content-Type: application/json');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Load Composer's autoloader or manual include if Composer not used
if (file_exists('vendor/autoload.php')) {
    require 'vendor/autoload.php';
} else {
    // If you don't have composer, please download PHPMailer and place it in 'PHPMailer' directory
    if (file_exists('PHPMailer/src/Exception.php') && file_exists('PHPMailer/src/PHPMailer.php') && file_exists('PHPMailer/src/SMTP.php')) {
        require 'PHPMailer/src/Exception.php';
        require 'PHPMailer/src/PHPMailer.php';
        require 'PHPMailer/src/SMTP.php';
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "SMTP library not found. Please install PHPMailer."]);
        exit;
    }
}

// Helper function to sanitize input
function sanitize_input($data) {
    if (!isset($data)) return '';
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $name = sanitize_input($_POST['name'] ?? '');
    $email = sanitize_input($_POST['email'] ?? '');
    $phone = sanitize_input($_POST['phone'] ?? '');
    $message = sanitize_input($_POST['message'] ?? '');

    // Validation
    if (empty($name) || empty($email) || empty($phone) || empty($message)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Please fill in all fields."]);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Invalid email format."]);
        exit;
    }

    $mail = new PHPMailer(true);

    try {
        //Server settings
        $mail->isSMTP();                                            
        $mail->Host       = 'smtp.example.com';                     // Set the SMTP server to send through
        $mail->SMTPAuth   = true;                                   // Enable SMTP authentication
        $mail->Username   = 'gysztechnologies@gmail.com';               // SMTP username
        $mail->Password   = 'pfgnmktbjqqglpak';                        // SMTP password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;         // Enable TLS encryption; `PHPMailer::ENCRYPTION_SMTPS` encouraged
        $mail->Port       = 587;                                    // TCP port to connect to, use 465 for `PHPMailer::ENCRYPTION_SMTPS` above

        //Recipients
        $mail->setFrom('gysztechnologies@gmail.com', 'Mailer');
        $mail->addAddress('lini@gysztechnologies.com');     // Add a recipient
        $mail->addReplyTo($email, $name);

        //Content
        $mail->isHTML(true);                                  // Set email format to HTML
        $mail->Subject = 'New Enquiry from Website: ' . $name;
        $mail->Body    = "
            <h3>New Enquiry Received</h3>
            <p><strong>Name:</strong> $name</p>
            <p><strong>Email:</strong> $email</p>
            <p><strong>Phone:</strong> $phone</p>
            <p><strong>Message:</strong><br>$message</p>
        ";
        $mail->AltBody = "Name: $name\nEmail: $email\nPhone: $phone\nMessage:\n$message";

        $mail->send();
        echo json_encode(["status" => "success", "message" => "Thank you! Your enquiry has been sent."]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Message could not be sent. Mailer Error: {$mail->ErrorInfo}"]);
    }
} else {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "Access denied."]);
}
?>
