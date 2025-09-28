Ticket #2847
Subject: Data export generating incomplete CSV files
User: Dr. Sarah Chen (Data Administrator)
Date: Monday, 09:15

Description:
The clinical trial data export is missing entries from the last two weeks. 
When I export trials with status "Active" for September 2024, the CSV only 
shows trials up to September 15th, but I can see trials from September 16-30 
in the web interface.

This is urgent as I need to submit regulatory reports by Wednesday.

Steps to reproduce:
1. Go to Clinical Trials > Export Data
2. Filter: Status = "Active", Date range = Sep 1-30, 2024
3. Click "Export to CSV"
4. Recent entries missing from file


Ticket #2789
Subject: Feature Request - Bulk operations for regulatory status updates
User: Anna Kowalski (Regulatory Affairs Manager)
Date: Monday, 14:20

Description:
Could we add a bulk update feature for changing regulatory status? 

Currently, when a country updates their approval process, I have to manually 
update hundreds of drug entries one by one from "Under Review" to "Approved" 
or "Rejected". This takes 4-5 hours per country update.

Not urgent, but would save significant time. We get these mass updates from 
regulatory authorities about once a month.


Ticket #2848
Subject: Cannot update drug pricing for Switzerland
User: Marcus Weber (Pricing Analyst)
Date: Monday, 10:30

Description:
Getting error "Invalid currency transition" when trying to update drug prices 
for Swiss market. Error occurs when changing from CHF 150.00 to CHF 165.50.

The validation seems to think this is an invalid price change, but it's a 
normal 10% increase that should be allowed according to our business rules.

This worked fine last month for similar price updates.




