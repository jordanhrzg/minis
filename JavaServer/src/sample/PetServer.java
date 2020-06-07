package sample;

import java.io.InputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.ServerSocket;
import java.net.Socket;

public class PetServer extends Thread {
    private Socket conn;
    private int id;
    private PetAPI api;

    private PetServer(Socket sock, int id, PetStore store) {
        this.conn = sock;
        this.id = id;
        this.api = new PetAPI(store);
    }

    public void run() {
        try {
            OutputStream outSock = conn.getOutputStream();
            InputStream inSock = conn.getInputStream();
            byte[] clientInput = new byte[1024];
            int inputBytes = inSock.read(clientInput, 0, 1024);
            if (inputBytes != -1) {
                String request = new String(clientInput, 0, inputBytes);
                System.out.println("\nClient " + id + " Request:\n" + request);
                //use sample.Pet API to get response for client request
                String response = api.callMethod(request);
                byte[] clientOut = response.getBytes();
                outSock.write(clientOut, 0, clientOut.length);
                System.out.println("Server Response: " + response);
            }

            inSock.close();
            outSock.close();
            conn.close();

        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }

    public static void main(String[] args) {
        Socket sock;
        PetStore store = new PetStore();
        int id = 0;

        try {
            int port = 8080;
            //port may be passed as command line parameter on server start
//            if (args.length > 0) {
//                port = Integer.parseInt(args[0]);
//            }

            ServerSocket server = new ServerSocket(port);
            while (true) {
                System.out.println("Server listening on port: " + port);
                sock = server.accept();
                System.out.println("Server connected to client: " + id);
                PetServer myServerThread = new PetServer(sock, id++, store);
                myServerThread.start();
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }
}

