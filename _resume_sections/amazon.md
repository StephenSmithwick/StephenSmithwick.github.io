---
class: company
---
{:.company-info}
- ![Amazon Logo](images/amazon.png)
- Seattle, USA \\
May 2019 - March 2023

### Amazon - Senior Software Development Engineer

#### AWS S3 Index Team
* *Engineered replica consistency and repair workflows for  S3 Index* (RAD service), maintaining 11-nines of availability for trillions of objects across global regions.
* *Resolved a critical midnight durability event* by diagnosing a parallel-write race condition; reconstructed write-ordering using legacy event logs to safely repair diverging replicas.
* *Led efforts to reduce regional repair latency by 40%* in high-traffic regions (IAD), shrinking the window for latent inconsistencies from 5 hours to under 3 hours.
* *Designed deep-consistency monitoring to validate S3 consistency*, enabling the confident rollout of performance-enhancing features for individual replica reads.

#### Kindle Fraud & Abuse Team
* *Architected a high-throughput ML fraud detection pipeline* by integrating custom Python inference logic with SageMaker and Kinesis Data Streams; successfully processed tens of millions of daily events in near-real-time.
* Built a CI/CD and automated workflow to ensure model correctness and strict latency SLAs were met before influencing author royalty calculations.
* *Served as Technical Lead for the Author Portal migration*, moving from a legacy Java middle-tier to a modern Spring Boot and Elasticsearch architecture to improve search performance and scalability.
