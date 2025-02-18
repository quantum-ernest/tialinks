🌟 TiaLinks
===========

**Simplify your URLs, maximize your insights.**

TiaLinks is an open-source URL shortening and analytics tool that simplifies URL management while delivering valuable insights. Designed for developers and businesses, it helps you shorten links, track engagement, and analyze performance all in one place.



   .. image:: https://img.shields.io/badge/License-GPLv3-blue.svg
      :target: https://github.com/quantum-ernest/tialinks/blob/main/LICENSE
   .. image:: https://img.shields.io/github/v/release/quantum-ernest/tialinks?color=%235351FB&label=version
      :target: https://github.com/quantum-ernest/tialinks/releases
   .. image:: https://img.shields.io/github/issues/quantum-ernest/tialinks
      :target: https://github.com/quantum-ernest/tialinks/issues


✨ Current Features
-------------------

- 🔗 **Shorten URLs**: Convert long, unwieldy URLs into compact, shareable links.
- 📊 **Analytics**: Track click details like location, referrer, and device type.
- 📈 **Performance Metrics**: Gain insights into link performance over time with detailed reports.
- 🔍 **UTM Management**: Manage UTM parameters like source, campaign, and medium for tracking your links effectively.
- 🔍 **QR Code Generation**: Generate QR codes for individual links to make sharing even easier.
- ⏳ **Link Expiry**: Set expiry dates for links to maintain control over their validity.
- 🌎 **Geographical Insights**: Gather geographical data like continent, country, city, and region for each click while ensuring user privacy by not saving IPs or coordinates.
- 🌍 **Interactive Map**: Visualize geographical data on an interactive map for better insights.
- ✉️ **Email OTP Authentication**: Secure user access with an OTP-based authentication mechanism. OTPs are valid for 5 minutes to ensure enhanced security.
- 🔒 **Password Protection**: Protect your shortened links with a password for additional security.

📜️ Pending Features
--------------------
- Support for custom domains for personalized, branded links.
- AI for predictions.
- Dynamic redirects.
- Password protection supported ✅
- Bulk CSV Import URLs
- Browser estentions

💡 Technical Specifications
---------------------

- 🔄 **Backend**: Built with FastAPI for high-performance API development.

- ⚡ **Database**: Uses Timescale (PostgreSQL++) for fast and scalable data storage.

- 🤑 **Cache**: Leverages Redis for efficient caching and quick data retrieval.

- 🔄 **Frontend**: Developed with React and Antd for a dynamic and responsive user interface.

- ⚖️ **Scalability**: Designed to support horizontal scaling and cloud deployment.

- ✨ **Customizability**: Fully open-source and extendable to fit specific needs.

- 🔒 **Privacy**: Ensures data privacy by anonymizing IPs and not storing precise user coordinates.

- 🕒 **Request Processing Time**: Middleware tracks the time taken to process each request for performance monitoring.

- 🖋️ **Custom Logging**: Logs include processing time and are stored in files for detailed analysis and debugging.

- 🚀 **Deployment**: Compatible with Docker for seamless containerization and CI/CD pipelines.


🚀 Installation
----------------

Getting started is easy!

1. Clone the repository:

   .. code-block:: bash

      git clone https://github.com/quantum-ernest/tialinks.git

2. Start up with docker:

   .. code-block:: bash

      cd tialinks
      docker-compose up -d



🤝 Contributing
----------------

I 💖 contributions! Here’s how you can help improve TiaLinks:

1. Fork the repository.
2. Create a feature branch:

   .. code-block:: bash

      git checkout -b my-new-feature

3. Make your changes and commit them:

   .. code-block:: bash

      git commit -m "Add some feature"

4. Push your changes and open a pull request to the ``main`` branch.



🧑‍💻 Support
-------------

Need help? Have questions or ideas? Open an issue on our `GitHub repository <https://github.com/quantum-ernest/tialinks/issues>`_.

---

Let me know if you'd like further tweaks or additional features! 🎉
