sequenceDiagram
Browser->>Server: POST: https://fullstack-exampleapp.herokuapp.com/new_note;
Server-->>Browser: Response - 302: Found

Browser->>Server: GET: /notes;
Server-->>Browser: HTML Document

Browser->>Server: GET: /main.css;
Server-->>Browser: The CSS File

Browser->>Server: GET: /main.js;
Server-->>Browser: The Javascript File
Note over Browser, Server: The browser starts executing the JS code that fetches JSON from the server

Browser->>Server: GET: /data.json;
Server-->>Browser: The JSON Data file
Note over Browser, Server: The browser executes the callback method to render the json
