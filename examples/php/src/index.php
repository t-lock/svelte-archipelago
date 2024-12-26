<?php

function svelteSSR($component, $data = null) {
   $ch = curl_init(getenv('SVELTE_SSR_URL'));
   curl_setopt_array($ch, [
       CURLOPT_POST => true,
       CURLOPT_POSTFIELDS => json_encode(["path" => $component, "props" => $data]),
       CURLOPT_RETURNTRANSFER => true,
       CURLOPT_HTTPHEADER => ['Content-Type: text/html']
   ]);
   return curl_exec($ch);
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PHP Example</title>
</head>
<body>

<?php
    try {
        echo svelteSSR("/lib/Counter");
        echo svelteSSR("/lib/Counter", ["initialCount" => 99]);
        echo svelteSSR("/lib/Counter2");
        echo svelteSSR("/lib/child/Counter");
    } catch (Exception $e) {
        echo $e->getMessage();
    }
?>

</body>
</html>
