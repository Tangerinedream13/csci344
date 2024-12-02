public class StringReversal {

    public static String reverse(String str) {
        // Base case: if the string is empty or has only one character
        if (str.length() <= 1) {
            return str;
        } else {
            // Recursive case: reverse the rest of the string and add the first character at the end
            return reverse(str.substring(1)) + str.substring(0, 1);
        }
    }

    public static void main(String[] args) {
        String result = reverse("hello");
        System.out.println("Reversed string: " + result);
    }
}
