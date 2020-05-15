import java.util.ArrayList;

public class JavaPractice {

//    public static void main(String[] args){
//        System.out.println("Hello :)");
//
//        String[] unsortedArr = {"abcdef0123", "0123456789", "abcdefghij"};
//        boolean result = tempEval(unsortedArr);
//        System.out.println("RESULT: "+ result);
//    }


    public static boolean tempEval(String[] strArr){
        boolean result = true;

        for(int i = 0; i < strArr.length - 1; i++){
            ArrayList<String> currentChunked = chunkify(strArr[i]);
            ArrayList<String> nextChunked = chunkify(strArr[i+1]);

            int maxSize = (currentChunked.size() <= nextChunked.size()) ?
                    currentChunked.size() : nextChunked.size();

            for(int j = 0; j < maxSize; j++){
                result = compare(currentChunked.get(j), nextChunked.get(j));
//                System.out.println(String.format("Comparison: %s vs. %s = %b", currentChunked.get(j), nextChunked.get(j), result));
                if(!result) break;
            }
            if(!result) break;
        }
        return result;
    }

    public static ArrayList<String>  chunkify(String s){
        ArrayList<String> result = new ArrayList<>();

        char[] sArr = s.toCharArray();

        StringBuilder chunk = new StringBuilder();

        for(char c : sArr){
            if(chunk.length() == 0 || (isNumber(chunk.charAt(0)) == isNumber(c))){
                chunk.append(c);
            } else{
                result.add(chunk.toString());
                chunk.delete(0, chunk.length());
                chunk.append(c);
            }
        }
        //flush
        if(chunk.length() > 0) result.add(chunk.toString());

        return result;
    }

    public static boolean isNumber(char target){
        return Character.isDigit(target);
    }

    public static boolean compare(String a, String b){
        boolean result = true;
        Integer intA = null, intB = null;
        if(Character.isDigit(a.charAt(0))){ intA = Integer.parseInt(a);}
        if(Character.isDigit(b.charAt(0))){ intB = Integer.parseInt(b);}

        if(intA == null){
            if(intB == null) {
                result = (a.compareTo(b) <= 0);
            }
        } else {
            if(intB == null){
                result = false;
            } else {
                result = intA <= intB;
            }
        }

        return result;
    }
}