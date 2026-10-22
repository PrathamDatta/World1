<?php
/**
 * ADINET INFOSYSTEMS: contact form endpoint.
 *
 * Receives the website's enquiry form as JSON, validates it again on the server, and emails it to the sales
 * address. Works on ordinary cPanel hosting with PHP 7.4 or newer; it only uses PHP's built-in mail().
 *
 * To change a setting without editing this file (so future site updates do not overwrite it), create an optional
 * file named contact-config.php next to this one:   <?php return ['to' => 'someone@example.com'];
 */

declare(strict_types=1);

ini_set('display_errors', '0');

// Almost every host has mbstring; these fallbacks keep the form working on one that does not.
if (!function_exists('mb_strlen')) {
    function mb_strlen($s) { return preg_match_all('/./su', (string) $s) ?: strlen((string) $s); }
}
if (!function_exists('mb_substr')) {
    function mb_substr($s, $start, $len = null) {
        $chars = preg_split('//u', (string) $s, -1, PREG_SPLIT_NO_EMPTY) ?: str_split((string) $s);
        return implode('', array_slice($chars, $start, $len));
    }
}

// ---- settings -------------------------------------------------------------------------------------------------
$config = [
    'to'          => 'sales@adinet.in',
    'from'        => '',            // empty = noreply@<this website's domain>; the mailbox does not need to exist
    'subject'     => 'Website enquiry',
    'min_seconds' => 2,             // forms submitted faster than this are treated as bots
    'rate_max'    => 5,             // accepted enquiries per visitor ...
    'rate_window' => 900,           // ... within this many seconds
    // Safety net: only written if sending the email fails. Lives in the home folder, outside public_html.
    'outbox'      => dirname(__DIR__) . '/adinet-contact-outbox.log',
];
$override = __DIR__ . '/contact-config.php';
if (is_file($override)) {
    $custom = include $override;
    if (is_array($custom)) {
        $config = array_merge($config, array_intersect_key($custom, $config));
    }
}

const INTERESTS = [
    'Domain registration', 'IT support', 'Cloud hosting', 'Web hosting', 'Business email',
    'Website design', 'Custom web application', 'Security & addons', 'Something else',
];

// ---- helpers --------------------------------------------------------------------------------------------------
function respond(int $status, array $data)
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/** One line of text: control characters (including CR/LF, the header-injection characters) become spaces. */
function clean_line($value, int $max): string
{
    $value = is_string($value) ? $value : '';
    $value = preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $value) ?? '';
    $value = trim(preg_replace('/\s{2,}/u', ' ', $value) ?? '');
    return mb_substr($value, 0, $max);
}

/** Multi-line text: keep line breaks, drop other control characters. */
function clean_text($value, int $max): string
{
    $value = is_string($value) ? $value : '';
    $value = str_replace(["\r\n", "\r"], "\n", $value);
    $value = preg_replace('/[^\P{C}\n]+/u', '', $value) ?? '';
    return mb_substr(trim($value), 0, $max);
}

function mime_header(string $text): string
{
    return preg_match('/^[\x20-\x7E]*$/', $text) ? $text : '=?UTF-8?B?' . base64_encode($text) . '?=';
}

function rate_limited(string $ip, int $max, int $window): bool
{
    $file = sys_get_temp_dir() . '/adinet_contact_' . hash('sha256', $ip) . '.json';
    $now = time();
    $handle = @fopen($file, 'c+');
    if (!$handle) {
        return false; // never block real visitors because the temp folder is unavailable
    }
    flock($handle, LOCK_EX);
    $times = json_decode((string) stream_get_contents($handle), true);
    $times = is_array($times) ? array_values(array_filter($times, fn($t) => is_int($t) && $t > $now - $window)) : [];
    $limited = count($times) >= $max;
    if (!$limited) {
        $times[] = $now;
        ftruncate($handle, 0);
        rewind($handle);
        fwrite($handle, json_encode($times));
    }
    flock($handle, LOCK_UN);
    fclose($handle);
    return $limited;
}

// ---- request checks -------------------------------------------------------------------------------------------
try {
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        header('Allow: POST');
        respond(405, ['ok' => false, 'error' => 'Method not allowed.']);
    }

    // Same-site posts only: if the browser says where the request came from, it must be this website.
    $host = strtolower((string) preg_replace('/:\d+$/', '', (string) ($_SERVER['HTTP_HOST'] ?? '')));
    $origin = (string) ($_SERVER['HTTP_ORIGIN'] ?? '');
    if ($origin !== '') {
        $originHost = strtolower((string) parse_url($origin, PHP_URL_HOST));
        if ($originHost === '' || $originHost !== $host) {
            respond(403, ['ok' => false, 'error' => 'Request not allowed.']);
        }
    }

    $raw = (string) file_get_contents('php://input', false, null, 0, 40001);
    if (strlen($raw) > 40000) {
        respond(413, ['ok' => false, 'error' => 'Your message is too long.']);
    }
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        respond(400, ['ok' => false, 'error' => 'Invalid request.']);
    }

    // Honeypot: real visitors never see or fill this field. Pretend it worked so bots learn nothing.
    if (clean_line($data['website'] ?? '', 200) !== '') {
        respond(200, ['ok' => true]);
    }

    // ---- validation (mirrors the form in the browser; the server never trusts the browser) -----------------------
    $errors = [];
    $name = clean_line($data['name'] ?? '', 100);
    if (mb_strlen($name) < 2) {
        $errors['name'] = 'Please enter your name.';
    }
    $email = clean_line($data['email'] ?? '', 254);
    if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || strpos($email, ' ') !== false) {
        $errors['email'] = 'Please enter a valid email address.';
    }
    $phone = clean_line($data['phone'] ?? '', 30);
    if ($phone !== '' && !preg_match('/^[+()\d\s-]{7,20}$/', $phone)) {
        $errors['phone'] = 'Please enter a valid phone number.';
    }
    $company = clean_line($data['company'] ?? '', 150);
    $interest = clean_line($data['interest'] ?? '', 60);
    if (!in_array($interest, INTERESTS, true)) {
        $interest = 'Something else';
    }
    $domain = strtolower(clean_line($data['domain'] ?? '', 253));
    $domain = (string) preg_replace('~^https?://|^www\.|/.*$~i', '', $domain);
    if ($domain !== '' && !preg_match('/^(?=.{3,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}$/', $domain)) {
        $errors['domain'] = 'Please enter a domain name such as yourcompany.com.';
    }
    $message = clean_text($data['message'] ?? '', 5000);
    if (mb_strlen($message) < 10) {
        $errors['message'] = 'Please tell us a little about what you need (at least 10 characters).';
    } elseif (preg_match_all('~https?://|www\.~i', $message) > 2) {
        $errors['message'] = 'Please remove the links from your message; we can discuss them once we reply.';
    }
    if ($errors) {
        respond(422, ['ok' => false, 'error' => 'Please check the highlighted fields.', 'fields' => $errors]);
    }

    // Bots submit instantly; people take a few seconds.
    $elapsed = (int) ($data['elapsed'] ?? 0);
    if ($elapsed < (int) $config['min_seconds'] * 1000) {
        respond(422, ['ok' => false, 'error' => 'Please wait a moment and press Send again.']);
    }

    $ip = (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
    if (rate_limited($ip, (int) $config['rate_max'], (int) $config['rate_window'])) {
        respond(429, ['ok' => false, 'error' => 'Too many messages in a short time. Please try again later.']);
    }

    // ---- build and send the email -------------------------------------------------------------------------------
    $siteHost = (string) preg_replace('/^www\./', '', $host);
    if (!preg_match('/^[a-z0-9.-]+$/', $siteHost) || $siteHost === '') {
        $siteHost = 'localhost';
    }
    $from = $config['from'] !== '' ? (string) $config['from'] : 'noreply@' . $siteHost;
    $to = (string) $config['to'];

    $lines = [
        'New website enquiry',
        str_repeat('-', 19),
        'Name:          ' . $name,
        'Email:         ' . $email,
        'Phone:         ' . ($phone !== '' ? $phone : '-'),
        'Company:       ' . ($company !== '' ? $company : '-'),
        'Interested in: ' . $interest,
        'Domain:        ' . ($domain !== '' ? $domain : '-'),
        '',
        'Message:',
        $message,
        '',
        '--',
        'Sent from ' . $siteHost . ' on ' . gmdate('Y-m-d H:i') . ' UTC (visitor IP ' . $ip . ')',
        'Reply to this email to answer the visitor directly.',
    ];
    $body = implode("\r\n", $lines);

    // Display name only: drop characters that mail software treats as address syntax (groups, comments, extra addresses).
    $replyName = mime_header(trim((string) preg_replace('/[<>",;:@()\[\]\\\\]/', '', $name)));
    $headers = implode("\r\n", [
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
        'From: ' . mime_header('ADINET INFOSYSTEMS website') . ' <' . $from . '>',
        'Reply-To: ' . $replyName . ' <' . $email . '>',
        'X-Mailer: adinet-contact-form',
    ]);
    $subject = mime_header($config['subject'] . ': ' . $interest);

    $sent = @mail($to, $subject, $body, $headers, '-f' . $from);
    if (!$sent) {
        $sent = @mail($to, $subject, $body, $headers); // some hosts reject the -f option
    }

    if (!$sent) {
        error_log('adinet contact form: mail() failed for an enquiry from ' . $email);
        // Keep the enquiry so it is not lost, in a file the web cannot reach.
        $record = json_encode([
            'time' => gmdate('c'), 'name' => $name, 'email' => $email, 'phone' => $phone, 'company' => $company,
            'interest' => $interest, 'domain' => $domain, 'message' => $message,
        ], JSON_UNESCAPED_UNICODE);
        @file_put_contents((string) $config['outbox'], $record . "\n", FILE_APPEND | LOCK_EX);
        respond(500, ['ok' => false, 'error' => 'We could not send your message right now.']);
    }

    respond(200, ['ok' => true]);
} catch (Throwable $e) {
    error_log('adinet contact form error: ' . $e->getMessage());
    respond(500, ['ok' => false, 'error' => 'Something went wrong on our side.']);
}
