/***************************************
TO DO: make an 'increment score' function and a 'get current question value' function?

****************************************/




var quiz = (function () {
    
    
    var usingParse = true;
    
    Parse.initialize("9TKr3OxTqdAjsMa7Z1sf0QgqM8RiCEYiAc8svfMd", "XdJ3RZ0C47VMtyfZUqFKwUxf5D75Sm2Z7ZGs6zXm");
    var exports = {};
    
    var quizScore;
    
    var questions = [{"questionText":"Sam thinks y=2x is going to ___ as x goes from 1 to 10", 
                      "options":["increase","decrease","inc then dec","dec then inc"],
                      "solutionIndex":0},
                     {"questionText":"Jill thinks y=2x-5 is going to ___ as x goes from 1 to 10", 
                      "options":["decrease","increase","inc then dec","dec then inc"],
                      "solutionIndex":1}];
    // structure with questionText, answer, options 
    
    
    var answers = []; // answers from student
    var score = 0; // score of student
    var currentQuestionIndex = 0; // index of the current question in the array
    
    
    // Takes a question index, q, and a student's answers
    // returns true if answer is correct
    
    
    function checkAnswer(ans){
        var question = questions[currentQuestionIndex];
        return question.options[question.solutionIndex] == ans;
    } 
    
    
    function getAnswers(){
        
        /***** get user's answer and deal with score *****/
        var answer = $('input[name="choice'+currentQuestionIndex+'"]:checked').val()
        
        if (checkAnswer(answer)){
            $('.feedback').text("Congratulations, you are correct!");
            score ++;
        } else {
            $('.feedback').text("Sorry, that's the wrong answer.");
        }   
        
        if(usingParse){
            quizScore.set("score", score);
        }else{
            localStorage['score']=score;
        }
        
        $('.score').text("Score: "+score)
        
        nextQuestion();
    }
    
    function nextQuestion(){
        /***** disable check answers *****/
        $('button.check').off("click",getAnswers);
        var nextQ = $(".nextQ");
        
        /***** next question *****/
        currentQuestionIndex ++;
        
        if (currentQuestionIndex < questions.length){
            nextQ.css("visibility","visible");
            nextQ.on("click",displayQuestion);
            
//            localStorage['currentQuestionIndex']=currentQuestionIndex;
            quizScore.set("currentQuestionIndex",currentQuestionIndex);
            quizScore.save();
            
        }
    }
    
/***** Displays the current quiz question to the student *****/
    function displayQuestion(){
        
//        console.log("current question according to display:",currentQuestionIndex)
        var div = $('.quiz');
        
        var qDiv = $(".quiz");
        var qSpace = $(".qtext");
        
        //q is the current question object
        var q = questions[currentQuestionIndex];
        qSpace.text((parseInt(currentQuestionIndex)+1)+") "+q.questionText);
        
        /***** set up the next question's answer choices *****/
        var form = $('.options');
        form.html("");
        for (var i =0; i< q.options.length; i++){
            form.append($("<input></input>",{type:"radio",
                                            name:"choice"+currentQuestionIndex,
                                            value:q.options[i],
                                            "data-index":i}));
            form.append(" ",q.options[i],$("</br>"));
        }
        
        /***** enable the check answer button *****/
        var checkButton = $("button.check");
        checkButton.on("click",getAnswers);
        $('.nextQ').css("visibility","hidden");
        
//        console.log("question has been displayed");
    }
    
/***** initialize the quiz question structure *****/
    function setup(){
        /***** basic structure *****/
        var structure = ""+
            "<div class='question'>"+
            "   <p class = 'qtext'></p>"+
            "   <form class='options'></form>"+
            "   <button class='check'>Check Answer</button>"+
            "   <div class='feedback'></div>"+
            "   <div class='score'></div>"+
            "   <button class=nextQ>Next Question</button>"+
            "</div>";
        
        $('.quiz').append(structure);
        
        
        /***** setup parse (or not) *****/
        if(usingParse){
            var QuizScore = Parse.Object.extend("QuizScore");
            
            var query = new Parse.Query(QuizScore);
            query.exists("score");
            query.first({
                success: function(object){
                    if (object != undefined){
//                        console.log("got it");
                        quizScore=object;
                        score=object.get("score");
//                        console.log("score:",score);
                        currentQuestionIndex=object.get("currentQuestionIndex");
//                        console.log("index:",currentQuestionIndex);
                        
                        displayQuestion();
                        
                    } else {
                        quizScore = new QuizScore;
                        displayQuestion();
                    }
                },
                error: function(error){
                    console.log("error :(");
                }
            });
        } else {
            if(localStorage.score != undefined){
                score = localStorage.score;
                currentQuestionIndex = localStorage.currentQuestionIndex;
                $('.score').text("Score: "+score);
            }
        }
    }
    
    exports.setup = setup;
    return exports;
})();

$(document).ready(function () {
    quiz.setup();
    
//    var req = $.ajax({
//        async:false,
//        url: "http://localhost:8080/",
//        //data: {id:10}
//    })
    
//    req.done(function(msg){
//        console.log("message:",msg);
//    })
});