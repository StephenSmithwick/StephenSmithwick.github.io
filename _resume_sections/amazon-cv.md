---
class: company
---
{:.company-info}
- ![Amazon Logo](images/amazon.png)
- [Kindle Direct Publishing](https://kdp.amazon.com/) operates a subscription based marketplace to give readers unlimited access to books by participating authors \\
[AWS](https://aws.amazon.com/) is the leading cloud computing platform which provides S3 the ubiquitious storage service with high availability and durability (11 9's)

### Senior Software Development Engineer

{:.location-date}
- Seattle, USA
- May 2019 - March 2023

I led technical decisions and managed stakeholders.
*   Developed machine learning fraud detection pipeline for Kindle Direct Publishing, integrating real-time AI-driven anomaly detection
*   Designed data workflows and consistency monitoring for Amazon S3, ensuring large-scale data integrity for ML models
*   Led efforts in big data processing using AWS Kinesis, DynamoDB, and Elasticsearch
*   Developed the Kindle Author Portal with a ReactJS frontend and a ECS hosted Java Spring backend
*   Managed a fleet of over 100K S3 servers across all AWS regions
*   Improved Code coverage and reliability of CI pipeline

#### Kindle fraud and abuse
Built a machine learning (ML) pipeline which used reader behavior to detect fraud in near real-time.
*   Used Kinesis streams to collect batches of live reader behavior for analysis
*   Deployed models trained by ML scientists and hosted in SageMaker BYO ECR containers
*   Built tooling to allow ML scientists to train and deploy models that integrated on a near real-time basis

#### Consistency monitoring and repair
Amazon introduced strongly consistent writes which require significant changes to the underlying architecture.
*   Designed workflow, built software and wrote runbooks for new processes to handle alarming and repair of S3 entries
*   Updated the primary service to audit for consistency, alarming and allow the repair of discovered issues
*   Inconsistent entries can endanger S3's reliability promise of 11 9s of durability
*   Rare events happen often when you are operating at the scale of over a 100 trillion entries
