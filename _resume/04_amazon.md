---
header: Work Experience
class: company
---
{:.company-info}
- [![AWS Logo](images/aws.png) Amazon AWS](https://aws.amazon.com/) 
- [![Kindle Logo](images/kindle.svg) Amazon Kindle](https://kdp.amazon.com/)

### Senior Software Development Engineer

{:.location-date}
- Seattle, USA
- May 2019 - Present

This role includes leading technical decisions and managing stakeholders.

#### Consistency monitoring and repair
Amazon recently introduced strongly consistent writes requiring significant changes to the underlying architecture.
*   Designed workflow, built software and wrote runbooks for new processes to handle alarming and repair of S3 entries
*   Updated the primary service to audit for consistency, alarming and allow the repair of discovered issues
*   Inconsistent entries can endanger S3's reliability promise of 11 9s of durability
*   Extremely rare events happen regularly when you are operating at the scale of 100 trillion entries

#### Kindle Author Portal
Transformed the Author Portal from a legacy bespoke service into a React frontend and AWS lambda and ECS backend which allowed the development of reports to be more agile.
*   Used ReactJS frontend to render results from lambda requests
*   For long running requests, used ECS containers running Spring based backend

#### Kindle fraud and abuse
Built a machine learning (ML) pipeline which used reader behavior to detect fraud in near real-time.
*   Used Kinesis streams to aggregate live reader behavior
*   Deployed models trained by ML scientists and hosted in SageMaker BYO ECR containers
*   Built tooling to allow ML scientists to train and deploy models that integrated on a near real-time basis

#### Operational excellence
Managed a huge fleet of servers across AWS regions across the world.
*   Responded to and investigated new issues as part of on-call roster
*   Built and updated runbooks
*   Improved Code coverage and reliability of CI pipeline