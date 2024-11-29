<?php

function svelteSSR($data) {
   $ch = curl_init(getenv('SVELTE_SSR_URL'));
   curl_setopt_array($ch, [
       CURLOPT_POST => true,
       CURLOPT_POSTFIELDS => json_encode($data),
       CURLOPT_RETURNTRANSFER => true,
       CURLOPT_HTTPHEADER => ['Content-Type: application/json']
   ]);
   return json_decode(curl_exec($ch), true);
}

try {
    $result = svelteSSR(['ping' => 'pong']);
    echo "<pre>";
    var_dump($result);
    echo "</pre>";
} catch (Exception $e) {
    echo $e->getMessage();
}
