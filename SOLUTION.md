# Solution Document

## Part 1: Bug Investigation & Fixes
- Issues Identified: 
1. Cache Key not specific enough
2. Sequential execution of blocking function and unnecessary timeout
3. Infective order of validation and cleaning of input

- Solutions Implemented: 
1. The validation cache used only `regulatoryId` as the key. This would cause problems by skipping validation if the cache was searched for the same `regulatoryId` even if it's not paired up with the same `country`. Proposed fix combines both `country` and `regulatoryId` into an unique key. This ensures that the cache hit will occur only if this pair was already processed before.

2. When processing multiple products, `processSubmission` function was called in a for loop. When taking performance into consideration, this was problematic because this function was blocking in form of a timeout(Simulating a slow operation such as DB fetch). This can be improved using parallelization. The file already contains a parallel processing function, so I reused it. Also checked to make sure concurrency wouldn't be problematic. Each product is standalone and doesn't impact other product submission. There was also a timeout for all but last processed item. I don't think it serves any purpose, even as a mock, so it was also removed.

3. Cleaning process was not working as expected. The reason for this was that cleaned `regulatoryId` was not used in further validation. This caused 'cleanable' inputs to be discarded as invalid. Fixed the issue by first cleaning, then passing the clean `regulatoryId` to the validator. Note: The test cases also test a product with null as `regulatoryId` this was already handled correctly by the validator, so no changes were made.

## Part 2: Support Ticket Analysis
1.Ticket #2847(Export issue)
- Ticket Prioritization: The most urgent one out of these 3. Client depends on this fixed urgently and seems like a small issue.
- Root Cause Analysis: Repeat the provided reproduction steps. Compare exported CSV and web ui. Check if the same issue occurs for other months. Try to identify why only half a month is visible in CSV and why it only happens for the most current month. Check the data source. Check the code responsible for exporting. Check how FROM and TO dates are calculated. Check if there is any weird pagination or limits in place. 
- Proposed Solutions: Looks like an edge case with the most current month. 
- Implementation Estimates: Investigation sounds like longest time sink in this case. Total estimation is 4-6h Dev work. QA time very short, 1h max.

2.Ticket #2789(Bulk operations feature request)
- Ticket Prioritization: Least priority out of the tickets here.  Nice quality of life feature.
- Root Cause Analysis: /
- Proposed Solutions: Define if there are any special cases in case of batch updates compared to singular ones. Implement an additional endpoint for bulk updates. Will probably need to make some changes/add new procedures for the DB. Add an intuitive UI option to select multiple drugs and assign the same status to all of them at once. This could be something like a multiselect list into a Update Status button that lets the user select which status applies to all of the selected ones.
- Implementation Estimates: Two days of dev work. A 1-2 hours for QA with ready test cases.

3.Ticket #2848(CHF price update failing)
- Ticket Prioritization: Another priority issue that prevents daily work. Still, goes behind the first ticket.
- Root Cause Analysis: Play around with the inputs to check other currencies or other values to isolate the issue. If issue is specific, I'd check if there are any rules of min amount changed etc. Check where Swiss calculation logic is different to the rest for cause candidates.
- Proposed Solutions: Pretty much summed up above.
- Implementation Estimates: About a day with investigation and the fix. Depending on the scope of the actual issue, QA might need a bit more time to do regression check.

## Overall Assessment
The issues seem quick to fix, and are higher priority compared to more robust feature request.
To prevent these bugs, unit tests would go a long way covering the edge cases, which seem to be the causes.