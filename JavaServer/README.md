# Java S(i/a)mple Server

## Description
A simple java server that manages a local JSON file with pets.

### Execute Server
A simple build.xml file is provided to execute ant commands to clean and build the project.

From the project directory (JavaServer/):
- `ant clean` (clean the project)
- `ant build` (build the project)
- `java -cp classes/;lib/* sample.PetServer` (run the server)

The server will output: `Server listening on port: 8080`

### Execute Client Requests
There is no client available to use with this application. Valid client requests can be made with curl commands.

- Test GET all pets:
  - `curl 127.0.0.1/pets`
- Test GET a specific pet:
  - `curl 127.0.0.1/pets/L.B.`
- Test POST a new pet:
  - `curl -X POST 127.0.0.1:8080/pets -d "{"name":"Sparkles", "type":"unicorn", age: 1001}"`
- TEST DELETE a pet:
  - `curl -X DELETE 127.0.0.1:8080/pets/L.B`
  
The server returns a small basic packet of info: status, message, data depending on the request.

## Future Work

- Build a simple client
- Add testing & refine error cases
