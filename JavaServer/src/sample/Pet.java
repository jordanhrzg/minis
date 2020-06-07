package sample;

import org.json.JSONObject;

class Pet {
    String name;
    private String type;
    private int age;

    Pet(JSONObject jsonObject) {
        try {
            name = jsonObject.getString("name");
            type = jsonObject.getString("type");
            age = jsonObject.getInt("age");
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    JSONObject toJson() {
        JSONObject result = new JSONObject();
        try {
            result.put("name", name);
            result.put("type", type);
            result.put("age", age);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return result;
    }
}
