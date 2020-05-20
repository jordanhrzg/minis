#01234567890123456789012345678901234567890123456789012345678901234567890123456789
# sequence
# selection
# iteration

# ===============================================================================
# reverse a string
string_to_reverse = "!em esrever"

# uncomment line below to test
# print(string_to_reverse[::-1])

# ===============================================================================
# pig latin
def word_to_pig_latin(word):
    suffix = "ay"
    return (word[1::] + word[0] + suffix)

def sentence_to_pig_latin(sentence):
    result = []
    for word in sentence.split():
        result.append(word_to_pig_latin(word))
    return " ".join(result)

# uncomment line below to test function above
# print (sentence_to_pig_latin("Translate this sentence to pig latin"))

# ===============================================================================
# counting characters in a sentence
def character_count(sentence):
    result = {}
    for word in sentence.split():
        for char in word:
            if char in result:
                result[char] += 1
            else:
                result[char] = 1
    # spaces are not counted, add
    result[" "] = len(sentence.split()) - 1
    return result

# uncomment line below to test function above
# print (character_count("hey hello hi"))

# ===============================================================================
# scrabble score
# ref: https://scrabble.hasbro.com/en-us/faq
scoring_dictionary = {
    "A": 1, "B": 3, "C": 3, "D": 2, "E": 1, "F": 4, "G": 2, "H": 4, "I": 1,
    "J": 8, "K": 5, "L": 1, "M": 3, "N": 1, "O": 1, "P": 3, "Q": 10, "R": 1,
    "S": 1, "T": 1, "U": 1, "V": 4, "W": 4, "X": 8, "Y": 4, "Z": 10, "-": 0
}

def scrabble_score_calculator(word):
    result = 0
    for char in word:
        result += scoring_dictionary[char.upper()]
    return result

# uncomment line below to test function above
# print (scrabble_score_calculator("count"))

# ===============================================================================
# convert number to word
less_than_20 = {
    1: "one", 2: "two", 3: "three", 4: "four", 5: "five", 6: "six", 7: "seven",
    8: "eight", 9: "nine", 10: "ten", 11: "eleven", 12: "twelve", 13: "thirteen",
    14: "fourteen", 15: "fifteen", 16: "sixteen", 17: "seventeen",
    18: "eighteen", 19: "nineteen"
}

tens = {
    20: "twenty", 30: "thirty", 40: "forty", 50: "fifty", 60: "sixty",
    70: "seventy", 80: "eighty", 90: "ninety"
}

def translate_number(number):
    result = ""
    # TODO: something about 0
    if(number == 0):
        result += "zero"
    elif(number < 0):
        result += "negative "
        result += translate_number(-1 * number)
    else:
        thousands, r_thousands = divmod(number, 1000)
        hundreds, r_hundreds = divmod(number, 100)

        if(thousands > 0):
            result += translate_number(thousands) + "-thousand"
            if(r_thousands > 0):
                result += ", "
                result += translate_number(r_thousands)
        elif(hundreds > 0):
            result += less_than_20[hundreds] + "-hundred"
            print (r_hundreds)
            if(r_hundreds > 0):
                result += " and "
                result += translate_number(r_hundreds)
        else:
            digit2, r_tens = divmod(number, 10)
            if(digit2 < 2):
                result += less_than_20[number]
            else:
                result += tens[digit2 * 10]
                if(r_tens > 0):
                    result += "-" + less_than_20[r_tens]
    return result

def number_to_word_app():
    exit = False
    while exit == False:
        number_to_convert = input("Enter a number (\"Q\" to quit): ")
        if(number_to_convert.lstrip('-').isdigit()):
            number = int(number_to_convert)
            if(number > -1000000 and number < 1000000):
                word = translate_number(number)
                print (str(number) + " = " + word)
            else:
                print("Sorry, I can only translate words between within 6 digits of 0")
        elif number_to_convert == "Q":
            print ("Quitting...")
            exit = True
        else:
            print ("Input not accepted")

# uncomment line below to test function above
# number_to_word_app()

# ===============================================================================
# are there any numbers who equal their word's scrabble score (i.e. "seven" = 7)?
def experiment(low, high):
    matches = []
    for number in range(low, high):
        score = 0
        word_version = translate_number(number)
        words = word_version.split()
        for word in words:
            score += scrabble_score_calculator(word)
        if number == score:
            matches.append(number)
    if (len(matches) == 0):
        matches = "No results"
    return matches

# uncomment line below to test function above
# print (experiment(-20, 20))

# ===============================================================================
# classes - multiple inheritance
class Shape(object):
    def __init__(self, name, size):
        self.name = name
        self.size = size
    def set_name(self, name):
        self.name = name
    def set_size(self, size):
        self.size = size

class Color(object):
    def __init__(self, color):
        self.color = color
    def set_color(self, color):
        self.color = color

class ColorShape(Shape, Color):
    def __init__(self, name, color, size):
        Shape.__init__(self, name, size)
        Color.__init__(self, color)

    def display(self):
        print (self.size + " "+ self.color + " " + self.name)

# uncomment line below to test the classes above
# red_triangle = ColorShape("triangle", "red", "small")
# red_triangle.display()
# red_triangle.set_name("square")
# red_triangle.set_size("large")
# red_triangle.set_color("blue")
# red_triangle.display()

# ===============================================================================
# ===============================================================================
# ===============================================================================
# ===============================================================================
# ===============================================================================
# ===============================================================================
