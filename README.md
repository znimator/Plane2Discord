# Plane to Discord Webhook Bridge

![License](https://img.shields.io/badge/license-MIT-green) ![Version](https://img.shields.io/badge/version-0.0.1-blue)

A Node.js middleware to bridge Plane work items board webhooks with Discord, supporting card creation, deletion, and state changes with rich embed formatting.

Feel free to contribute!

## Features
✅ Real-time Discord notifications  
✅ Card creation/deletion/movement tracking  
✅ Rich embed formatting with colors and user attribution  
✅ Serveo/ngrok/Cloud deployment support  
✅ Logging for debugging  

## Requirements
- Node.js 18+
- Discord webhook URL

## Examples

![image](https://github.com/user-attachments/assets/a3a2a04f-27ad-42b7-b801-5885f19114e4)

## Installation and Use

1. **Clone the repository**
```bash
git clone https://github.com/znimator/plane2discord.git
cd plane2discord
```
2. **Install dependencies**
```
npm install
```
3. **Create `.env` file**
```
DISCORD_WEBHOOK_URL=your-discord-webhook-url
```
4. **Start the server**
```
node run dev
```
5. **Request particual subdomain**
Using Serveo as example
(Requires to generate ssh-key to register and use subdomain)
```
ssh -R example:80:localhost:3000 serveo.net
```
6. **Put the given link in to the webhook payload on Plane**

![firefox_eCPvitT8H4](https://github.com/user-attachments/assets/d31d3856-55e2-484c-9577-800c698093cd)
