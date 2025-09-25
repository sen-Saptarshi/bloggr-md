---
title: "From Localhost to Deployment: Taking Your App Online"
date: "2025-09-25"
author: "Saptarshi Sen"
tags: ["AWS", "DevOps", "EC2", "Deployment", "Nginx", "Certbot"]
description: "A guide on how to deploy a web app on AWS EC2 machine configured with Nginx. Multiple apps running on same server."
---

When building web apps, most of us start by running them on `localhost:3000`. While this works fine for development, it’s not accessible to the outside world. If you want others to use your app, you need to **deploy it to the internet**.

This post explains domains, IP addresses, intranet vs internet, deployment options, and a practical guide to deploying with **AWS EC2 + Nginx**.

## Domain vs IP

* `localhost` → refers to your computer’s loopback address.

  * IPv4: `127.0.0.1`
  * IPv6: `::1`

Try this command:

```bash
ping google.com
```

You’ll notice it resolves to Google’s IP address.

* IP addresses are of the form:

  ```
  (0-255).(0-255).(0-255).(0-255)
  ```

* IPs are limited and usually owned by companies or cloud providers.

* A **domain name** (like `google.com`) is a human-readable alias that resolves to an IP address. This makes websites easier to remember and access.

## Intranet vs Internet

* **Internet** → A global network of interconnected networks.
* **Intranet** → A private local network connecting computers inside an organization.

## How to Deploy an App

There are multiple ways to deploy your app:

1. **Rent servers on the cloud** (AWS, GCP, Azure).
2. **Host your own server** and expose it with tunneling.
3. **Serverless providers** (AWS Lambda, Cloudflare Workers).
4. **Platform-as-a-Service (PaaS)** like Netlify, Vercel, Heroku.

## Virtual Machines

* **Hypervisor** → Software that manages hardware allocation across multiple VMs.
* **Bare Metal** → Direct access to physical hardware (good for high-throughput workloads like crypto mining).

## SSH Basics

SSH (Secure Shell) is used to connect to remote servers.

* Generate keys:

  ```bash
  ssh-keygen
  ```

* Connect to a server:

  ```bash
  ssh user@ip_address
  ```

## AWS: The First Cloud Provider

### EC2

Steps to launch a VM (EC2 instance):

1. Select an OS image.
2. Choose machine type (CPU, RAM).
3. Create/download a key pair.
4. Configure **security groups** (firewall rules for SSH, HTTP, HTTPS).

Once launched, SSH into the VM and run your app (e.g., an Express server).

## Nginx Setup

By default:

* HTTP runs on port `80`.
* HTTPS runs on port `443`.

Your app may be running on port `3000`, which is not ideal. Options:

1. Change your app to run on port 80 (requires `sudo`).
2. Use **Nginx as a reverse proxy**.

Using Nginx is better because:

* It can forward traffic to different apps based on domain name.
* You can run multiple apps on the same server.
* It acts as a load balancer.

Other tools: Apache, Traefik, HAProxy.

### Install and Configure Nginx

```bash
sudo apt install nginx
sudo nginx -s reload
```

Edit `/etc/nginx/nginx.conf`:

```nginx
events {}

http {
    server {
        listen 80;
        server_name app1.saptarshi.live;

        location / {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    server {
        listen 80;
        server_name app2.saptarshi.live;

        location / {
            proxy_pass http://localhost:3001;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
```

Then:

* Point your domain’s `A record` to the server’s public IP.
* Keep your app running with **pm2** or **forever**.
* use `pm2 examples` to know about its usage.

## SSL Certificates with Certbot

Use [Certbot](https://certbot.eff.org/) to install free SSL certificates from Let’s Encrypt.

This secures your site with HTTPS on port 443.

## Conclusion

* `localhost:3000` is for development only.
* To share your app with the world, you need a **server + domain + SSL**.
* The most common stack: **AWS EC2 + Nginx + Certbot**.

Once you’ve got this setup, you can deploy multiple apps on the same server with different domains and keep them secure.
