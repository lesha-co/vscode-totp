# TOTP Generator

## Features

- store OTP passwords in encrypted way, requiring password upon activation
- adding new keys encoded with base-32 (otpauth://) and with hex
- copying tokens directly to clipboard, no one gets to see it

## Export data

Press `Option+Shift+O` to activate extension, then click on floppy icon, enter encryption password (it's not the same as your main password) if you want. It will open a document that contains encrypted or plain-text backup. You can then restore from backup using "opened folder" icon.

> Beware, I'm not a security expert and can't guarantee that it's impossible for third party to extract your secrets, I've just did my best not to store them or encryption password in plaintext on disk.