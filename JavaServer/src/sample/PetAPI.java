package sample;

import org.json.JSONObject;

class PetAPI {
    private PetStore store;

    PetAPI(PetStore store) {
        this.store = store;
    }

    String callMethod(String request) {
        JSONObject response = new JSONObject();
        int status = 200;
        String message = "";
        JSONObject data = new JSONObject();

        try {
            //parse request text data into simple JSON object
            JSONObject requestObject = parseRequest(request);
            String requestMethod = requestObject.getString("method");
            String requestPath = requestObject.getString("path");
            JSONObject requestData = requestObject.getJSONObject("data");

            //route request by method
            if (requestMethod.equals("GET")) {
                message += "getting ";

                //two supported methods (all, specific)
                if (requestPath.equals("/pets")) {
                    //return all
                    message += "all pets ...";
                    data = store.toJson();
                } else {
                    //return specific pet
                    String targetName = requestPath.split("/")[2];
                    message += ("pet named " + targetName + " ...");
                    Pet test = store.get(targetName);

                    if (test == null) {
                        status = 404;
                        message = "Could not find pet named: " + targetName;
                    } else {
                        data = test.toJson();
                    }
                }
            } else if (requestMethod.equals("POST")) {
                //do post
                message += "posting ";
                Pet newPet = new Pet(requestData);
                if (newPet.name == null) {
                    message = "Error adding new pet ...";
                    message += "Please check the parameter data and try again";
                    status = 400;
                } else {
                    message += "new pet named: " + newPet.name + " ...";
                    boolean success = store.add(newPet);
                    if (!success) {
                        message = "There was an error adding new pet named: " + newPet.name;
                        status = 500;
                    }
                }
            } else if (requestMethod.equals("DELETE")) {
                message += "deleting ";

                if (requestPath.split("/").length < 2) {
                    message = "Error deleting new pet ...";
                    message += "Please check the parameter data and try again";
                    status = 400;
                } else {
                    //delete specific pet
                    String targetName = requestPath.split("/")[2];
                    message += ("pet named " + targetName + " ...");
                    boolean success = store.delete(targetName);
                    if (!success) {
                        message = "There was an error deleting pet named: " + targetName;
                        status = 500;
                    }
                }
            } else {
                status = 405;
                message = "Method not supported ... ";
            }

            response.put("status", status);
            response.put("message", message);
            response.put("data", data);

        } catch (Exception ex) {
            ex.printStackTrace();
        }

        return response.toString(4);
    }


    private JSONObject parseRequest(String request) {
        JSONObject result = new JSONObject();

        //get relevant data chunks from raw request text (method, path, data)
        String[] firstLine = request.split("\n")[0].split(" ");
        JSONObject jsonInput = new JSONObject();
        int dataIndex = request.indexOf("{");
        if (dataIndex != -1) {
            jsonInput = new JSONObject(request.substring(dataIndex));
        }

        result.put("method", firstLine[0]);
        result.put("path", firstLine[1]);
        result.put("data", jsonInput);

//        System.out.println("returning request JSON ...");
//        System.out.println(result.toString(4));

        return result;
    }
}
