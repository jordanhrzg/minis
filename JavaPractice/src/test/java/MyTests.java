import org.junit.Assert;
import org.junit.Test;

import java.util.ArrayList;
import java.util.Arrays;

public class MyTests {
    @Test
    public void stringComparison(){
        Assert.assertTrue("ab before abc", JavaPractice.compare("ab", "abc"));
        Assert.assertTrue("abc before ac", JavaPractice.compare("abc", "ac"));
        Assert.assertTrue("12 before 123", JavaPractice.compare("12", "123"));
        Assert.assertTrue("abc before 123", JavaPractice.compare("abc", "123"));
        Assert.assertFalse("123 before abc", JavaPractice.compare("123", "abc"));
    }

    @Test
    public void chunkTest(){
        String testString = "abc-0t54ty-99-are";
        ArrayList<String> result = JavaPractice.chunkify(testString);

        ArrayList<String> expected = new ArrayList<>(
                Arrays.asList("abc-", "0", "t", "54", "ty-", "99", "-are"));

        Assert.assertArrayEquals(result.toArray(), expected.toArray());

    }

    @Test
    public void numberTest(){
        Assert.assertTrue("is a number", JavaPractice.isNumber('0'));
        Assert.assertTrue("is a number", JavaPractice.isNumber('4'));
        Assert.assertTrue("is a number", JavaPractice.isNumber('9'));
        Assert.assertFalse("NaN", JavaPractice.isNumber('a'));
        Assert.assertFalse("NaN", JavaPractice.isNumber('d'));
        Assert.assertFalse("NaN", JavaPractice.isNumber('x'));
        Assert.assertFalse("NaN", JavaPractice.isNumber('-'));
    }

    @Test
    public void arrayEvaluation(){
        String[] sortedArr = {"abcdef0123", "abcdefghij", "0123456789"};
        String[] sortedArr2 = {"abcdef0123", "abcdefg123", "0123456789"};
        String[] unsortedArr = {"abcdef0123", "0123456789", "abcdefghij"};

        Assert.assertTrue("sorted", JavaPractice.tempEval(sortedArr));
        Assert.assertTrue("sorted", JavaPractice.tempEval(sortedArr2));
        Assert.assertFalse("unsorted", JavaPractice.tempEval(unsortedArr));
    }

}
