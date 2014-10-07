Proximity-server
================
Server-side (API) of Proximity app.

Currently uses an in-memory test database to pre-populate some users.
For simplicity, the "near" metric is "within 0.015° lat/long.

ToDo
----
- Proper database
- Better "near" metric (circular, distance-based instead of degree-based)
- Allow for user deletion
- Authentication/security
