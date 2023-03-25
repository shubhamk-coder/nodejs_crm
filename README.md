# nodejs_crm
# Problem Statement

Designing a backend for a customer relationship management(CRM) system. Following is the
business logic of the application that you have to keep in mind.
You only need to code the REST API.
1. The CRM account is associated with each employee/counselor of the company with their
email id.
2. There is an enquiry form which is provided to every prospective client to fill their basic details
i.e. Name, Email, Course interest etc. This form can be circulated online to capture leads or can
be shared by the counselor itself after it has connected with the student via call.
3. Inside the CRM, each employee/counselor can see all the enquiries that prospective clients
have filled. We can say these are Public Enquiries that are visible to all the
employees/counselors.
4. Against each public enquiry, the employee/counselor has a choice to “Claim” it. Claiming it will
assign the enquiry to only this counselor inside the CRM & this enquiry will no longer be publically
visible to any other employee. We can say that this is now a private enquiry.
The backend must be designed in NodeJs. You are free to use any library to design the above
system.

Requirements 

● Database must be postgres/Mysql/Mongodb

● You are only required to design the REST API for above mentioned tasks

● You need to use Express Framework.

● You neeed to use JWT token

Acceptance Criteria

● API for Employee login/register.

● Public form API must be accessible without any authentication.

● API to claim leads.

● API to fetch unclaimed leads.

● API to fetch leads claimed by logged in users.

The backend must be code in Nodejs. You are free to use any library to design the above
