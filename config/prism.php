<?php

return [
    'prism_server' => [
        'middleware' => [],
        'enabled' => env('PRISM_SERVER_ENABLED', true),
    ],
    'providers' => [
        'mistral' => [
            'api_key' => env('MISTRAL_API_KEY', ''),
            'url' => env('MISTRAL_URL', 'https://api.mistral.ai/v1'),
        ],
        'gemini' => [
            'api_key' => env('GEMINI_API_KEY', ''),
            'url' => env('GEMINI_URL', 'https://generativelanguage.googleapis.com/v1beta/models'),
        ],
    ],
];
