package Lab;

import java.util.*;
import java.io.*;
import java.lang.*;

public class Transposition {
    public static void main(String args[]) {
        while (true) {
            Scanner scan = new Scanner(System.in);
            String Text;
            String key;

            System.out.print("1: Encryption\n");
            System.out.print("2: Decryption\n");
            System.out.print("3: Exit\n");
            System.out.print("Choose the number of above operations: ");
            int choice = scan.nextInt();

            if (choice == 3) {
                break;
            } else {
                switch (choice) {
                    case 1:
                        System.out.print("Enter String:");
                        Text = scan.next();
                        System.out.print("Enter Key:");
                        key = scan.next();
                        System.out.println("----OUTPUT----");
                        System.out.println("Cipher Text is: " + encrypt(key, Text).toUpperCase());
                        break;

                    case 2:
                        System.out.print("Enter Encrypted String:");
                        Text = scan.next();
                        System.out.print("Enter Key:");
                        key = scan.next();
                        System.out.println("----OUTPUT----");
                        System.out.println("Plain Text is: " + decrypt(key, Text).toUpperCase());
                        break;

                    default:
                        System.out.println("Invalid Choice!!");
                        break;
                }
            }
        }
    }

    public static String encrypt(String key, String text) {
        int[] arrange = arrangeKey(key);
        int lenkey = arrange.length;
        int lentext = text.length();
        int row = (int) Math.ceil((double) lentext / lenkey);
        char[][] grid = new char[row][lenkey];
        int z = 0;
        for (int x = 0; x < row; x++) {
            for (int y = 0; y < lenkey; y++) {
                if (lentext == z) {
                    z--;
                } else {
                    grid[x][y] = text.charAt(z);
                }
                z++;
            }
        }
        String enc = "";
        for (int x = 0; x < lenkey; x++) {
            for (int y = 0; y < lenkey; y++) {
                if (x == arrange[y]) {
                    for (int a = 0; a < row; a++) {
                        enc = enc + grid[a][y];
                    }
                }
            }
        }
        return enc;
    }
    public static String decrypt(String key, String text) {
        int[] arrange = arrangeKey(key);
        int lenkey = arrange.length;
        int lentext = text.length();
        int row = (int) Math.ceil((double) lentext / lenkey);
        String regex = "(?<=\\G.{" + row + "})";
        String[] get = text.split(regex);
        char[][] grid = new char[row][lenkey];
        for (int x = 0; x < lenkey; x++) {
            for (int y = 0; y < lenkey; y++) {
                if (arrange[x] == y) {
                    for (int z = 0; z < row; z++) {
                        grid[z][y] = get[arrange[y]].charAt(z);
                    }
                }
            }
        }
        String dec = "";
        for (int x = 0; x < row; x++) {
            for (int y = 0; y < lenkey; y++) {
                dec = dec + grid[x][y];
            }
        }
        return dec;
    }
    public static char RandomAlpha() {
        Random r = new Random();
        return (char) (r.nextInt(26) + 'a');
    }
    public static int[] arrangeKey(String key) {
        String[] keys = key.split("");
        Arrays.sort(keys);
        int[] num = new int[key.length()];
        for (int x = 0; x < keys.length; x++) {
            for (int y = 0; y < key.length(); y++) {
                if (keys[x].equals(key.charAt(y) + "")) {
                    num[y] = x;
                    break;
                }
            }
        }
        return num;
    }
}
