<?php
session_start();

function svelte_ssr(string $component, array $data = null): mixed {
   $ch = curl_init(getenv('SVELTE_SSR_URL'));
   curl_setopt_array($ch, [
       CURLOPT_POST => true,
       CURLOPT_POSTFIELDS => json_encode(["path" => $component, "props" => $data]),
       CURLOPT_RETURNTRANSFER => true,
       CURLOPT_HTTPHEADER => ['Content-Type: text/html']
   ]);
   return curl_exec($ch);
}

function receive_client_state() {
    $state = file_get_contents('php://input');

    try {
        $_SESSION['game_state'] = json_decode($state);
        http_response_code(200);
    } catch (\Throwable $th) {
        http_response_code(500);
    }

    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') receive_client_state();

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PHP Example</title>
</head>
<body>

<div>
<?php
    try {
        $game_state = $_SESSION["game_state"] ?? null;
        $props = $game_state ? ["initialState" => $_SESSION["game_state"]] : null;
        echo svelte_ssr("/lib/Puzzle", $props);
    } catch (Exception $e) {
        echo $e->getMessage();
    }
?>
</div>

</body>
</html>
