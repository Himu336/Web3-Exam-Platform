// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract ExamContract {
    struct Exam {
        uint examID;
        string examName;
        uint totalQuestions;
        uint duration;
        uint totalMarks;
    }

    struct Question {
        uint questionID;
        string questionText;
        string[] options;
        uint correctOptionID; // Hidden from students
    }

    struct Submission {
        address student;
        uint[] selectedOptions;
    }

    struct Result {
        address student;
        uint[] marks;
        uint totalMarks;
    }

    address public admin;
    mapping(uint => Exam) public exams;
    mapping(uint => Question[]) public examQuestions;
    mapping(uint => Submission[]) public examSubmissions;
    mapping(uint => Result[]) public examResults;

    event ExamCreated(uint indexed examID);
    event AnswerSubmitted(uint indexed examID, address student);
    event ResultDeclared(uint indexed examID, address student, uint totalMarks);

    constructor() {
        admin = msg.sender;
    }

    // Step 1: Create Exam
    function createExam(
        uint _examID, string memory _examName, uint _totalQuestions, uint _duration, uint _totalMarks
    ) public {
        require(msg.sender == admin, "Only admin can create exam");
        exams[_examID] = Exam(_examID, _examName, _totalQuestions, _duration, _totalMarks);
        emit ExamCreated(_examID);
    }

    // Step 2: Faculty adds Questions
    function addQuestion(
        uint _examID, uint _questionID, string memory _questionText, string[] memory _options, uint _correctOptionID
    ) public {
        require(msg.sender == admin, "Only admin/faculty can add questions");
        examQuestions[_examID].push(Question(_questionID, _questionText, _options, _correctOptionID));
    }

    // Step 3: Student submits answers
    function submitAnswers(uint _examID, uint[] memory _selectedOptions) public {
        examSubmissions[_examID].push(Submission(msg.sender, _selectedOptions));
        emit AnswerSubmitted(_examID, msg.sender);
    }

    // Step 4: Admin computes results
    function computeResults(uint _examID) public {
        require(msg.sender == admin, "Only admin can compute results");
        Question[] storage questions = examQuestions[_examID];
        Submission[] storage submissions = examSubmissions[_examID];

        for (uint i = 0; i < submissions.length; i++) {
            uint totalMarks = 0;
            uint[] memory marks = new uint[](questions.length);

            for (uint j = 0; j < questions.length; j++) {
                if (submissions[i].selectedOptions[j] == questions[j].correctOptionID) {
                    marks[j] = 2; // Correct answer
                    totalMarks += 2;
                } else {
                    marks[j] = 0;
                }
            }

            examResults[_examID].push(Result(submissions[i].student, marks, totalMarks));
            emit ResultDeclared(_examID, submissions[i].student, totalMarks);
        }
    }

    // Step 5: Faculty can update results (Optional)
    function updateResult(uint _examID, address _student, uint[] memory _updatedMarks, uint _newTotal) public {
        require(msg.sender == admin, "Only faculty can update results");
        for (uint i = 0; i < examResults[_examID].length; i++) {
            if (examResults[_examID][i].student == _student) {
                examResults[_examID][i].marks = _updatedMarks;
                examResults[_examID][i].totalMarks = _newTotal;
            }
        }
    }
}
