<?php

function svelteSSR($data = null) {
   $ch = curl_init(getenv('SVELTE_SSR_URL'));
   var_dump(getenv('SVELTE_SSR_URL'));
   curl_setopt_array($ch, [
       CURLOPT_POST => true,
       CURLOPT_POSTFIELDS => json_encode($data ?? ["server" => "true"]),
       CURLOPT_RETURNTRANSFER => true,
       CURLOPT_HTTPHEADER => ['Content-Type: application/json']
   ]);
   return json_decode(curl_exec($ch), true);
}

try {
    $result = svelteSSR();
    echo "<pre>";
    var_dump($result);
    echo "</pre>";
} catch (Exception $e) {
    echo $e->getMessage();
}
