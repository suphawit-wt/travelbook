# 🧳 Travelbook

A modular backend built with Go, implementing a highly scalable microservices architecture for a comprehensive travel booking platform.

## 🧩 Monorepo Overview

| Service / Component | Description |
| :--- | :--- |
| [Auth Service](../apps/auth-service/) | **Core Service:** Handles user/partner authentication, OAuth, JWT token generation, refreshing, and session management. |
| [User Service](../apps/user-service/) | **Core Service:** Manages customer profiles, account settings, preferences, and user-specific data. |
| [User Consumer](../apps/user-consumer/) | **Event Consumer:** An event listener package enabling other microservices to process user-related events asynchronously. |
| [Partner Consumer](../apps/partner-consumer/) | **Event Consumer:** Handles hotel/property host registration events, partner profiles and vendor management updates. |
| [Email Consumer](../apps/email-consumer/) | **Event Consumer:** Handles async transactional email delivery (e.g., booking confirmations, verification codes, password resets). |
| [Property Service](../apps/property-service/) | **Core Service:** Manages accommodation listings, property details, amenities, policies, and geolocation data. |
| [Review Service](../apps/review-service/) | **Core Service:** Manages customer ratings, feedback, and property reviews. |
| [Review Consumer](../apps/review-consumer/) | **Event Consumer:** Listens to Kafka message queues to process and sync review-related data. |
| [Search Consumer](../apps/search-consumer/) | **Event Consumer:** Listens to Kafka message queues to sync property updates into Elasticsearch for fast discovery. |
| [Booking Service](../apps/booking-service/) | **Core Service:** Coordinates the core reservation lifecycle, checkout state, invoice generation, and order persistence. |
| [Booking Worker](../apps/booking-worker/) | **Cron/Cronjob Worker:** Periodically scans for pending/unpaid bookings that have exceeded their reservation window. |
| [Booking Consumer](../apps/booking-consumer/) | **Event Consumer:** Processes timeout events to securely roll back room inventory allocations when a reservation expires. |
| [Payment Service](../apps/payment-service/) | **Core Service:** Handles secure payment processing, transaction logging, refunds, and webhook integrations with payment gateways like Stripe. |
| [go-libs](../pkg/go-libs/) | **Shared Libraries:** Centralized reusable utilities, logger configurations, custom error handlers, and middleware used across all services. |
| [Web (Front-end)](../apps/web/) | **Client Application:** The responsive, user-facing web interface built with Next.js and Styled Components, integrated with backend services for property discovery, real-time booking, and Stripe payments. |


## 📚 Table of Contents

- [🛠️ Development](#development)
    - [📦 Local Development Setup](#local-development-setup)
    - [🌐 URL Routing](#url-routing)
- [📜 License](#license)



## <span id="development">🛠️ Development</span>

Follow these steps sequentially to clone, configure, and initialize the entire ecosystem in the exact structural order of your workspace dependencies.

### <span id="local-development-setup">📦 Local Development Setup</span>

install all tools for dev environment:
```bash
make init
```

Start the entire stack with Docker Compose:
```bash
make cluster
```

```bash
docker build \
  --build-arg NEXT_PUBLIC_API_BASE_URL=Value \
  --build-arg NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID=Value \
  --build-arg NEXT_PUBLIC_FACEBOOK_OAUTH_APP_ID=Value \
  --build-arg NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=Value \
  -t asia-southeast1-docker.pkg.dev/suphawit-wt/travelbook/travelbook-web:1.0.0 .
```

### <span id="url-routing">🌐 URL Routing</span>
- **Web (Front-end):** [https://travelbook.localhost](https://travelbook.localhost)
- **Kiali:** [https://kiali.travelbook.localhost](https://kiali.travelbook.localhost)
- **Vault:** [https://vault.travelbook.localhost](https://vault.travelbook.localhost)
- **Kibana:** [https://kibana.travelbook.localhost](https://kibana.travelbook.localhost)
- **Kafbat:** [https://kafbat.travelbook.localhost](https://kafbat.travelbook.localhost)
- **Debezium:** [http://localhost:8083](http://localhost:8083)


## <span id="license">📜 License</span>

This project is licensed under  
[CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/) (Attribution-NonCommercial-NoDerivatives 4.0 International). See the full [LICENSE](../LICENSE) file for details.

[![License: CC BY-NC-ND 4.0](https://licensebuttons.net/l/by-nc-nd/4.0/88x31.png)](https://creativecommons.org/licenses/by-nc-nd/4.0/)

© 2026 **Suphawit Watthanataetakun.** All rights reserved.  
Use is allowed for **non-commercial**, **non-derivative** purposes only.