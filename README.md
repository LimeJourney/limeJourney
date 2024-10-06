# LimeJourney: Open Source Customer Engagement Platform

![Lime Journey Cover](https://github.com/user-attachments/assets/f1029772-8a02-43a0-b2f1-5598c53b30e5)

LimeJourney is an open-source customer engagement platform with AI capabilities that help businesses create personalized, data-driven user journeys at scale.

[![GitHub stars](https://img.shields.io/github/stars/limejourney/limejourney.svg?style=social&label=Star&maxAge=2592000)](https://GitHub.com/limejourney/limejourney/stargazers/)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

## 🚀 Introduction

LimeJourney evolved from a closed-source platform called "Stapl," born out of a real need I had while running Teal. I needed a way to communicate with customers at the right time, ideally triggered by specific actions. However, I encountered two major challenges with existing tools:

- Many were expensive.
- They required switching our entire communication stack to their platform.

To address these issues, I created LimeJourney with two key principles:

1. **Open-Source Accessibility**: We've made LimeJourney open-source, allowing smaller teams and developers to use it freely. For those preferring a managed solution, we offer a cloud version.

2. **BYOI (Bring Your Own Integrations)**: LimeJourney allows you to connect your existing tools, eliminating the need for a complete overhaul of your communication stack.

I'm always excited to chat about LimeJourney and how it can help your business. Feel free to reach out at tobi@limejourney.com or try our hosted demo [Insert Demo Link Here] to experience LimeJourney for yourself.

_-Tobi Okewole, Founder LimeJourney_

## 🔗 Useful Links

- [Documentation](link_to_docs)
- [API Reference](link_to_api_docs)
- [Community Forum](link_to_forum)
- [Roadmap](link_to_roadmap)
- [Release Notes](link_to_releases)

## 🌟 Key Features

- 🤖 **AI-Driven Insights**: We use AI models to help you understand your customers better
- 🛠 **Visual Journey Builder**: The visual journey builder allows you to create complex user journeys with an intuitive drag-and-drop interface
- 🎯 **Dynamic Segmentation**: We allow you to create dynamic segments that are based on either user events or attributes - You can create segments like "Users who have not purchased in the last 30 days"
- 🔗 **Integration**: You can connect your existing tools and services to LimeJourney, and we are working hard on adding more integrations especially around data ingestion

Ready to revolutionize your customer engagement strategy?
[Try Our Demo](link_to_demo) | [Book a Call with Our CEO](link_to_booking_page)

## 🏗 How Is LimeJourney Built?

LimeJourney is built on a modern, scalable architecture designed to handle high-volume data processing and real-time interactions.

It is a fullstack monorepo application built with TypeScript across the board.

We use:

- [Turbo](https://turbo.build/) for managing the monorepo
- [Next.js](https://nextjs.org/) for the web app
- [TailwindCSS](https://tailwindcss.com/) for styling
- [Express](https://expressjs.com/) for the API
- [TSOA](https://tsoa-community.github.io/docs/) for generating API routes and OpenAPI documentation
- [PostgreSQL](https://www.postgresql.org/) as the main datastore
- [Redis](https://redis.io/) for a KV store for managing Journey<>Trigger mappings
- [ClickHouse](https://clickhouse.com/) for managing high volume event/entity data as well as for real time segmentation
- [Temporal](https://temporal.io/) for executing the journeys made on the visual journey builder
- [Kafka](https://kafka.apache.org/) (hosted on [Upstash](https://upstash.com/)) as the central event bus for the system

### Backend Architecture In Detail

![Image_Of_Backend_Architecture](https://github.com/user-attachments/assets/800c273f-1b08-410d-ac89-2010d08b2dc9)

#### Core Components

1. **Event Streaming Backbone**
   At the heart of our system lies a Kafka-based event streaming platform. This acts as the nervous system of LimeJourney, enabling:

   - High-throughput processing of user and system events
   - Decoupled communication between different parts of the system
   - Reliable event sourcing for data consistency and replay capabilities

2. **Real-time Segmentation Engine**
   Leveraging ClickHouse's powerful querying capabilities, our segmentation engine allows for:

   - Dynamic user categorization based on properties and behaviors
   - Lightning-fast segment calculations, even at massive scale
   - Real-time updates triggered by incoming events

3. **Journey Orchestration**
   Powered by Temporal, this component:

   - Manages complex, long-running user journeys
   - Ensures reliable execution of workflows, even in the face of failures
   - Allows for pausing, resuming, and modifying journeys on the fly

4. **Entity Management**
   This part of the system handles all user-related data:
   - Stores and retrieves user profiles and properties
   - Emits events for entity changes
   - Provides a unified view of the user across the platform

#### Data Flow and Interactions

1. User actions (e.g., page views, purchases) generate events that are published to Kafka.
2. These events are consumed and stored in ClickHouse for large-scale data storage.
3. The Segmentation Engine queries ClickHouse to update user segments in real-time based on the latest events and entity data.
4. Changes in segmentation or specific events can trigger the Journey Orchestration.
5. Journeys, managed by Temporal, orchestrate a series of actions over time, which may include:
   - Querying ClickHouse for user data and event history
   - Checking current segmentation
   - Triggering external actions (e.g., sending emails, push notifications)
6. Each significant action or state change generates new events, feeding back into the system.

#### Data Storage

- **ClickHouse**: Stores large-scale entity and event data, enabling fast queries for segmentation and user insights
- **PostgreSQL**: Handles relational data like journey definitions and system configurations
- **Redis**: Provides fast key-value store for managing journey<>trigger mappings

#### Key Architectural Decisions

- **Event-Driven Design**: Enables scalability, flexibility, and real-time responsiveness
- **ClickHouse for Large-Scale Data**: Leverages ClickHouse's column-oriented structure for efficient storage and querying of high-volume entity and event data
- **Modular Component Design**: Allows for focused development and easier maintenance of different system aspects
- **Workflow as Code**: Temporal allows us to define complex journeys as code, simplifying management and versioning

## 🏠 Self-Hosting

We're working on comprehensive documentation/setup for self-hosting LimeJourney. In the meantime, you can get started with the following steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/limejourney/limejourney.git
   ```

2. Navigate to the project directory:

   ```bash
   cd limejourney
   ```

3. Copy the example environment file and update it with your configurations:

   ```bash
   cp .env.example .env
   ```

4. Use Docker Compose to spin up the services:
   ```bash
   docker-compose up -d
   ```

Stay tuned for more detailed self-hosting documentation! If you are considering self-hosting, please reach out to me at tobi@limejourney.com and we can help you get started.

## 🤝 Contributing

We welcome contributions from the community! Check out our [Contributing Guide](CONTRIBUTING.md) for more information on how to get started.

Whether you're fixing bugs, improving documentation, or proposing new features, your efforts are appreciated.

## 📄 License
