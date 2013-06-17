var quiz = (function () {
    var exports = {};
    
    var questions = [{"questionText":"Sam thinks y=2x is going to ___ as x goes from 1 to 10", 
                      "options":["increase","decrease","inc then dec","dec then inc"],
                      "solutionIndex":0},
                     {"questionText":"Jill thinks y=2x-5 is going to ___ as x goes from 1 to 10", 
                      "options":["increase","decrease","inc then dec","dec then inc"],
                      "solutionIndex":0}];
    // structure with questionText, answer, options 
    
    
    var answers = []; // answers from student
    var score = 0; // score of student
    var currentQuestionIndex = 0; // index of the current question in the array
    
    
    // Takes a question index, q, and a student's answers
    // returns true if answer is correct
    function checkAnswer(q, ans){
        return false;
    }
    
    // Displays the current quiz question to the student
    function displayQuestion(){
        // ...
    }
    
    // called when a student gets a question right
    function incrementScore(){
        score++;
    }
    

});