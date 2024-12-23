<?php

function svelteSSR($data = null) {
   $ch = curl_init(getenv('SVELTE_SSR_URL'));
   curl_setopt_array($ch, [
       CURLOPT_POST => true,
       CURLOPT_POSTFIELDS => json_encode($data ?? ["server" => "true"]),
       CURLOPT_RETURNTRANSFER => true,
       CURLOPT_HTTPHEADER => ['Content-Type: text/html']
   ]);
   return curl_exec($ch);
}

// ! TODO: open an issue with Svelte team on why hydration doesn't work with
// the hydration-specific helper comments that Svelte adds....
function stripSvelteComments(string $html): string {
    // Strip <!--[--> and <!--]--> comments that Svelte SSR adds
    return preg_replace('/<!--\[--\>|<!--\]--\>/', '', $html);
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
        echo stripSvelteComments(svelteSSR());
    } catch (Exception $e) {
        echo $e->getMessage();
    }
?>

</body>
</html>
