package sample;

import org.json.JSONObject;
import org.json.JSONTokener;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.Enumeration;
import java.util.Hashtable;
import java.util.Iterator;

class PetStore {

    private Hashtable<String, Pet> store;
    private final static String file = "pets.json";

    PetStore() {
        this.store = new Hashtable<>();
        try {
            this.initStoreFromFile();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    private boolean saveStoreToFile() {
        boolean result = true;
        try {
            JSONObject jsonObject = this.toJson();
            /**
            JSONObject jsonObject = new JSONObject();
            for (Enumeration<String> e = store.keys(); e.hasMoreElements(); ) {
                sample.Pet newPet = store.get(e.nextElement());
                jsonObject.put(newPet.name, newPet.toJson());
            }
            */
            PrintWriter out = new PrintWriter(file);
            out.println(jsonObject.toString(4));
            out.close();
        } catch (Exception ex) {
            result = false;
            ex.printStackTrace();
        }
        return result;
    }

    private void initStoreFromFile() {
        try {
            this.store = new Hashtable<>();
            InputStream is = this.getClass().getClassLoader().getResourceAsStream(file);
            if (is == null) {
                is = new FileInputStream(new File(file));
            }

            JSONObject petFile = new JSONObject(new JSONTokener(is));
            Iterator<String> it = petFile.keys();
            while (it.hasNext()) {
                String name = it.next();
                JSONObject aPet = petFile.optJSONObject(name);
                if (aPet != null) {
                    Pet pet = new Pet(aPet);
                    store.put(name, pet);
                }
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    Pet get(String petName) {
        Pet result = null;
        try {
            result = store.get(petName);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return result;
    }

    boolean add(Pet newPet) {
        boolean result = false;
        try {
            store.put(newPet.name, newPet);
            result = true;

            //auto-save
            result = saveStoreToFile();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return result;
    }

    boolean delete(String name){
        boolean result = false;
        try{
            store.remove(name);
            result = true;
            //auto-save
            result = saveStoreToFile();
        } catch (Exception ex){
            ex.printStackTrace();
        }
        return result;
    }

    JSONObject toJson(){
        JSONObject storeObject = new JSONObject();
        for (Enumeration<String> e = store.keys(); e.hasMoreElements(); ) {
            Pet newPet = store.get(e.nextElement());
            storeObject.put(newPet.name, newPet.toJson());
        }

        return storeObject;
    }
}
