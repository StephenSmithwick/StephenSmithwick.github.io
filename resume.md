---
layout: resume
title: "Stephen Smithwick"
date: 2022-09-19 20:33:58
categories: resume
---

Profile
-------

I am a Senior Software Developer at Amazon AWS with significant experience in cloud computing and machine learning. Prior to this, I was Principal Software Engineer at Qantas Airlines, working on customer solutions such as notifications and insights. I am passionate about my work which mostly involves exploring, innovating and implementing key decisions around our solutions. I believe in the importance of agile development which builds team excellence through the practice of continuous improvement. I also love to code and learn new technologies: from Android Apps for my sons in Kotlin to Scala courses and meetups, I happily geek out with my team and colleagues.

Key Skills
----------

{:.two-columns}
*   Product direction and strategy
*   Change management
*   Stakeholder/Product Owner management
*   Hiring, managing and mentoring developers
*   Business and technology strategy
*   Data driven goals and metrics (KPIs)
*   DevOps
*   TDD/BDD
*   Product security
*   Continuous improvement
*   Big data
*   Agile at scale
*   Prioritization frameworks
*   Story definition
*   SCRUM and Kanban
*   CI/CD

Tools and Techologies
---------------------

Java/JVM

: {:.inline}
*   Java
*   Kotlin
*   Hibernate
*   Spring
*   Dagger2


Web

: {:.inline}
*   Javascript
*   React
*   Redux
*   Bootstrap
*   Sass

Ruby

: {:.inline}
*   Ruby
*   Ruby on Rails
*   Sinatra
*   Capistrano

Operational

: {:.inline}
*   AWS
*   Ansible
*   Bamboo
*   Docker
*   Splunk
*   CloudWatch
*   CDK/CloudFormation

Agile

: {:.inline}
*   Confluence
*   Jira
*   Trello
*   Kanban
*   Scrum

Testing

: {:.inline}
*   Cucumber
*   Rspec
*   Selenium
*   jUnit
*   Hamcrest Assertions

Data

: {:.inline}
*   S3
*   SNS
*   SQS
*   Kinesis
*   DynamoDB
*   Elastic Search
*   Oracle
*   PostgreSQL

Other

: {:.inline}
*   Git
*   Python
*   SageMaker

Work Experience
---------------

{:.company-info}
- [![AWS Logo](images/aws.png) Amazon AWS](https://aws.amazon.com/) 
- [![Kindle Logo](images/kindle.svg) Amazon Kindle](https://kdp.amazon.com/)

### Senior Software Development Engineer

{:.location-date}
- Seattle, USA
- May 2019 - Present

This role is responsible for leading technical decisions and managing stakeholders.

{:.section-header}
#### Hilights
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

{:.company-info}
- ![Qantas Logo](images/qantas.png) 
- [http://www.qantas.com](http://www.qantas.com) \\
 Qantas is Australia's leading domestic and international airline.

### Principal Software Engineer

{:.location-date}
- Sydney, Australia 
- March 2017 - May 2019

Led technical decisions and managed stakeholders and teams within the Integration Domain.

{:.section-header}
#### Hilights
#### Deeply involved in Qantas Transformation Project
Qantas was going through a technical, cultural and operational transformation of IT.
*   Advised on potential structures to support IT implementation
*   Helped to create the playbook to guide teams in the new ways of working
*   Led the adoption of the new ways of working in the Integration Domain
*   Consulted with other teams as a Change Champion

#### Led continuous improvement processes across four teams
Focused on improving development practices and reducing the time taken to release.
*   Established and / or guided developer guilds and chapters:
    *   Estabilshed and Led Security Guild
    *   Guided Front End Chapter
    *   Led Java Guild
*   Encouraged regular low fanfare releases with increased automation
*   Decreased external dependencies
*   Evaluated new technologies using data and metrics
*   Coached developers in TDD/BDD practices

#### Established Notification Team
The Notifications Platform delivered messages to subscribed customers and employees on flight and passenger events via many channels including sms, email, in app messaging, and facebook messenger. The team operated in a highly collaborative Kanban fashion with a strict work in progress limit, regular releases, and automation of almost all processes. It was an agile, autonomous, product focused team which managed all aspects of the product lifecycle including design, operations, support, and development
    

#### Led Customer Response Engine Team
The Customer Response Engine ingested very large amounts of data and provided insights around customers for Qantas services via APIs and event streams using flight, booking and customer data feeds. Introduced more customer friendly event consumption models and agile ways of working inspired by the spotify framework
    

#### Established Security Guild
Communication between Qantas security teams and developers was ad-hoc and reactive. Set up a Security Guild to improve communication between security teams and developers. Forums resulted in improved knowledge sharing between teams
    
{:.company-info}
- ![RateCity Logo](images/ratecity.png) 
- [http://www.ratecity.com.au](http://www.ratecity.com.au) \\
RateCity is Australia's leading financial comparison website where users compare credit cards, loans, and investment products.

### Technical Director

{:.location-date}
- Sydney, Australia 
- January 2015 - March 2016

Led the technical decisions made by the company and managed a team of developers.

{:.section-header}
#### Hilights
*   Replaced ad-hoc development processes where developers would work on projects based on immediate business demands with an agile scrum approach
*   Achieved business buy-in to the new development process
*   Took a legacy code base with performance issues and a large amount of technology debt and migrated it to a high performance modular system using a measured and risk based approach
*   Introduced infrastructure, design and useability enhancements
*   Led the redevelopment of the credit card site from the ground up with a focus on the user experience
*   Established a new data warehouse to gather disparate user data, enabling linkage between information and increased behavioral tracking using Google Analytics
*   Transitioned the website from hosted web server provider onto AWS to increase flexibility and responsiveness
*   Set up and managed a remote team

{:.company-info}
- ![DiUS Logo](images/dius.png) 
- [http://www.dius.com.au](http://www.dius.com.au) \\
DiUS is an Agile consulting business which focuses on delivering products for its customers in a collaborative, iterative and build-measure-learn way.

### Senior Software Engineer

{:.location-date}
- Sydney, Australia 
- May 2011 - December 2015

Led development and acted as project manager consulting with local and remote teams. Worked extensively on ResMed's ECO application. This was a medical patient management and reporting system that allowed ResMed to monitor patients and their use of therapy devices. Developed a framework, tests and processes to help ensure that all regulatory requirements were monitored and met. Used extensive cucumber tests as a basis for meeting FDA regulation requirements.

{:.company-info}
- ![Fox Sports Logo](images/foxsports.png) 
- [http://www.foxsports.com.au](http://www.foxsports.com.au) \\
Foxsports is owned by Premier Media Group who also produces Fuel TV and How To.

### Software Development Engineer

{:.location-date}
- Sydney, Australia 
- March 2008 - May 2011

Led the development of a Java web application to support the booking of satellites and equipment for recording content using AWS.

{:.company-info}
- ![BioWisdom Logo](images/biowisdom.png) 
- [http://www.biowisdom.com](http://www.biowisdom.com) \\
BioWisdom builds ontologies around biomedical research in the form of graphs of assertion branching from concepts.

### Software Engineer

{:.location-date}
- Cambridge, UK 
- May 2005 - July 2007

Built a graphical ontology querying tool and developed middle-tier business logic components.

{:.company-info}
- ![University of Colorado Logo](images/cu.png)

### Research and Development Assistant, Life Long Learning and Design

{:.location-date}
- Colorado, USA 
- August 2003 - September 2004

Worked as a research assistant under Yunwen Ye on the CodeBroker development tool. CodeBroker aides developers by searching for helpful APIs in the background based on the current program context providing an always relevent list of useful APIs.

Education
---------

### BSc, Computer Science

{:.location-date}
- University of Colorado, Boulder 
- October 2000 - July 2004

Other
-----

### Founding Member and Organizer of Random Hacks of Kindness

{:.company-info}
- ![Random Hacks of Kindness Logo](images/rhok.png) 
- [http://www.rhokaustralia.org](http://www.rhokaustralia.org) \\
RHoK is a rapidly growing global initiative making the world a better place by developing practical, open source technology solutions to respond to some of the most complex challenges facing humanity.

{:.location-date}
- Sydney, Australia 
- 2011 - 2016

Established the Sydney chapter and ran several hackathons. Worked with charities to define their problems and guided volunteers to ensure that projects were effectively deployed. An example project, FirstStop, was developed in conjunction with the Blue Mountains Bush Fire Crisis team and Sydney University to allow users affected by disaster to share their personal data with aid agencies using a QR code (June 2014).